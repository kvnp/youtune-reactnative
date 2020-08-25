import React, { PureComponent } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    ActivityIndicator,
    Platform,
    ScrollView
} from "react-native";

import TrackPlayer from 'react-native-web-track-player';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import SeekBar from "../../components/player/SeekBar";
import SwipePlaylist from "../../components/player/SwipePlaylist";

import { rippleConfig } from "../../styles/Ripple";
import { appColor } from "../../styles/App";
import { startPlayback, skip, setPlay, setRepeat, startPlaylist } from "../../service";
import { isRepeating } from "../../service";
import { getSongLike, likeSong } from "../../modules/storage/MediaStorage";

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
            isLiked: null
        };
    }

    componentDidMount() {
        this.refreshUI();
        if (Platform.OS != "web") {
            this._unsub = [];

            this._unsub.push(
                TrackPlayer.addEventListener("playback-state", params => this.refreshUI())
            );

            this._unsub.push(
                TrackPlayer.addEventListener("playback-track-changed", params => this.refreshUI())
            );
        }
    }

    componentWillUnmount() {
        if (Platform.OS != "web") {
            for (let i = 0; i < this._unsub.length; i++)
                this._unsub[i].remove();
        }
    }

    refreshUI = async() => {
        let id = await TrackPlayer.getCurrentTrack();
        if (id != null) {
            let newstate = {};

            let playlist = await TrackPlayer.getQueue();
            let track = await TrackPlayer.getTrack(id);
            let state = await TrackPlayer.getState();
            let isLiked = await getSongLike(id);

            newstate.playlist = playlist;
            newstate.track = track;
            newstate.isLiked = isLiked;
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

            if (this.props.route.params.list != undefined) {
                var index = this.props.route.params.index;
                var list = this.props.route.params.list;
                var { title, artist, artwork, id } = list[index];

                startPlaylist(this.props.route.params);
            } else {
                var { title, subtitle, thumbnail, id } = this.props.route.params;
                var artist = subtitle;
                var artwork = thumbnail;

                startPlayback(this.props.route.params);
                    //.catch(params => this.props.navigation.navigate("Captcha", params));
            }

            this.props.route.params = undefined;
        } else {
            isLoading = this.state.isLoading;
            if (this.state.track != null)
                var {title, artist, artwork, id } = this.state.track;
            else {
                var id = null;
                var title = null;
                var artist = null;
                var artwork = null;
            }
        }

        return (
            <>
                <View style={stylesTop.vertContainer}>
                    <View style={imageStyles.view}>
                        <Image resizeMode="contain" style={imageStyles.image} source={{uri: artwork}}/>
                    </View>

                    <View style={{alignSelf: "stretch", justifyContent: "space-around", alignItems: "stretch", paddingRight: "2%", paddingLeft: "2%", justifyContent: "center"}}>
                        <View style={controlStyles.container}>
                            <Pressable onPress={() => {likeSong(id, false); this.refreshUI();}} android_ripple={rippleConfig}>
                                <MaterialIcons
                                    name="thumb-down"

                                    color={
                                        this.state.isLiked == null
                                            ? "darkgray"
                                            : !this.state.isLiked
                                                ? "black"
                                                : "darkgray"
                                    }

                                    size={30}
                                />
                            </Pressable>

                            
                            {Platform.OS != "web"
                                ? <View style={{alignItems: "center", flex: 1}}>
                                    <ScrollView horizontal={true} style={{marginHorizontal: 10}}>
                                        <Text numberOfLines={1} style={stylesBottom.titleText}>{title}</Text>
                                    </ScrollView>

                                    <ScrollView horizontal={true} style={{marginHorizontal: 10}}>
                                        <Text numberOfLines={1} style={stylesBottom.subtitleText}>{artist}</Text>
                                    </ScrollView>
                                  </View>

                                : <View style={{alignItems: "center"}}>
                                    <Text adjustsFontSizeToFit={true} ellipsizeMode="tail" numberOfLines={1} style={[stylesBottom.titleText, {marginHorizontal: 10, width: 150}]}>{title}</Text>
                                    <Text adjustsFontSizeToFit={true} ellipsizeMode="tail" numberOfLines={1} style={[stylesBottom.subtitleText, {marginHorizontal: 10, width: 150}]}>{artist}</Text>
                                  </View>
                            }

                            <Pressable onPress={() => {likeSong(id, true); this.refreshUI();}} android_ripple={rippleConfig}>
                                <MaterialIcons
                                    name="thumb-up"

                                    color={
                                        this.state.isLiked == null
                                            ? "darkgray"
                                            : this.state.isLiked
                                                ? "black"
                                                : "darkgray"
                                    }

                                    size={30}
                                />
                            </Pressable>
                        </View>

                        {Platform.OS != "web"
                            ?<SeekBar navigation={this.props.navigation}/>
                            :null
                        }
                        
                        <View style={stylesBottom.buttonContainer}>
                            <Pressable onPress={() => {}} android_ripple={rippleConfig}>
                                <MaterialIcons name="shuffle" color="black" size={30}/>
                            </Pressable>

                            <Pressable onPress={() => skip(false)} android_ripple={rippleConfig}>
                                <MaterialIcons name="skip-previous" color="black" size={40}/>
                            </Pressable>

                            <View style={{alignSelf: "center", alignItems: "center", justifyContent: "center", backgroundColor: appColor.background.backgroundColor, width: 60, height: 60, borderRadius: 30}}>
                                {isLoading
                                    ?   <ActivityIndicator style={{alignSelf: "center"}} color="white" size="large"/>

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

                            <Pressable
                                onPress={() => {
                                    let view = {
                                        title: this.state.track.title,
                                        subtitle: this.state.track.artist,
                                        thumbnail: this.state.track.artwork,
                                        videoId: this.state.track.id
                                    };

                                    global.showModal(view);
                                }}
                                android_ripple={rippleConfig}
                                style={stylesTop.topThird}
                            >
                                <MaterialIcons name="more-vert" color={"black"} size={30}/>
                            </Pressable>
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
    subtitleText: {
        paddingTop: 5,
        alignSelf: "center",
        textAlign: "center"
    },

    titleText: {
        fontSize: 25,
        fontWeight: "bold",
        textAlign: "center"
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
        height: "50%",
        alignSelf: "stretch"
    },

    image: {
        flex: 1
    }
});

const controlStyles = StyleSheet.create({
    container: {
        flexDirection: "row",
        justifyContent: "space-between",
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
        width: "100%",
        height: "100%",
        padding: "10%",
        paddingBottom: 100,
        flexWrap: "wrap",
        alignSelf: "stretch",
        alignContent: "stretch",
        justifyContent: "space-around"
    }
});