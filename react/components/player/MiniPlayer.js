import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text } from "react-native";

import { TouchableRipple} from "react-native-paper";
import { useNavigation, useTheme } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TrackPlayer, { useProgress, State, Event } from 'react-native-track-player';
import Music from "../../services/music/Music";

import ScrollingText from "../shared/ScrollingText";

export default MiniPlayer = ({style, containerStyle}) => {
    const [state, setState] = useState(State.Stopped);
    const navigation = useNavigation();
    const [track, setTrack] = useState({
        title: null,
        artist: null,
        artwork: null
    });

    const { dark, colors } = useTheme();
    const { position, duration } = useProgress();

    const positionLength = (100 / duration * position);

    const positionWidth = positionLength + "%";
    const remainingWidth = (100 - positionLength) + "%";

    useEffect(() => {
        TrackPlayer.getState().then(state => setState(state));
        TrackPlayer.getCurrentTrack().then(id => {
            if (id != null)
                refreshTrack({nextTrack: id});
        });

        const playback = TrackPlayer.addEventListener(
            Event.PlaybackState, e => setState(e.state)
        );

        const trackChanged = TrackPlayer.addEventListener(
            Event.PlaybackTrackChanged, refreshTrack
        );

        return () => {
            playback.remove();
            trackChanged.remove();
        }
    }, []);

    const refreshTrack = async(e) => {
        if (!e) e = {nextTrack: await TrackPlayer.getCurrentTrack()};
        let track = await TrackPlayer.getTrack(e.nextTrack);
        if (track != null)
            setTrack(track);
    }

    const onOpen = () => {
        Music.setTransitionTrack({
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

    const onNext = () => Music.skipNext();

    const onPlay = () => {
        state == State.Playing
            ? TrackPlayer.pause()
            : TrackPlayer.play();
    };

    const onStop = () => Music.reset();

    const isInactive = () => {
        return state == State.Stopped || state == State.None;
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
                            numberOfLines={1}
                            style={[
                                styles.titleText,
                                {color: colors.text}
                            ]}
                        >
                            {title}
                        </Text>
                    </ScrollingText>

                    <ScrollingText>
                        <Text
                            numberOfLines={1}
                            style={[
                                styles.subtitleText,
                                {color: colors.text,}
                            ]}
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
                            state == State.Playing
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