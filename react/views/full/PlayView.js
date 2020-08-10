import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    ActivityIndicator,
    Dimensions
} from "react-native";

import TrackPlayer from 'react-native-track-player';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import SeekBar from "../../components/player/SeekBar";
import SwipePlaylist from "../../components/player/SwipePlaylist";

import { rippleConfig } from "../../styles/Ripple";
import { appColor } from "../../styles/App";
import { startPlayback, skip, setPlay, setRepeat } from "../../service";
import { isRepeating } from "../../service";

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

            if (isRepeating)
                newstate.isRepeating = true;
            else
                newstate.isRepeating = false;

            this.setState(newstate);
        }
    }

    setRepeat = () => {
        setRepeat(!isRepeating);
        this.setState({isRepeating: isRepeating});
    }

    render() {
        var isLoading;
        if (this.props.route.params != undefined) {
            isLoading = true;
            var {title, subtitle, thumbnail} = this.props.route.params;
            var artist = subtitle;
            var artwork = thumbnail;

            TrackPlayer.reset();
            startPlayback(this.props.route.params)
                .catch(params => this.props.navigation.navigate("Captcha", params));

            this.props.route.params = undefined;
        } else {
            isLoading = this.state.isLoading;
            if (this.state.track != null)
                var {title, artist, artwork} = this.state.track;
            else {
                var title = null;
                var artist = null;
                var artwork = null;
            }
        }

        return (
            <>
                <View style={stylesTop.vertContainer}>
                    <View style={imageStyles.view}>
                        <Image style={imageStyles.image} source={{uri: artwork}}/>
                    </View>

                    <View style={stylesBottom.bottomBit}>
                        <View style={{width: Dimensions.get("screen").height * 0.39}}>
                            <View style={controlStyles.container}>
                                <Pressable onPress={() => {}} android_ripple={rippleConfig}>
                                    <MaterialIcons name="thumb-down" color="darkgray" size={30}/>
                                </Pressable>

                                <View style={{alignItems: "center", flex: 1}}>
                                    <Text numberOfLines={1} style={stylesBottom.titleText}>{title}</Text>
                                    <Text numberOfLines={1} style={stylesBottom.subtitleText}>{artist}</Text>
                                </View>

                                <Pressable onPress={() => {}} android_ripple={rippleConfig}>
                                    <MaterialIcons name="thumb-up" color="darkgray" size={30}/>
                                </Pressable>
                            </View>

                            <SeekBar navigation={this.props.navigation}/>
                            
                            <View style={stylesBottom.buttonContainer}>
                                <Pressable onPress={() => {}} android_ripple={rippleConfig}>
                                    <MaterialIcons name="shuffle" color="black" size={30}/>
                                </Pressable>

                                <Pressable onPress={() => skip(false)} android_ripple={rippleConfig}>
                                    <MaterialIcons name="skip-previous" color="black" size={40}/>
                                </Pressable>

                                <View style={{alignItems: "center", justifyContent: "center", backgroundColor: appColor.background.backgroundColor, width: 60, height: 60, borderRadius: 30}}>
                                    {isLoading
                                        ?   <ActivityIndicator color="white" size="large"/>

                                        :   <Pressable onPress={() => setPlay(this.state.isPlaying)} android_ripple={rippleConfig}>
                                                <MaterialIcons name={this.state.isPlaying ? "pause" : "play-arrow"} color="white" size={40}/>
                                            </Pressable>
                                    }
                                </View>
                                

                                <Pressable onPress={() => skip(true)} android_ripple={rippleConfig}>
                                    <MaterialIcons name="skip-next" color="black" size={40}/>
                                </Pressable>

                                <Pressable onPress={this.setRepeat} android_ripple={rippleConfig}>
                                    <MaterialIcons name={this.state.isRepeating ?"repeat-one" :"repeat"} color="black" size={30}/>
                                </Pressable>
                            </View>

                            <View style={{justifyContent: "space-between", flexDirection: "row", paddingTop: 30}}>
                                <Pressable onPress={this.props.navigation.goBack} android_ripple={rippleConfig} style={stylesTop.topFirst}>
                                    <MaterialIcons name="keyboard-arrow-down" color={"black"} size={30}/>
                                </Pressable>

                                <Pressable android_ripple={rippleConfig} style={stylesTop.topThird}>
                                    <MaterialIcons name="more-vert" color={"black"} size={30}/>
                                </Pressable>
                            </View>
                        </View>
                    </View>
                </View>

                <SwipePlaylist minimumHeight={50}
                               playlist={this.state.playlist}
                               track={this.state.track}
                               style={stylesRest.container}/>
            </>
        )
    }
}

const stylesRest = StyleSheet.create({
    container: {
        backgroundColor: appColor.background.backgroundColor,
        paddingBottom: 10,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        position: "absolute",
        bottom: 0,
        width: "100%",
    },
});

const stylesBottom = StyleSheet.create({
    bottomBit: {
        height: Dimensions.get("screen").height * 0.39,
        alignItems: "center",
        justifyContent: "center",
        alignSelf: "stretch",
        paddingTop: 30
    },

    subtitleText: {
        paddingTop: 5,
        alignSelf: "center",
        overflow: "hidden",
        width: "80%",
        textAlign: "center",
    },

    titleText: {
        fontSize: 25,
        fontWeight: "bold",
        overflow: "hidden",
        width: "80%",
        textAlign: "center",
    },

    buttonContainer: {
        flexDirection: "row",
        alignItems: "center",
        justifyContent: "space-between",
        paddingTop: 20
    }
});

const imageStyles = StyleSheet.create({
    view: {
        alignItems: "center",
        alignSelf: "stretch",
        height: Dimensions.get("screen").height * 0.39
    },

    image: {
        //width: Dimensions.get("screen").height * 0.39,
        height: "100%",
        aspectRatio: 1,
        backgroundColor: appColor.background.backgroundColor
    }
});

const controlStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center"
    },
});


const stylesTop = StyleSheet.create({
    topSecond: {
        flexDirection: "row",
        backgroundColor: "brown",
    },

    topSecondTextOne: {
        fontWeight: "bold",
        color: "white",
    },

    topSecondTextTwo: {
        fontWeight: "bold",
        color: "white",
    },

    vertContainer: {
        height: "100%",
        width: "100%",
        flexWrap: "wrap",
        alignContent: "stretch",
        justifyContent: "center",
        paddingBottom: 30
    }
});