import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import TrackPlayer from 'react-native-track-player';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ActivityIndicator } from "react-native-paper";

import SeekBar from "../../components/player/SeekBar";
import SwipePlaylist from "../../components/player/SwipePlaylist";

import { fetchNext } from "../../modules/remote/API";
import { rippleConfig } from "../../styles/Ripple";
import { appColor } from "../../styles/App";

import {NativeModules} from 'react-native';
const LinkBridge = NativeModules.LinkBridge;
const YOUTUBE_WATCH = "https://www.youtube.com/watch?v=";

export default class PlayView extends PureComponent {
    constructor(props) {
        super(props);
        TrackPlayer.setupPlayer();
        TrackPlayer.updateOptions({
            stopWithApp: true,
            alwaysPauseOnInterruption: true,

            capabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT,
                TrackPlayer.CAPABILITY_SKIP_TO_PREVIOUS,
                TrackPlayer.CAPABILITY_STOP
            ],

            compactCapabilities: [
                TrackPlayer.CAPABILITY_PLAY,
                TrackPlayer.CAPABILITY_PAUSE,
                TrackPlayer.CAPABILITY_SKIP_TO_NEXT
            ]
        });

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
            console.log("track changed: ");
            this.refreshUI();
        });

        TrackPlayer.addEventListener("playback-queue-ended", params => {
            console.log("queue ended");
        });

        TrackPlayer.addEventListener("playback-error", params => {
            console.log("error");
        });

        this.state = {
            isPlaying: false,
            isLoading: false,
            isRepeating: false,

            id: null,
            artwork: null,
            title: null,
            artist: null
        };
    }

    refreshUI = () => {
        TrackPlayer.getCurrentTrack().then(id => {
            TrackPlayer.getTrack(id).then(track => {
                this.setState({
                    id: track.id,
                    artwork: track.artwork,
                    title: track.title,
                    artist: track.artist,
                    isPlaying: true,
                    isLoading: false
                });
            });
        });
    }

    getUrl = id => {
        return new Promise(
            function(resolve, reject) {
                LinkBridge.getString(
                    YOUTUBE_WATCH + id,
                    url => resolve(url)
                );
            }
        );
    }

    handleSkip = (array, forward) => {
        TrackPlayer.getCurrentTrack().then(id => array.map((track, index) => {
            if (track.id == id) {
                let next;
                if (forward && index + 1 < array.length)
                    next = index + 1;
                else if (!forward && index > 0)
                    next = index - 1;
                else
                    next = 0;

                this.getUrl(array[next].id).then( async(url) => {
                    var track = array.splice(next, 1)[0];
                    track.url = url;

                    await TrackPlayer.remove(track.id);

                    let afterId = null;
                    if (next < array.length)
                        afterId = array[next].id;

                    await TrackPlayer.add(track, afterId);
                    await TrackPlayer.skip(track.id);
                });
                
                return;
            }
        }));
        
    }

    skip = forward => {
        let skipOrSeek = new Promise(
            function(resolve, reject) {
                if (!forward)
                    TrackPlayer.getPosition().then(position => {
                        if (position > 10) {
                            resolve(true);
                        } else
                            resolve(false);
                    });
                else
                    resolve(false);
            }
        );
            
        skipOrSeek.then(skipping => {
            if (!skipping)
                TrackPlayer.getQueue().then(array => this.handleSkip(array, forward));
            else
                TrackPlayer.seekTo(0);
        });
    }


    skipNext = () => {
        TrackPlayer.getQueue().then(array => {
            console.log(array);
            TrackPlayer.getCurrentTrack().then(id => {
                array.map((track, index) => {
                    if (track.id == id) {
                        let next;
                        if (index + 1 >= array.length)
                            next = 0;
                        else
                            next = index + 1;

                        array[next].url = LinkBridge.getString(
                            YOUTUBE_WATCH + array[next].id,
                            url => {
                                array[next].url = url;
                                TrackPlayer.skipToNext();
                            }
                        );
                    }
                });
            })
        });
    }
      
    skipPrevious = () => {
        try {
            TrackPlayer.getPosition().then(async(position) => {
                if (position > 10)
                    await TrackPlayer.seekTo(0);
                else
                    await TrackPlayer.skipToPrevious();
            });
        } catch (_) {}
    }
  
    startPlayback = () => {
        if (this.props.route.params != undefined) {
            this.setState({isLoading: true});
            const { playlistId, videoId } = this.props.route.params;
            this.props.route.params = undefined;
    
            fetchNext(videoId, playlistId).then(
                playlist => this.getUrl(playlist.list[playlist.index].id)
                    .then(async(url) => {
                        playlist.list[playlist.index].url = url;
                        await TrackPlayer.reset();
                        await TrackPlayer.add(playlist.list);
                        await TrackPlayer.skip(playlist.list[playlist.index].id);
                        await TrackPlayer.play();
                    })
            );
        } else {
            if (!this.state.isPlaying)
                TrackPlayer.play().then(() => this.setState({isPlaying: true}));
            else
                TrackPlayer.pause().then(() => this.setState({isPlaying: false}));
        }
    }

    render() {
        if (this.props.route.params != undefined)
            this.startPlayback();

        return (
            <View style={stylesTop.mainView}>
                <View style={stylesTop.vertContainer}>
                    <View style={stylesMid.midBit}>
                        <Image style={stylesMid.midImage} source={{uri: this.state.artwork}}/>
                    </View>

                    <View style={stylesBottom.bottomBit}>
                        <View style={stylesBottom.songContainer}>
                            <Pressable onPress={() => {}} android_ripple={rippleConfig}>
                                <MaterialIcons name="thumb-down" color="darkgray" size={30}/>
                            </Pressable>

                            <Text numberOfLines={1} style={stylesBottom.titleText}>{this.state.title}</Text>

                            <Pressable onPress={() => {}} android_ripple={rippleConfig}>
                                <MaterialIcons name="thumb-up" color="darkgray" size={30}/>
                            </Pressable>
                        </View>

                        <Text numberOfLines={1} style={stylesBottom.subtitleText}>{this.state.artist}</Text>

                        <SeekBar/>
                        
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