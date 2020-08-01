import React, { PureComponent } from "react";
import { View, Text, StyleSheet, Image, Pressable } from "react-native";
import TrackPlayer from 'react-native-track-player';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ActivityIndicator } from "react-native-paper";

import SeekBar from "../../components/player/SeekBar";
import SwipePlaylist from "../../components/player/SwipePlaylist";

import { rippleConfig } from "../../styles/Ripple";
import { appColor } from "../../styles/App";
import { startPlayback, skip, setPlay } from "../../service";

export default class PlayView extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            isPlaying: false,
            isLoading: false,
            isRepeating: false,
            isStopped: true,

            track: null,
            playlist: null,
        };
    }

    componentDidMount() {
        this.refreshUI();
        this._unsub = [];

        this._unsub.push(
            TrackPlayer.addEventListener("playback-state", params => {
                this.refreshUI();
            })
        );

        this._unsub.push(
            TrackPlayer.addEventListener("playback-track-changed", params => {
                this.refreshUI();
            })
        );
    }

    componentWillUnmount() {
        for (let i = 0; i < this._unsub.length; i++)
            this._unsub[i].remove();
    }

    refreshUI = async() => {
        let id = await TrackPlayer.getCurrentTrack();
        if (id != null) {
            let newstate = {};

            let playlist = await TrackPlayer.getQueue();
            let track = await TrackPlayer.getTrack(id);
            let state = await TrackPlayer.getState();

            newstate.playlist = playlist;
            newstate.track = track;
            switch (state) {
                case TrackPlayer.STATE_NONE:
                    break;
                case TrackPlayer.STATE_PLAYING:
                    newstate.isPlaying = true;
                    newstate.isLoading = false;
                    newstate.isStopped = false;
                    break;
                case TrackPlayer.STATE_PAUSED:
                    newstate.isPlaying = false;
                    newstate.isLoading = false;
                    newstate.isStopped = false;
                    break;
                case TrackPlayer.STATE_STOPPED:
                    newstate.isPlaying = false;
                    newstate.isLoading = false;
                    newstate.isStopped = true;
                    this.props.navigation.goBack();
                    return;
                case TrackPlayer.STATE_BUFFERING:
                    newstate.isPlaying = false;
                    newstate.isLoading = true;
                    newstate.isStopped = false;
                    break;
            }

            this.setState(newstate);
        }
    }

    render() {
        if (this.props.route.params != undefined) {
            this.setState({
                isLoading: true,
                isStopped: false
            });
            startPlayback(this.props.route.params);
            this.props.route.params = undefined;
        }

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

                            <Pressable onPress={() => skip(false)} android_ripple={rippleConfig}>
                                <MaterialIcons name="skip-previous" color="black" size={40}/>
                            </Pressable>

                            <Pressable onPress={this.state.isLoading ?null :() => setPlay(this.state.isPlaying)}
                                    android_ripple={rippleConfig}>
                                {this.state.isLoading
                                    ? <ActivityIndicator color="black" size="small"/>
                                    : <MaterialIcons name={this.state.isPlaying ? "pause" : "play-arrow"} color="black" size={40}/>
                                }
                            </Pressable>

                            <Pressable onPress={() => skip(true)} android_ripple={rippleConfig}>
                                <MaterialIcons name="skip-next" color="black" size={40}/>
                            </Pressable>

                            <Pressable onPress={() => {}} android_ripple={rippleConfig}>
                                <MaterialIcons name="repeat" color="black" size={30}/>
                            </Pressable>
                        </View>
                        
                        <View style={stylesTop.topBit}>
                            <Pressable onPress={this.props.navigation.goBack} android_ripple={rippleConfig} style={stylesTop.topFirst}>
                                <MaterialIcons name="keyboard-arrow-down" color={"black"} size={30}/>
                            </Pressable>

                            <Pressable android_ripple={rippleConfig} style={stylesTop.topThird}>
                                <MaterialIcons name="more-vert" color={"black"} size={30}/>
                            </Pressable>
                        </View>
                    </View>
                </View>

                <SwipePlaylist minimumHeight={50}
                               playlist={this.state.playlist}
                               track={this.state.track}
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