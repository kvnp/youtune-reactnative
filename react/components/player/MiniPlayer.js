import React, { useEffect, useState } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { Button} from "react-native-paper";
import { useTheme } from "@react-navigation/native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import TrackPlayer, { useTrackPlayerProgress } from 'react-native-track-player';

import { skip } from "../../service";

export default MiniPlayer = ({navigation, style}) => {
    const [state, setState] = useState(TrackPlayer.STATE_STOPPED);

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
    
    const { title, artist, artwork } = track;

    return <View
        style={[
            style,
            styles.main,
            {
                height: state == TrackPlayer.STATE_STOPPED || state == TrackPlayer.STATE_NONE
                    ? 0
                    : 50,
                backgroundColor: colors.card
            }
        ]}
    >
        <View style={[styles.main, {justifyContent: "space-evenly", width: "100%", maxWidth: 800, alignSelf: "center"}]}>
            <View style={styles.playback}>
                <View style={{width: positionWidth, backgroundColor: colors.text}}></View>
                <View style={{width: remainingWidth, backgroundColor: colors.card}}></View>
            </View>
            <View style={styles.container}>
                <Image source={{uri: artwork}} style={styles.image}/>
                <View style={styles.textContainer}>
                    <Button
                        onPress={onOpen}
                        labelStyle={{marginHorizontal: 0, margin: 0, padding: 0, borderRadius: 0, letterSpacing: "normal", textTransform: "none", fontSize: 14, textAlignVertical: "center"}}
                        style={{alignItems: "stretch", padding: 0, margin: 0}}
                        contentStyle={{alignItems: "center", height: 50}}
                    >
                        <Text numberOfLines={1} style={[styles.titleText, {color: colors.text}]}>{title + "\n"}</Text>
                        <Text numberOfLines={1} style={[styles.subtitleText, {color: colors.text}]}>{artist}</Text>
                    </Button>
                </View>

                <View style={[styles.button, {color: colors.card}]}>
                    <Button
                        onPress={onStop}
                        labelStyle={{marginHorizontal: 0}}
                        style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                        contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                            
                    >
                        <MaterialIcons
                            name="clear"
                            color={colors.text}
                            size={29}
                        />
                    </Button>
                </View>

                <View style={[styles.button, {color: colors.card}]}>
                    <Button
                        onPress={onPlay}
                        labelStyle={{marginHorizontal: 0}}
                        style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                        contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
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
                    </Button>
                </View>

                <View style={[styles.button, {color: colors.card}]}>
                    <Button
                        onPress={onNext}
                        labelStyle={{marginHorizontal: 0}}
                        style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                        contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                    >
                        <MaterialIcons
                            name="skip-next"
                            color={colors.text}
                            size={29}
                        />
                    </Button>
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