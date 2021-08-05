import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text } from "react-native";

import { TouchableRipple} from "react-native-paper";
import { useNavigation, useTheme } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TrackPlayer, { useTrackPlayerProgress } from 'react-native-track-player';

import { skip } from "../../service";
import ScrollingText from "../shared/ScrollingText";
import { setTransitionTrack } from "../../views/full/PlayView";

const MiniPlayer = ({style, containerStyle}) => {
    const [state, setState] = useState(TrackPlayer.STATE_STOPPED);
    const navigation = useNavigation();
    const [track, setTrack] = useState({
        title: null,
        artist: null,
        artwork: null
    });

    const { dark, colors } = useTheme();
    const { position, duration } = useTrackPlayerProgress();

    const positionLength = (100 / duration * position);

    const positionWidth = positionLength + "%";
    const remainingWidth = (100 - positionLength) + "%";

    useEffect(() => {
        TrackPlayer.getState().then(state => setState(state));
        TrackPlayer.getCurrentTrack().then(id => {
            if (id != null)
                refreshTrack({nextTrack: id});
        });

        const playback = TrackPlayer.addEventListener("playback-state", e => setState(e.state));
        const trackChanged = TrackPlayer.addEventListener("playback-track-changed", refreshTrack);

        return () => {
            playback.remove();
            trackChanged.remove();
        }
    }, []);

    const refreshTrack = async(e) => {
        if (!e) e = {nextTrack: await TrackPlayer.getCurrentTrack()};
        let track = await TrackPlayer.getTrack(e.nextTrack);
        if (track != null) {
            delete track.url;
            setTrack(track);
        }
    }

    const onOpen = () => {
        setTransitionTrack({
            id: track.id,
            playlistId: track.playlistId,
            title: track.title,
            artist: track.artist,
            artwork: track.artwork
        });

        navigation.navigate("Music", {
            v: track.id,
            list: track.playlistId
        });
    }

    const onNext = () => skip(true);

    const onPlay = () => {
        state == TrackPlayer.STATE_PLAYING
            ? TrackPlayer.pause()
            : TrackPlayer.play();
    };

    const onStop = () => TrackPlayer.reset();

    const isInactive = () => {
        return state == TrackPlayer.STATE_STOPPED || state == TrackPlayer.STATE_NONE;
    }
    
    const { title, artist, artwork } = track;

    return <View
        style={[
            styles.main, {
            height: isInactive() ? 0 : 50,
            backgroundColor: colors.card
        }, containerStyle]}
    >
        <View style={[styles.main, {
            justifyContent: "space-evenly",
            width: "100%",
            alignSelf: "center"
        }, style]}>
            <View style={styles.playback}>
                <View style={{width: positionWidth, backgroundColor: colors.text}}></View>
                <View style={{width: remainingWidth, backgroundColor: colors.card}}></View>
            </View>
            <View style={styles.container}>
                <Image source={{uri: artwork}} style={styles.image}/>
                <TouchableRipple
                    borderless={true}
                    rippleColor={colors.primary}
                    onPress={onOpen}
                    style={[
                        styles.textContainer,
                        {alignItems: "stretch", padding: 0, margin: 0}
                    ]}
                >
                    <>
                    <ScrollingText>
                        <Text
                            style={[styles.titleText, {color: colors.text, flexWrap: "nowrap"}]}
                        >
                            {title}
                        </Text>
                    </ScrollingText>

                    <ScrollingText>
                        <Text
                            style={[styles.subtitleText, {color: colors.text, flexWrap: "nowrap"}]}
                        >
                            {artist}
                        </Text>
                    </ScrollingText>
                    </>
                </TouchableRipple>

                <TouchableRipple
                    borderless={true}
                    rippleColor={colors.primary}
                    style={[
                        styles.button,
                        {color: colors.card, borderRadius: 25}
                    ]}
                    onPress={onStop}
                >
                    <MaterialIcons
                        name="clear"
                        color={colors.text}
                        size={29}
                    />
                </TouchableRipple>

                <TouchableRipple
                    borderless={true}
                    rippleColor={colors.primary}
                    style={[
                        styles.button,
                        {color: colors.card, borderRadius: 25}
                    ]}
                    onPress={onPlay}
                >
                    <MaterialIcons
                        name={
                            state == TrackPlayer.STATE_PLAYING
                                ? "pause"
                                : "play-arrow"
                        }
                        color={colors.text}
                        size={29}
                    />
                </TouchableRipple>

                <TouchableRipple
                    borderless={true}
                    rippleColor={colors.primary}
                    style={[
                        styles.button,
                        {color: colors.card, borderRadius: 25}
                    ]}
                    onPress={onNext}
                >
                        <MaterialIcons
                            name="skip-next"
                            color={colors.text}
                            size={29}
                        />
                </TouchableRipple>
            </View>
        </View>
    </View>
}

const styles = StyleSheet.create({
    main: {
        flexDirection: "column",
        padding: 0,
        margin: 0,
        overflow: "hidden"
    },

    playback: {
        height: 1.5,
        flexDirection: "row"
    },

    container: {
        flexDirection: "row",
        overflow: "hidden",
        paddingRight: 15,
        paddingLeft: 15,
        alignItems: "center",
        alignSelf: "stretch",
    },

    image: {
        width: 50,
        alignSelf: "stretch",
        backgroundColor: "gray",
    },

    textContainer: {
        flex: 1,
        overflow: "hidden",
        marginHorizontal: 10,
    },

    titleText: {
        fontWeight: "bold"
    },

    subtitleText: {
        
    },

    button: {
        justifyContent: "center",
        alignItems: "center",
        width: 40,
        height: 40,
        paddingLeft: 2,
        paddingRight: 2
    }
});

export default MiniPlayer;