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
        }
    }

    refreshUI = () => {
        if (!this.state.isPlaying)
        TrackPlayer.getCurrentTrack().then(id => {
            TrackPlayer.getTrack(id).then(track => {
                this.setState({
                    id: id,
                    artwork: track.artwork,
                    title: track.title,
                    artist: track.artist,
                    isPlaying: true,
                    isLoading: false
                });
            });
        });
    }

    skipNext = async() => {
        try {
            await TrackPlayer.skipToNext();
        } catch (_) {}
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
  
    startPlayback = async() => {
        if (this.props.route.params != undefined) {
            this.setState({isLoading: true});
            const { playlistId, videoId } = this.props.route.params;
            this.props.route.params = undefined;
    
            fetchNext(videoId, playlistId).then(
                async(playlist) => {
                    playlist.list.map(track => track.getUrl());
                    await TrackPlayer.reset();
                    await TrackPlayer.add(playlist.list);
                    await TrackPlayer.skip(playlist.list[playlist.index].id);
                    await TrackPlayer.play();
                }
            );
            
        } else {
            if (this.state.isPlaying)
                await TrackPlayer.play();
            else
                await TrackPlayer.pause();
        }
    }

    render() {
        if (this.props.route.params != undefined)
            this.startPlayback();

        //const { position, bufferedPosition, duration } = useTrackPlayerProgress();
        //{this.props.isDisliked ? "black" : "darkgray"}
        //{this.props.isLiked ? "black" : "darkgray"}
        //{isRepeating ? "repeat-one" : "repeat"}

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

                        <Pressable onPress={this.skipPrevious} android_ripple={rippleConfig}>
                            <MaterialIcons name="skip-previous" color="black" size={40}/>
                        </Pressable>

                        <Pressable onPress={this.state.isLoading ?null :this.startPlayback}
                                android_ripple={rippleConfig}>
                            {this.state.isLoading
                                ? <ActivityIndicator color="black" size="small"/>
                                : <MaterialIcons name={this.state.isPlaying ? "pause" : "play-arrow"} color="black" size={40}/>
                            }
                        </Pressable>

                        <Pressable onPress={this.skipNext} android_ripple={rippleConfig}>
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
  
const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "center",
        backgroundColor: "#F5FCFF"
    },
    description: {
        width: "80%",
        marginTop: 20,
        textAlign: "center"
    },
    player: {
        marginTop: 40
    },
    state: {
        marginTop: 20
    }
});

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