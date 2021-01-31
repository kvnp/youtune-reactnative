import React, { useEffect, useState } from "react";
import { StyleSheet, View, Pressable, Image, Text } from "react-native";
import { useTheme } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TrackPlayer, { useTrackPlayerProgress } from 'react-native-track-player';

import { skip, setPlay } from "../../service";
import { rippleConfig } from "../../styles/Ripple";

export default MiniPlayer = ({navigation, style}) => {
    const [playerState, setPlayer] = useState({
        isPlaying: false,
        isStopped: true,
        isLoading: false,
        track: null
    });

    const {dark, colors} = useTheme();
    const { position, duration } = useTrackPlayerProgress();

    const positionLength = 100 / duration * position;
    const remainingLength = 100 - positionLength;

    useEffect(() => {
        refreshUI();
        let _unsub = [];
        _unsub.push(
            TrackPlayer.addEventListener("playback-state", params => refreshUI())
        );

        _unsub.push(
            TrackPlayer.addEventListener("playback-track-changed", params => refreshUI())
        );

        return () => {
            for (let i = 0; i < _unsub.length; i++)
                _unsub[i].remove();
        }
    }, []);

    const refreshUI = async() => {
        let id = await TrackPlayer.getCurrentTrack();
        if (id != null) {
            let track = await TrackPlayer.getTrack(id);
            let state = await TrackPlayer.getState();
            let newstate = {track: track};

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
                    break;
                case TrackPlayer.STATE_BUFFERING:
                    newstate.isPlaying = false;
                    newstate.isLoading = true;
                    newstate.isStopped = false;
                    break;
            }

            setPlayer(newstate);
        } else
            setPlayer({
                isPlaying: false,
                isLoading: false,
                isStopped: true
            });
    }

    const onOpen = () => navigation.navigate("Music");

    const onNext = () => skip(true);

    const onPlay = () => setPlay(playerState.isPlaying);

    const onStop = () => TrackPlayer.reset().then(refreshUI);

    var title = null;
    var artist = null;
    var artwork = null;

    if (playerState.track != null) {
        title = playerState.track.title;
        artist = playerState.track.artist;
        artwork = playerState.track.artwork;
    }

    return  <View style={[style, styles.main, {height: playerState.isStopped ?0 :50, backgroundColor: colors.card}]}>
        <View style={[styles.main, {justifyContent: "space-evenly", width: "100%", maxWidth: "800px", alignSelf: "center"}]}>
            <View style={styles.playback}>
                <View style={{width: positionLength + "%", backgroundColor: colors.text}}></View>
                <View style={{width: remainingLength + "%", backgroundColor: colors.card}}></View>
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
                        <MaterialIcons name="clear" color={colors.text} size={29}/>
                    </Pressable>
                </View>

                <View style={[styles.button, {color: colors.card}]}>
                    <Pressable android_ripple={rippleConfig} onPress={onPlay}>
                        <MaterialIcons name={playerState.isPlaying ?"pause" :"play-arrow"} color={colors.text} size={29}/>
                    </Pressable>
                </View>

                <View style={[styles.button, {color: colors.card}]}>
                    <Pressable android_ripple={rippleConfig} onPress={onNext}>
                        <MaterialIcons name="skip-next" color={colors.text} size={29}/>
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
        height: "1px",
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