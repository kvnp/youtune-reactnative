import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    ActivityIndicator
} from "react-native";

import TrackPlayer from 'react-native-track-player';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "@react-navigation/native";

import SeekBar from "../../components/player/SeekBar";
import SwipePlaylist from "../../components/player/SwipePlaylist";

import { rippleConfig } from "../../styles/Ripple";
import {
    skip,
    setPlay,
    setRepeat,
    startPlaylist,
    isRepeating
} from "../../service";
import { getSongLike, likeSong } from "../../modules/storage/MediaStorage";

import { showModal } from "../../components/shared/MoreModal";
import { fetchNext } from "../../modules/remote/API";

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
        navigation.setOptions({title: "Loading"});
        if (route.params)
            if (route.params.v) {
                setPlayback({
                    isPlaying: false,
                    isLoading: true,
                    isStopped: false
                });
        
                fetchNext(route.params.v, route.params.list).then(playlist => {
                    setPlaylist(playlist.list);
                    startPlaylist(playlist);
                });
            }

        refreshUI();

        let _unsub = [];
        _unsub.push(TrackPlayer.addEventListener("playback-state", refreshUI));
        _unsub.push(TrackPlayer.addEventListener("playback-track-changed", refreshUI));
        return () => {
            for (let i = 0; i < _unsub.length; i++)
                _unsub[i].remove();
        };
    }, []);

    const refreshUI = async() => {
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
                    if (navigation.isFocused())
                        navigation.navigate("App");
                    return;
                case TrackPlayer.STATE_BUFFERING:
                    setPlayback({
                        isPlaying: false,
                        isLoading: true,
                        isStopped: false
                    });
                    break;
            }

            let track = await TrackPlayer.getTrack(id);
            navigation.setOptions({title: track.title});
            navigation.setParams({v: id, list: track.playlistId});
            
            setTrack(track);
            setLiked(await getSongLike(id));
        }
    }

    const setRepeatLocal = () => {
        setRepeating(!willRepeat);
        setRepeat(!willRepeat);
    }

    if (track != null)
        var {title, artist, artwork, id } = track;
    else {
        var id = null;
        var title = null;
        var artist = null;
        var artwork = null;
    }

    return <View style={{overflow: "hidden", height: "100%"}}>
        <View style={stylesTop.vertContainer}>
            <View style={imageStyles.view}>
                <Image resizeMode="contain" style={imageStyles.image} source={{uri: artwork}}/>
            </View>

            <View style={{width: "100%", maxWidth: "800px", alignSelf: "center", justifyContent: "space-around", alignItems: "stretch", justifyContent: "center"}}>
                <View style={controlStyles.container}>
                    <Pressable onPress={() => { likeSong(id, false); refreshUI();}} android_ripple={rippleConfig}>
                        <MaterialIcons selectable={false}
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

                    
                    <View style={{flexGrow: "1", width: "1px", alignItems: "center"}}>
                        <Text adjustsFontSizeToFit={true} ellipsizeMode="tail" numberOfLines={1} style={[stylesBottom.titleText, {marginHorizontal: 10, color: colors.text}]}>{title}</Text>
                        <Text adjustsFontSizeToFit={true} ellipsizeMode="tail" numberOfLines={1} style={[stylesBottom.subtitleText, {marginHorizontal: 10, color: colors.text}]}>{artist}</Text>
                    </View>

                    <Pressable onPress={() => { likeSong(id, true); refreshUI(); }} android_ripple={rippleConfig}>
                        <MaterialIcons selectable={false}
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
                        <MaterialIcons selectable={false} name="shuffle" color={colors.text} size={30}/>
                    </Pressable>

                    <Pressable onPress={() => skip(false)} android_ripple={rippleConfig}>
                        <MaterialIcons selectable={false} name="skip-previous" color={colors.text} size={40}/>
                    </Pressable>

                    <View style={{alignSelf: "center", alignItems: "center", justifyContent: "center", backgroundColor: dark ? colors.card : colors.primary, width: 60, height: 60, borderRadius: 30}}>
                        {playbackState.isLoading
                            ?   <ActivityIndicator style={{alignSelf: "center"}} color={colors.text} size="large"/>

                            :   <Pressable onPress={() => setPlay(playbackState.isPlaying)} android_ripple={rippleConfig}>
                                    <MaterialIcons selectable={false} name={playbackState.isPlaying ? "pause" : "play-arrow"} color={colors.text} size={40}/>
                                </Pressable>
                        }
                    </View>

                    <Pressable onPress={() => skip(true)} android_ripple={rippleConfig}>
                        <MaterialIcons selectable={false} name="skip-next" color={colors.text} size={40}/>
                    </Pressable>

                    <Pressable onPress={setRepeatLocal} android_ripple={rippleConfig}>
                        <MaterialIcons selectable={false} name={willRepeat ?"repeat-one" :"repeat"} color={colors.text} size={30}/>
                    </Pressable>
                </View>

                <View style={{justifyContent: "space-between", flexDirection: "row", paddingTop: 30}}>
                    <Pressable android_ripple={rippleConfig} style={stylesTop.topFirst}
                               onPress={() => {
                                    navigation.goBack();
                                    if (navigation.isFocused())
                                        navigation.navigate("App");
                               }}>
                        <MaterialIcons selectable={false} name="keyboard-arrow-down" color={colors.text} size={30}/>
                    </Pressable>

                    <Pressable
                        onPress={() => {
                            let view = {
                                title: track.title,
                                subtitle: track.artist,
                                thumbnail: track.artwork,
                                videoId: track.id
                            };

                            showModal(view);
                        }}
                        android_ripple={rippleConfig}
                        style={stylesTop.topThird}
                    >
                        <MaterialIcons selectable={false} name="more-vert" color={colors.text} size={30}/>
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
}

const stylesRest = StyleSheet.create({
    container: {
        paddingBottom: 10,
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        position: "absolute",
        bottom: 0
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