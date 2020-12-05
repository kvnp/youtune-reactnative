import React, { PureComponent, useEffect, useState } from "react";
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

import TrackPlayer from 'react-native-track-player';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import SeekBar from "../../components/player/SeekBar";
import SwipePlaylist from "../../components/player/SwipePlaylist";

import { rippleConfig } from "../../styles/Ripple";
import { startPlayback, skip, setPlay, setRepeat, startPlaylist } from "../../service";
import { isRepeating } from "../../service";
import { getSongLike, likeSong } from "../../modules/storage/MediaStorage";
import { useTheme } from "@react-navigation/native";

export default PlayView = ({route, navigation}) => {
    const [playbackState, setPlayback] = useState({
        isPlaying: false,
        isStopped: false,
        isLoading: true
    });

    const [willRepeat, setRepeating] = useState(isRepeating);
    const [track, setTrack] = useState(null);
    const [playlist, setPlaylist] = useState(null);
    const [isLiked, setLiked] = useState(null);

    const { dark, colors } = useTheme();

    useEffect(() => {
        refreshUI();
        _unsub = [];

        _unsub.push(
            TrackPlayer.addEventListener("playback-state", refreshUI)
        );

        _unsub.push(
            TrackPlayer.addEventListener("playback-track-changed", refreshUI)
        );

        return () => {
            for (let i = 0; i < _unsub.length; i++)
                _unsub[i].remove();
        };
    }, []);

    refreshUI = async() => {
        let id = await TrackPlayer.getCurrentTrack();
        if (id != null) {
            switch ( await TrackPlayer.getState() ) {
                case TrackPlayer.STATE_NONE:
                    break;
                case TrackPlayer.STATE_PLAYING:
                    setPlayback({
                        isPlaying: true,
                        isLoading: false,
                        isStopped: false
                    });
                    break;
                case TrackPlayer.STATE_PAUSED:
                    setPlayback({
                        isPlaying: false,
                        isLoading: false,
                        isStopped: false
                    });
                    break;
                case TrackPlayer.STATE_STOPPED:
                    setPlayback({
                        isPlaying: true,
                        isLoading: false,
                        isStopped: true
                    });
                    navigation.goBack();
                    return;
                case TrackPlayer.STATE_BUFFERING:
                    setPlayback({
                        isPlaying: false,
                        isLoading: true,
                        isStopped: false
                    });
                    break;
            }
            
            setPlaylist(await TrackPlayer.getQueue());
            setTrack(await TrackPlayer.getTrack(id));
            setLiked(await getSongLike(id));
        }
    }

    const setRepeatLocal = () => {
        setRepeating(!willRepeat);
        setRepeat(!willRepeat);
    }

    if (route.params != undefined) {
        setPlayback({
            isPlaying: false,
            isLoading: true,
            isStopped: false
        });

        if (route.params.list != undefined) {
            var index = route.params.index;
            var list = route.params.list;
            var { title, artist, artwork, id } = list[index];

            startPlaylist(route.params);
        } else {
            var { title, subtitle, thumbnail, id } = route.params;
            var artist = subtitle;
            var artwork = thumbnail;

            startPlayback(route.params);
            //.catch(params => navigation.navigate("Captcha", params));
        }

        route.params = undefined;
    } else {
        if (track != null)
            var {title, artist, artwork, id } = track;
        else {
            var id = null;
            var title = null;
            var artist = null;
            var artwork = null;
        }
    }

    return (
        <View style={{overflow: "hidden", height: "100%"}}>
            <View style={stylesTop.vertContainer}>
                <View style={imageStyles.view}>
                    <Image resizeMode="contain" style={imageStyles.image} source={{uri: artwork}}/>
                </View>

                <View style={{alignSelf: "stretch", justifyContent: "space-around", alignItems: "stretch", paddingRight: "2%", paddingLeft: "2%", justifyContent: "center"}}>
                    <View style={controlStyles.container}>
                        <Pressable onPress={() => {likeSong(id, false); refreshUI();}} android_ripple={rippleConfig}>
                            <MaterialIcons
                                name="thumb-down"

                                color={
                                    isLiked == null
                                        ? colors.text
                                        : !isLiked
                                            ? colors.primary
                                            : colors.text
                                }

                                size={30}
                            />
                        </Pressable>

                        
                        {Platform.OS != "web"
                            ? <View style={{alignItems: "center", flex: 1}}>
                                <ScrollView horizontal={true} style={{marginHorizontal: 10}}>
                                    <Text numberOfLines={1} style={[stylesBottom.titleText, {color: colors.text}]}>{title}</Text>
                                </ScrollView>

                                <ScrollView horizontal={true} style={{marginHorizontal: 10}}>
                                    <Text numberOfLines={1} style={[stylesBottom.subtitleText, {color: colors.text}]}>{artist}</Text>
                                </ScrollView>
                            </View>

                            : <View style={{alignItems: "center"}}>
                                <Text adjustsFontSizeToFit={true} ellipsizeMode="tail" numberOfLines={1} style={[stylesBottom.titleText, {marginHorizontal: 10, width: 150, color: colors.text}]}>{title}</Text>
                                <Text adjustsFontSizeToFit={true} ellipsizeMode="tail" numberOfLines={1} style={[stylesBottom.subtitleText, {marginHorizontal: 10, width: 150, color: colors.text}]}>{artist}</Text>
                            </View>
                        }

                        <Pressable onPress={() => {likeSong(id, true); refreshUI();}} android_ripple={rippleConfig}>
                            <MaterialIcons
                                name="thumb-up"

                                color={
                                    isLiked == null
                                        ? colors.text
                                        : isLiked
                                            ? colors.primary
                                            : colors.text
                                }

                                size={30}
                            />
                        </Pressable>
                    </View>

                    <SeekBar navigation={navigation}/>
                    
                    <View style={stylesBottom.buttonContainer}>
                        <Pressable onPress={() => {}} android_ripple={rippleConfig}>
                            <MaterialIcons name="shuffle" color={colors.text} size={30}/>
                        </Pressable>

                        <Pressable onPress={() => skip(false)} android_ripple={rippleConfig}>
                            <MaterialIcons name="skip-previous" color={colors.text} size={40}/>
                        </Pressable>

                        <View style={{alignSelf: "center", alignItems: "center", justifyContent: "center", backgroundColor: dark ? colors.card : colors.primary, width: 60, height: 60, borderRadius: 30}}>
                            {playbackState.isLoading
                                ?   <ActivityIndicator style={{alignSelf: "center"}} color={colors.text} size="large"/>

                                :   <Pressable onPress={() => setPlay(playbackState.isPlaying)} android_ripple={rippleConfig}>
                                        <MaterialIcons name={playbackState.isPlaying ? "pause" : "play-arrow"} color={colors.text} size={40}/>
                                    </Pressable>
                            }
                        </View>
                        

                        <Pressable onPress={() => skip(true)} android_ripple={rippleConfig}>
                            <MaterialIcons name="skip-next" color={colors.text} size={40}/>
                        </Pressable>

                        <Pressable onPress={setRepeatLocal} android_ripple={rippleConfig}>
                            <MaterialIcons name={willRepeat ?"repeat-one" :"repeat"} color={colors.text} size={30}/>
                        </Pressable>
                    </View>

                    <View style={{justifyContent: "space-between", flexDirection: "row", paddingTop: 30}}>
                        <Pressable onPress={navigation.goBack} android_ripple={rippleConfig} style={stylesTop.topFirst}>
                            <MaterialIcons name="keyboard-arrow-down" color={colors.text} size={30}/>
                        </Pressable>

                        <Pressable
                            onPress={() => {
                                let view = {
                                    title: track.title,
                                    subtitle: track.artist,
                                    thumbnail: track.artwork,
                                    videoId: track.id
                                };

                                global.showModal(view);
                            }}
                            android_ripple={rippleConfig}
                            style={stylesTop.topThird}
                        >
                            <MaterialIcons name="more-vert" color={colors.text} size={30}/>
                        </Pressable>
                    </View>
                </View>
            </View>

            <SwipePlaylist minimumHeight={50}
                           backgroundColor={dark ? colors.card : colors.primary}
                           textColor={colors.text}
                           playlist={playlist}
                           track={track}
                           style={stylesRest.container}/>
        </View>
    )
}

const stylesRest = StyleSheet.create({
    container: {
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