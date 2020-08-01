import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import TrackPlayer, { TrackMetadata } from 'react-native-track-player';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ActivityIndicator } from "react-native-paper";

import SeekBar from "../../components/player/SeekBar";
import SwipePlaylist from "../../components/player/SwipePlaylist";

import { fetchNext } from "../../modules/remote/API";
import { rippleConfig } from "../../styles/Ripple";
import { appColor } from "../../styles/App";

import { NativeModules } from 'react-native';

const LinkBridge = NativeModules.LinkBridge;
const YOUTUBE_WATCH = "https://www.youtube.com/watch?v=";

export default class PlayView extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isPlaying: false,
            isLoading: false,
            isRepeating: false,
            isStopped: true,

            track: null
        };

        TrackPlayer.addEventListener("playback-state", async(params) => {
            switch (params["state"]) {
                case TrackPlayer.STATE_NONE:
                    break;
                case TrackPlayer.STATE_PLAYING:
                    this.refreshUI();
                    break;
                case TrackPlayer.STATE_PAUSED:
                    this.setState({isPlaying: false});
                    break;
                case TrackPlayer.STATE_STOPPED:
                    this.setState({isPlaying: false});
                    break;
                case TrackPlayer.STATE_BUFFERING:
                    this.setState({isPlaying: false, isLoading: true});
            }
        });

        TrackPlayer.addEventListener("playback-track-changed", params => {
            this.refreshUI();
        });

        TrackPlayer.addEventListener("playback-queue-ended", params => {
            //console.log("queue ended");
        });

        TrackPlayer.addEventListener("playback-error", params => {
            //console.log("error");
        });

        TrackPlayer.addEventListener("remote-next", params => {
            TrackPlayer.skipToNext();
        });

        TrackPlayer.addEventListener("remote-previous", params => {
            TrackPlayer.skipToPrevious();
        });

        TrackPlayer.addEventListener("remote-play", params => {
            TrackPlayer.play();
        });

        TrackPlayer.addEventListener("remote-pause", params => {
            TrackPlayer.pause();
        });

        TrackPlayer.addEventListener("remote-stop", params => {
            TrackPlayer.stop();
            this.props.navigation.goBack();
            this.setState({isStopped: true});
        });

        TrackPlayer.addEventListener("remote-seek", params => {
            TrackPlayer.seekTo(Math.floor(params["position"]));
        });
    }

    componentDidMount() {
        this.refreshUI();
    }

    refreshUI = async() => {
        let id = await TrackPlayer.getCurrentTrack();
        if (id != null) {
            let newstate = {};
            let track = await TrackPlayer.getTrack(id);
            let state = await TrackPlayer.getState();

            newstate.track = track;
            switch (state) {
                case TrackPlayer.STATE_NONE:
                    break;
                case TrackPlayer.STATE_PLAYING:
                    newstate.isPlaying = true;
                    newstate.isLoading = false;
                    break;
                case TrackPlayer.STATE_PAUSED:
                    newstate.isPlaying = false;
                    newstate.isLoading = false;
                    break;
                case TrackPlayer.STATE_STOPPED:
                    newstate.isPlaying = false;
                    newstate.isLoading = false;
                    newstate.isStopped = true;
                    this.props.navigation.goBack();
                    break;
                case TrackPlayer.STATE_BUFFERING:
                    newstate.isPlaying = false;
                    newstate.isLoading = true;
                    break;
            }

            this.setState(newstate);
        }
    }

    getUrl = id => {
        return new Promise(
            (resolve, reject) => {
                LinkBridge.getString(
                    YOUTUBE_WATCH + id,
                    url => resolve(url)
                );
            }
        );
    }

    handleSkip = async(array, index, forward) => {
        let next;
        if (forward && index + 1 < array.length)
            next = index + 1;
        else if (!forward && index > 0)
            next = index - 1;
        else
            next = 0;

        if (array[next].url == null) {
            let track = array[next];
            track.url = await this.getUrl(array[next].id);
            
            await TrackPlayer.remove(track.id);
            let afterId = null;
            if (next < array.length)
                afterId = array[next + 1].id;

            await TrackPlayer.add(track, afterId);
        }

        if (forward)
            TrackPlayer.skipToNext();
        else
            TrackPlayer.skipToPrevious().catch(() => TrackPlayer.seekTo(0));
    }

    skip = async(forward) => {
        let id = await TrackPlayer.getCurrentTrack();
        let index;
        let track = await TrackPlayer.getTrack(id);
        let array = await TrackPlayer.getQueue();

        for (let i = 0; i < array.length; i++) {
            if (track.id == id) {
                index = i;
                break;
            }
        }

        if (forward) {
            if (index < array.length)
                this.handleSkip(array, index, forward);

        } else {
            let position = await TrackPlayer.getPosition();

            if (position > 10)
                TrackPlayer.seekTo(0);
            else
                this.handleSkip(array, index, forward);
        }
    }
  
    startPlayback = () => {
        if (this.props.route.params != undefined) {
            this.setState({
                isLoading: true,
                isStopped: false
            });

            const { playlistId, videoId } = this.props.route.params;
            this.props.route.params = undefined;
    
            fetchNext(videoId, playlistId).then(
                playlist => this.getUrl(playlist.list[playlist.index].id)
                    .then(async(url) => {
                        playlist.list[playlist.index].url = url;
                        await TrackPlayer.reset();
                        for (let i = 0; i < playlist.list.length; i++) {
                            let track = playlist.list[i];
                            track.url = await this.getUrl(track.id);

                            if (this.state.isStopped)
                                return;
                            
                            await TrackPlayer.add(track);

                            if (i == playlist.index)
                                await TrackPlayer.skip(playlist.list[playlist.index].id);
                                TrackPlayer.play();
                        }
                    })
            );
        } else {
            if (!this.state.isPlaying)
                TrackPlayer.play();
            else
                TrackPlayer.pause();
        }
    }

    render() {
        if (this.props.route.params != undefined)
            this.startPlayback();

        if (this.state.track == null) {
            var title = null;
            var artist = null;
            var artwork = null;
        } else
            var {title, artist, artwork} = this.state.track;

        return (
            <View style={stylesTop.mainView}>
                <View style={stylesTop.vertContainer}>
                    <View style={stylesMid.midBit}>
                        <Image style={stylesMid.midImage} source={{uri: artwork}}/>
                    </View>

                    <View style={stylesBottom.bottomBit}>
                        <View style={stylesBottom.songContainer}>
                            <Pressable onPress={() => {}} android_ripple={rippleConfig}>
                                <MaterialIcons name="thumb-down" color="darkgray" size={30}/>
                            </Pressable>

                            <Text numberOfLines={1} style={stylesBottom.titleText}>{title}</Text>

                            <Pressable onPress={() => {}} android_ripple={rippleConfig}>
                                <MaterialIcons name="thumb-up" color="darkgray" size={30}/>
                            </Pressable>
                        </View>

                        <Text numberOfLines={1} style={stylesBottom.subtitleText}>{artist}</Text>

                        <SeekBar navigation={this.props.navigation}/>
                        
                        <View style={stylesBottom.buttonContainer}>
                        <Pressable onPress={() => {}} android_ripple={rippleConfig}>
                            <MaterialIcons name="shuffle" color="black" size={30}/>
                        </Pressable>

                        <Pressable onPress={() => this.skip(false)} android_ripple={rippleConfig}>
                            <MaterialIcons name="skip-previous" color="black" size={40}/>
                        </Pressable>

                        <Pressable onPress={this.state.isLoading ?null :this.startPlayback}
                                android_ripple={rippleConfig}>
                            {this.state.isLoading
                                ? <ActivityIndicator color="black" size="small"/>
                                : <MaterialIcons name={this.state.isPlaying ? "pause" : "play-arrow"} color="black" size={40}/>
                            }
                        </Pressable>

                        <Pressable onPress={() => this.skip(true)} android_ripple={rippleConfig}>
                            <MaterialIcons name="skip-next" color="black" size={40}/>
                        </Pressable>

                        <Pressable onPress={() => {}} android_ripple={rippleConfig}>
                            <MaterialIcons name="repeat" color="black" size={30}/>
                        </Pressable>
                    </View>
                        
                        <View style={stylesTop.topBit}>
                            <Pressable onPress={() => this.props.navigation.goBack()} android_ripple={rippleConfig} style={stylesTop.topFirst}>
                                <MaterialIcons name="keyboard-arrow-down" color={"black"} size={30}/>
                            </Pressable>

                            <Pressable android_ripple={rippleConfig} style={stylesTop.topThird}>
                                <MaterialIcons name="more-vert" color={"black"} size={30}/>
                            </Pressable>
                        </View>
                    </View>
                </View>

                <SwipePlaylist minimumHeight={50}
                               onMinimize={() => {}}
                               onMaximize={() => {}}
                               style={stylesRest.container}/>
            </View>
        )
    }
}

const stylesRest = StyleSheet.create({
    container: {
        backgroundColor: "darkgray",
        flexDirection: "column",
        justifyContent: "center",
        width: "100%",
        paddingBottom: 10,
        alignItems: "center",
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,

        position: "absolute",
        bottom: 0
    },
});

const stylesBottom = StyleSheet.create({
    bottomBit: {
        paddingTop: 20,
        flexGrow: 1,
        flex: 1,
    },

    songContainer: {
        paddingTop: 20,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },

    subtitleText: {
        paddingTop: 5,
        alignSelf: "center",
        overflow: "hidden",
        paddingLeft: 10,
        paddingRight: 10,
        width: "80%",
        textAlign: "center",
    },

    titleText: {
        fontSize: 25,
        fontWeight: "bold",
        overflow: "hidden",
        paddingLeft: 10,
        paddingRight: 10,
        width: "80%",
        textAlign: "center",
    },

    buttonContainer: {
        paddingTop: 20,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between"
    }
});

const stylesMid = StyleSheet.create({
    midBit: {
        flex: 1,
        justifyContent: "center",
        alignItems: "center"
    },

    midImage: {
        width: "100%",
        height: undefined,
        aspectRatio: 1,
        backgroundColor: appColor.background.backgroundColor
    }
});


const stylesTop = StyleSheet.create({
    mainView: {
        paddingTop: 50,
        flex: 1
    },

    topBit: {
        height: 90,
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
    },

    topSecond: {
        flexDirection: "row",
        backgroundColor: "brown",
        paddingLeft: 10,
        paddingRight: 10,
        paddingBottom: 5,
        paddingTop: 5,
        borderRadius: 25,
    },

    topSecondTextOne: {
        fontWeight: "bold",
        color: "white",
        paddingLeft: 15,
        paddingRight: 15,
    },

    topSecondTextTwo: {
        fontWeight: "bold",
        color: "white",
        paddingLeft: 15,
        paddingRight: 15,
    },

    vertContainer: {
        flex: 1,
        marginLeft: 50,
        marginRight: 50,
    }
});