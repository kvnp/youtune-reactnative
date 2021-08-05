import React, { useState, useCallback, useEffect } from "react";
import {
    View,
    StyleSheet,
    Image,
    ActivityIndicator,
    Text,
    InteractionManager,
    Pressable,
    useWindowDimensions
} from "react-native";

import TrackPlayer from 'react-native-track-player';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect, useNavigation, useTheme } from "@react-navigation/native";

import SeekBar from "../../components/player/SeekBar";
import SwipePlaylist from "../../components/player/SwipePlaylist";

import {
    skip,
    setRepeat,
    isRepeating,
    skipTo,
    handlePlayback
} from "../../service";

import { getSongLike, likeSong } from "../../modules/storage/MediaStorage";

import { showModal } from "../../components/modals/MoreModal";
import { Button } from "react-native-paper";
import ScrollingText from "../../components/shared/ScrollingText";

var transitionTrack = {
    id: null,
    playlistId: null,
    title: null,
    artist: null,
    artwork: null
}

export const setTransitionTrack = track => {
    if (track != null)
        delete track.url;
    
    transitionTrack = track;
}

var playback = TrackPlayer.STATE_BUFFERING;
var stateCallback = null;

TrackPlayer.addEventListener("playback-state", e => {
    playback = e.state;
    if (stateCallback)
        stateCallback(e.state);
});

const PlayView = ({route}) => {
    const [state, setState] = useState(playback);
    const [isReplaying, setReplay] = useState(isRepeating);
    const [queue, setQueue] = useState(queue);
    const [isLiked, setLiked] = useState(null);
    const [track, setTrack] = useState(
        route.params
            ? transitionTrack

            : {
                id: null,
                playlistId: null,
                title: null,
                artist: null,
                artwork: null
            }
    );
    
    const navigation = useNavigation();
    const { height, width } = useWindowDimensions();
    const { dark, colors } = useTheme();
    const { title, artist, artwork, id, playlistId } = track;

    const setRepeating = () => {
        setRepeat(!isRepeating);
        setReplay(isRepeating);
    };

    const getCurrentTrack = async() => {
        let id = await TrackPlayer.getCurrentTrack();

        if (id != null) {
            let track = await TrackPlayer.getTrack(id);
            delete track.url;
            setTrack(track);

            let queue = await TrackPlayer.getQueue();
            for (element in queue) {
                delete element.url;
            }
            
            setQueue(queue);
        }
    }

    
    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            if (title != null && id != null) {
                navigation.setOptions({title: title});
                navigation.setParams({v: id, list: playlistId});
            }
        });

        return () => task.cancel();
    }, [track])

    useEffect(() => {
        const task = InteractionManager.runAfterInteractions(() => {
            stateCallback = state => setState(state);

            getCurrentTrack();
            const trackListener = TrackPlayer.addEventListener(
                "playback-track-changed",
                getCurrentTrack
            );

            handlePlayback({
                videoId: route.params.v,
                playlistId: route.params.list
            });

            return () => {
                trackListener.remove();
                stateCallback = null;
            }
        });

        return () => task.cancel();
    }, [])

    const refreshLike = async() => {
        setLiked(await getSongLike(id));
    }

    return <View style={{flex: 1}}>
        <View style={[stylesTop.vertContainer, {flexDirection: "column"}]}>
                <View style={[imageStyles.view, {height: height / 2.6}]}>
                    <Image resizeMode="contain" style={imageStyles.image} source={{uri: artwork}}/>
                </View>

                <View style={[stylesBottom.container, {width: width - 50, height: height / 2.6}]}>
                    <View style={controlStyles.container}>
                        
                        <Button
                            onPress={async() => { await likeSong(id, false); await refreshLike(); }}
                            labelStyle={{marginHorizontal: 0}}
                            style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0,
                                    color: isLiked == null
                                        ? colors.text
                                        : !isLiked
                                            ? colors.primary
                                            : colors.text
                            }}
                            contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                        >
                            <MaterialIcons
                                style={{alignSelf: "center"}}
                                selectable={false}
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
                        </Button>
                        
                        <View
                            style={[{
                                flexGrow: 1,
                                width: 1,
                                paddingHorizontal: 5,
                                alignItems: "center",
                                userSelect: "text",
                                overflow: "hidden"
                            }]}
                        >
                            <ScrollingText>
                                <Text
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}
                                    style={[stylesBottom.titleText, {color: colors.text}]}
                                >
                                    {title}
                                </Text>
                            </ScrollingText>
                                
                            <ScrollingText>
                                <Text
                                    adjustsFontSizeToFit={true}
                                    numberOfLines={1}
                                    style={[stylesBottom.subtitleText, {color: colors.text}]}
                                >
                                    {artist}
                                </Text>
                            </ScrollingText>
                        </View>

                        <Button
                            onPress={async() => { await likeSong(id, true); await refreshLike(); }}
                            labelStyle={{marginHorizontal: 0}}
                            style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                            contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                        >
                            <MaterialIcons
                                style={{alignSelf: "center"}}
                                selectable={false}
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
                        </Button>
                    </View>

                    <SeekBar/>
                    
                    <View style={[stylesBottom.buttonContainer, {overflow: "visible", alignSelf: "stretch", justifyContent: "space-between"}]}>
                        <Button
                            onPress={() => {}}
                            labelStyle={{marginHorizontal: 0}}
                            style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                            contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                        >
                            <MaterialIcons style={{alignSelf: "center"}} selectable={false} name="cast" color={colors.text} size={30}/>
                        </Button>

                        <Button
                            onPress={() => skip(false)}
                            labelStyle={{marginHorizontal: 0}}
                            style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                            contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                        >
                            <MaterialIcons style={{alignSelf: "center"}} selectable={false} name="skip-previous" color={colors.text} size={40}/>
                        </Button>

                        <View style={{alignSelf: "center", alignItems: "center", justifyContent: "center", backgroundColor: dark ? colors.card : colors.primary, width: 60, height: 60, borderRadius: 30}}>
                            {state == TrackPlayer.STATE_BUFFERING
                                ?   <ActivityIndicator style={{alignSelf: "center"}} color={colors.text} size="large"/>

                                :   <Button
                                        labelStyle={{marginHorizontal: 0}}
                                        style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                                        contentStyle={{alignItems: "center", width: 60, height: 60, minWidth: 0}}
                                        onPress={
                                            state == TrackPlayer.STATE_PLAYING
                                                ? TrackPlayer.pause
                                                : TrackPlayer.play
                                        }
                                    >
                                        <MaterialIcons
                                            style={{alignSelf: "center"}}
                                            color={colors.text}
                                            size={40}
                                            selectable={false}
                                            name={
                                                state == TrackPlayer.STATE_PLAYING
                                                    ? "pause"
                                                    : "play-arrow"
                                            }
                                        />
                                    </Button>
                            }
                        </View>

                        <Button
                            labelStyle={{marginHorizontal: 0}}
                            style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                            contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                            onPress={() => skip(true)}
                        >
                            <MaterialIcons style={{alignSelf: "center"}} selectable={false} name="skip-next" color={colors.text} size={40}/>
                        </Button>

                        <Button
                            labelStyle={{marginHorizontal: 0}}
                            style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                            contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                            onPress={() => setRepeating()}
                        >
                            <MaterialIcons style={{alignSelf: "center"}} selectable={false} name={isReplaying ? "repeat-one" : "repeat"} color={colors.text} size={30}/>
                        </Button>
                    </View>

                    <View style={{justifyContent: "space-between", flexDirection: "row", paddingTop: 30}}>
                        <Button
                            labelStyle={{marginHorizontal: 0}}
                            style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                            contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                            onPress={() => navigation.goBack()}
                        >
                            <MaterialIcons
                                style={{alignSelf: "center"}}
                                selectable={false}
                                name="keyboard-arrow-down"
                                color={colors.text} size={30}
                            />
                        </Button>

                        <Button
                            labelStyle={{marginHorizontal: 0}}
                            style={[stylesTop.topThird, { borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}]}
                            contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                            onPress={() => {
                                let view = {
                                    title: track.title,
                                    subtitle: track.artist,
                                    thumbnail: track.artwork,
                                    videoId: track.id
                                };

                                showModal(view);
                            }}
                        >
                            <MaterialIcons
                                style={{alignSelf: "center"}}
                                selectable={false}
                                name="more-vert"
                                color={colors.text}
                                size={30}
                            />
                        </Button>
                    </View>
                </View>
            </View>

            <SwipePlaylist
                minimumHeight={50}
                backgroundColor={dark ? colors.card : colors.primary}
                textColor={colors.text}
                playlist={queue}
                track={track}
                style={stylesRest.container}
            />
    </View>
}

export default PlayView;

const stylesRest = StyleSheet.create({
    container: {
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        position: "absolute",
        bottom: 0
    },
});

const stylesBottom = StyleSheet.create({
    container: {
        alignSelf: "center",
        alignItems: "stretch",
        justifyContent: "center",
        minWidth: "50%",
        maxWidth: 400,
        paddingHorizontal: "5%"
    },

    subtitleText: {
        paddingTop: "1%",
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
        alignSelf: "center",
        justifyContent: "space-between",
        overflow: "hidden",
        paddingTop: 20
    }
});

const imageStyles = StyleSheet.create({
    view: {
        alignSelf: "center",
        width: "100%",
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
        paddingBottom: "60px",
        alignSelf: "center",
        alignContent: "space-around",
        justifyContent: "space-around"
    }
});