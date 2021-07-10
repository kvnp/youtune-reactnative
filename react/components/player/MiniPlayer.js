import React, { useEffect, useState } from "react";
import { StyleSheet, View, Pressable, Image, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TrackPlayer, { useTrackPlayerProgress } from 'react-native-track-player';

import { skip } from "../../service";
import { rippleConfig } from "../../styles/Ripple";

export default MiniPlayer = ({navigation, style}) => {
    const [state, setState] = useState(TrackPlayer.STATE_STOPPED);

    const [track, setTrack] = useState({
        title: null,
        artist: null,
        artwork: null
    });

    const {dark, colors} = useTheme();
    const { position, duration } = useTrackPlayerProgress();

    const positionLength = (100 / duration * position);

    const positionWidth = positionLength + "%";
    const remainingWidth = (100 - positionLength) + "%";

    useEffect(() => {
        const _unsubscribe = navigation.addListener('focus', () => {
            TrackPlayer.getState().then(state => setState(state));

            TrackPlayer.getCurrentTrack().then(id => {
                if (id != null)
                    refreshTrack({nextTrack: id});
            });
        });

        const playback = TrackPlayer.addEventListener("playback-state", e => setState(e.state));
        const trackChanged = TrackPlayer.addEventListener("playback-track-changed", refreshTrack);

        return () => {
            _unsubscribe();
            playback.remove();
            trackChanged.remove();
        }
    }, []);

    const refreshTrack = async(e) => {
        if (!e) e = {nextTrack: await TrackPlayer.getCurrentTrack()};
        let track = await TrackPlayer.getTrack(e.nextTrack);

        setTrack({
            title: track.title,
            artist: track.artist,
            artwork: track.artwork
        });
    }

    const onOpen = () => navigation.navigate("Music");

    const onNext = () => skip(true);

    const onPlay = () => {
        state == TrackPlayer.STATE_PLAYING
            ? TrackPlayer.pause()
            : TrackPlayer.play();
    };

    const onStop = () => TrackPlayer.reset();

    var title = null;
    var artist = null;
    var artwork = null;

    if (track != null) {
        title = track.title;
        artist = track.artist;
        artwork = track.artwork;
    }

    return  <View style={[style, styles.main, {height: state in [TrackPlayer.STATE_STOPPED, TrackPlayer.STATE_NONE] ?0 :50, backgroundColor: colors.card}]}>
        <View style={[styles.main, {justifyContent: "space-evenly", width: "100%", maxWidth: 800, alignSelf: "center"}]}>
            <View style={styles.playback}>
                <View style={{width: positionWidth, backgroundColor: colors.text}}></View>
                <View style={{width: remainingWidth, backgroundColor: colors.card}}></View>
            </View>
            <View style={styles.container}>
                <Image source={{uri: artwork}} style={styles.image}/>
                <View style={styles.textContainer}>
                    <Pressable android_ripple={rippleConfig} onPress={onOpen}>
                        <Text numberOfLines={1} style={[styles.titleText, {color: colors.text}]}>{title}</Text>
                        <Text numberOfLines={1} style={[styles.subtitleText, {color: colors.text}]}>{artist}</Text>
                    </Pressable>
                </View>

                <View style={[styles.button, {color: colors.card}]}>
                    <Pressable android_ripple={rippleConfig} onPress={onStop}>
                        <MaterialIcons
                            name="clear"
                            color={colors.text}
                            size={29}
                        />
                    </Pressable>
                </View>

                <View style={[styles.button, {color: colors.card}]}>
                    <Pressable android_ripple={rippleConfig} onPress={onPlay}>
                        <MaterialIcons
                            name={
                                state == TrackPlayer.STATE_PLAYING
                                    ? "pause"
                                    : "play-arrow"
                            }
                            color={colors.text}
                            size={29}
                        />
                    </Pressable>
                </View>

                <View style={[styles.button, {color: colors.card}]}>
                    <Pressable android_ripple={rippleConfig} onPress={onNext}>
                        <MaterialIcons
                            name="skip-next"
                            color={colors.text}
                            size={29}
                        />
                    </Pressable>
                </View>
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
        height: 1,
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
        paddingLeft: 10,
        paddingRight: 10,
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