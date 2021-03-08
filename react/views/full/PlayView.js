import React, { useEffect, useState } from "react";
import {
    View,
    Text,
    StyleSheet,
    Image,
    Pressable,
    ActivityIndicator,
    Dimensions,
    Platform
} from "react-native";


import TrackPlayer from 'react-native-track-player';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "@react-navigation/native";

import Playlist from "../../modules/models/music/playlist"

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
import { loadSongLocal, localIDs } from "../../modules/storage/SongStorage";

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
    const [dimensions, setDimensions] = useState(
        Platform.OS == "web"
            ? {
                width: window.innerHeight > window.innerWidth
                    ? window.innerWidth - 50
                    : window.innerHeight - 50,
                height: window.innerHeight > window.innerWidth
                    ? window.innerHeight / 2.6
                    : window.innerWidth / 2.6
            }

            : {
                width: Dimensions.get("window").width - 50,
                height: Dimensions.get("window").height / 2.6
            }
    );

    const { dark, colors } = useTheme();

    useEffect(() => {
        navigation.setOptions({title: "Loading"});
        if (route.params) {
            if (route.params.list == "LOCAL_DOWNLOADS") {
                let loader = new Promise(async(resolve, reject) => {
                    if (localIDs.length == 0) {
                        let waitForDB = ms => {
                            return new Promise(resolve => setTimeout(resolve, ms));
                        }

                        await waitForDB(3000);
                    }

                    let localPlaylist = new Playlist();

                    for (let i = 0; i < localIDs.length; i++) {
                        let {title, artist, artwork, duration} = await loadSongLocal(localIDs[i]);
                        let constructedTrack = {
                            title,
                            artist,
                            artwork,
                            duration,
                            id: localIDs[i],
                            playlistId: route.params.list,
                            url: null
                        };

                        if (localIDs[i] == route.params.v)
                            localPlaylist.index = i;

                        localPlaylist.list.push(constructedTrack);
                    }

                    resolve(localPlaylist);
                });
                
                loader.then(loadedPlaylist => {
                    setPlaylist(loadedPlaylist.list);
                    startPlaylist(loadedPlaylist);
                });
            } else if (route.params.v) {
                TrackPlayer.reset();
                setPlayback({
                    isPlaying: false,
                    isLoading: true,
                    isStopped: false
                });
                
                fetchNext(route.params.v, route.params.list)
                    .then(loadedList => {
                        setPlaylist(loadedList.list);
                        startPlaylist(loadedList);
                    })

                    .catch(async(reason) => {
                        if (localIDs.length == 0) {
                            let waitForDB = ms => {
                                return new Promise(resolve => setTimeout(resolve, ms));
                            }

                            await waitForDB(3000);
                        }


                        if (localIDs.includes(route.params.v)) {
                            let localPlaylist = new Playlist();
                            localPlaylist.list.push(await loadSongLocal(route.params.v))

                            setPlaylist(localPlaylist.list);
                            startPlaylist(localPlaylist);
                        }
                    });
            }
        }
        refreshUI();

        let _unsub = [];
        _unsub.push(TrackPlayer.addEventListener("playback-state", refreshUI));
        _unsub.push(TrackPlayer.addEventListener("playback-track-changed", refreshUI));
        
        let resizeListener = Platform.OS == "web"
            ? window.addEventListener(
                "resize", () => setDimensions({
                    width: window.innerHeight > window.innerWidth
                        ? window.innerWidth - 50
                        : window.innerHeight - 50,
                    height: window.innerHeight > window.innerWidth
                        ? window.innerHeight / 2.6
                        : window.innerWidth / 2.6
                })
            )
        
            : undefined;

        return () => {
            if (resizeListener)
                resizeListener.removeEventListener("resize");

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
            setPlaylist(await TrackPlayer.getQueue())
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

    return <>
        <View style={stylesTop.vertContainer}>
            <View style={[imageStyles.view, {height: dimensions.height, width: dimensions.width}]}>
                <Image resizeMode="contain" style={imageStyles.image} source={{uri: artwork}}/>
            </View>

            <View style={[stylesBottom.container, {width: dimensions.width, height: dimensions.height}]}>
                <View style={controlStyles.container}>
                    <Pressable onPress={() => { likeSong(id, false); refreshUI(); }} style={{paddingTop: 5}} android_ripple={rippleConfig}>
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
                    
                    <View style={{flexGrow: 1, width: 1, paddingHorizontal: 5, alignItems: "center"}}>
                        <Text adjustsFontSizeToFit={true} ellipsizeMode="tail" numberOfLines={1} style={[stylesBottom.titleText, {color: colors.text}]}>{title}</Text>
                        <Text adjustsFontSizeToFit={true} ellipsizeMode="tail" numberOfLines={1} style={[stylesBottom.subtitleText, {color: colors.text}]}>{artist}</Text>
                    </View>

                    <Pressable onPress={() => { likeSong(id, true); refreshUI(); }} style={{paddingTop: 5}} android_ripple={rippleConfig}>
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

                    <Pressable onPress={() => setRepeatLocal()} android_ripple={rippleConfig}>
                        <MaterialIcons selectable={false} name={willRepeat ?"repeat-one" :"repeat"} color={colors.text} size={30}/>
                    </Pressable>
                </View>

                <View style={{justifyContent: "space-between", flexDirection: "row", paddingTop: 30}}>
                    <Pressable android_ripple={rippleConfig} style={stylesTop.topFirst}
                               onPress={() => navigation.goBack()}>
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
    </>
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
    container: {
        alignSelf: "center",
        justifyContent: "space-around",
        alignItems: "stretch",
        justifyContent: "center",
        maxWidth: 400,
        paddingHorizontal: "5%"
    },

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
        alignSelf: "stretch",
        maxWidth: 400
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
        paddingHorizontal: "10%",
        paddingBottom: 50,
        flexWrap: "wrap",
        alignSelf: "center",
        alignContent: "space-around",
        justifyContent: "space-around"
    }
});