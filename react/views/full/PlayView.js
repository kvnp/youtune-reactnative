import React, { useState, useEffect, useCallback } from "react";
import {
    View,
    StyleSheet,
    Image,
    ActivityIndicator,
    Text,
    useWindowDimensions
} from "react-native";

import TrackPlayer, { Event, State } from 'react-native-track-player';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useFocusEffect, useTheme } from "@react-navigation/native";
import { Button } from "react-native-paper";

import Music from "../../services/music/Music";
import Downloads from "../../services/device/Downloads";

import SeekBar from "../../components/player/SeekBar";
import SwipePlaylist from "../../components/player/SwipePlaylist";
import { showModal } from "../../components/modals/MoreModal";
import ScrollingText from "../../components/shared/ScrollingText";
import CastButton from "../../components/player/CastButton";

const PlayView = ({route, navigation}) => {
    const { height, width } = useWindowDimensions();
    const { dark, colors } = useTheme();

    const [state, setState] = useState(Music.state);
    const [track, setTrack] = useState(Music.metadata);
    const [repeat, setRepeat] = useState(Music.repeatModeString);
    const [isLiked, setLiked] = useState(null);

    const {id, playlistId, title, artist, artwork, duration} = track;
    
    const likeSong = like => {
        Downloads.likeTrack(id, like);
        setLiked(like);
    }

    useFocusEffect(
        useCallback(() => {
            if (id == null)
                return;

            navigation.setOptions({title: title});
            navigation.setParams({v: id, list: playlistId});
            Downloads.isTrackLiked(id).then(like => setLiked(like));
        }, [id])
    );

    useEffect(() => {
        if (id != null) {
            navigation.setOptions({title: title});
            navigation.setParams({v: id, list: playlistId});
        }

        Music.handlePlayback({
            videoId: route.params.v,
            playlistId: route.params.list
        });

        const stateListener = TrackPlayer.addEventListener(
            Event.PlaybackState,
            e => setState(e.state)
        );

        const updateListener = Music.addListener(
            Music.EVENT_METADATA_UPDATE,
            () => {
                setState(State.Buffering);
                setTrack(Music.metadata);
            }
        );

        const lkListener = Downloads.addListener(
            Downloads.EVENT_LIKE,
            like => setLiked(like)
        )
        
        setTrack(Music.metadata);
        setState(Music.state);

        return () => {
            stateListener.remove();
            updateListener.remove();
            lkListener.remove();
        }
    }, []);

    return <View style={{flex: 1, backgroundColor: dark ? "black" : "white"}}>
        <View style={[stylesTop.vertContainer, {flexDirection: "column"}]}>
            <View style={[imageStyles.view, {height: height / 2.6}]}>
                <Image resizeMode="contain" style={imageStyles.image} source={{uri: artwork}}/>
            </View>

            <View style={[stylesBottom.container, {width: width - 50, height: height / 2.6}]}>
                <View style={controlStyles.container}>
                    
                    <Button
                        onPress={() => likeSong(false)}
                        labelStyle={{marginHorizontal: 0}}
                        style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                        contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                    >
                        <MaterialIcons
                            style={{alignSelf: "center"}}
                            selectable={false}
                            name="thumb-down"
                            color={
                                isLiked == null
                                    ? "dimgray"
                                    : !isLiked
                                        ? colors.text
                                        : "dimgray"
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
                        onPress={() => likeSong(true)}
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
                                    ? "dimgray"
                                    : isLiked
                                        ? colors.text
                                        : "dimgray"
                            }

                            size={30}
                        />
                    </Button>
                </View>

                <SeekBar duration={duration} buffering={state}/>
                
                <View style={[stylesBottom.buttonContainer, {overflow: "visible", alignSelf: "stretch", justifyContent: "space-between"}]}>
                    <CastButton/>

                    <Button
                        labelStyle={{marginHorizontal: 0}}
                        style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                        contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                        onPress={() => Music.skipPrevious()}
                    >
                        <MaterialIcons style={{alignSelf: "center"}} selectable={false} name="skip-previous" color={colors.text} size={40}/>
                    </Button>

                    <View style={{alignSelf: "center", alignItems: "center", justifyContent: "center", backgroundColor: dark ? colors.card : colors.primary, width: 60, height: 60, borderRadius: 30}}>
                        {state == State.Buffering
                            ?   <ActivityIndicator
                                    style={{alignSelf: "center"}}
                                    color={colors.text}
                                    size="large"
                                />

                            :   <Button
                                    labelStyle={{marginHorizontal: 0}}
                                    style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                                    contentStyle={{alignItems: "center", width: 60, height: 60, minWidth: 0}}
                                    onPress={
                                        state == State.Playing
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
                                            state == State.Playing
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
                        onPress={() => Music.skipNext()}
                    >
                        <MaterialIcons style={{alignSelf: "center"}} selectable={false} name="skip-next" color={colors.text} size={40}/>
                    </Button>

                    <Button
                        labelStyle={{marginHorizontal: 0}}
                        style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                        contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                        onPress={() => setRepeat(Music.cycleRepeatMode())}
                    >
                        <MaterialIcons
                            style={{alignSelf: "center"}}
                            selectable={false}
                            color={colors.text} size={30}
                            name={repeat}
                        />
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
                        onPress={() => showModal({
                            title: title,
                            subtitle: artist,
                            thumbnail: artwork,
                            videoId: id
                        })}
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
            playlist={Music.metadataList}
            track={Music.metadata}
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
        paddingBottom: 60,
        alignSelf: "center",
        alignContent: "space-around",
        justifyContent: "space-around"
    }
});