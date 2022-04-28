import { useState, useEffect, useRef, useCallback } from "react";
import {
    View,
    StyleSheet,
    Image,
    ActivityIndicator,
    Text,
    useWindowDimensions
} from "react-native";

import { State } from 'react-native-track-player';
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
import Cast from "../../services/music/Cast";
import { insertBeforeLast } from "../../utils/Navigation";
import Settings from "../../services/device/Settings";

// Audio visualizer from https://github.com/gg-1414/music-visualizer
var audio;
var ctx;
var context;
var dataArray
var analyser;
var playViewActive = false;
var barHeight;
var barWidth;
var x = 0;

const PlayView = ({route, navigation}) => {
    const { height, width } = useWindowDimensions();
    const { dark, colors } = useTheme();

    const [state, setState] = useState(Music.state);
    const [track, setTrack] = useState(Music.metadata);
    const [repeat, setRepeat] = useState(Music.repeatModeString);
    const [connected, setConnected] = useState(Music.isStreaming);
    const [isLiked, setLiked] = useState(null);

    const {id, playlistId, title, artist, artwork} = track;
    
    const likeSong = like => {
        Downloads.likeTrack(id, like);
        setLiked(like);
    }

    useEffect(() => {
        if (!Settings.initialized) {
            Settings.waitForInitialization().then(() => Settings.enableAudioVisualizer(false));
            return;
        }

        if (!Settings.Values.visualizer)
            return;

        playViewActive = true;
        ctx = canvas.current.getContext("2d");
        if (!context) {
            context = new AudioContext(); // (Interface) Audio-processing graph
            if (!audio) audio = document.getElementsByTagName("audio")[0];
            let src = context.createMediaElementSource(audio); // Give the audio context an audio source,
            // to which can then be played and manipulated
            analyser = context.createAnalyser(); // Create an analyser for the audio context

            src.connect(analyser); // Connects the audio context source to the analyser
            analyser.connect(context.destination); // End destination of an audio graph in a given context
            // Sends sound to the speakers or headphones
        }

        /////////////// ANALYSER FFTSIZE ////////////////////////
        // analyser.fftSize = 32;
        // analyser.fftSize = 64;
        // analyser.fftSize = 128;
        // analyser.fftSize = 256;
        // analyser.fftSize = 512;
        // analyser.fftSize = 1024;
        // analyser.fftSize = 2048;
        // analyser.fftSize = 4096;
        // analyser.fftSize = 8192;
        analyser.fftSize = 16384;
        // analyser.fftSize = 32768;

        // (FFT) is an algorithm that samples a signal over a period of time
        // and divides it into its frequency components (single sinusoidal oscillations).
        // It separates the mixed signals and shows what frequency is a violent vibration.

        // (FFTSize) represents the window size in samples that is used when performing a FFT

        // Lower the size, the less bars (but wider in size)
        ///////////////////////////////////////////////////////////


        const bufferLength = analyser.frequencyBinCount; // (read-only property)
        // Unsigned integer, half of fftSize (so in this case, bufferLength = 8192)
        // Equates to number of data values you have to play with for the visualization

        // The FFT size defines the number of bins used for dividing the window into equal strips, or bins.
        // Hence, a bin is a spectrum sample, and defines the frequency resolution of the window.

        dataArray = new Uint8Array(bufferLength); // Converts to 8-bit unsigned integer array
        // At this point dataArray is an array with length of bufferLength but no values
        console.log('DATA-ARRAY: ', dataArray) // Check out this array of frequency values!

        console.log('width: ', width, 'height: ', height)

        barWidth = (width / bufferLength) * 13;
        console.log('BARwidth: ', barWidth)

        console.log('TOTAL width: ', (117*10)+(118*barWidth)) // (total space between bars)+(total width of all bars)
        renderFrame();
        return () => playViewActive = false;
    }, []);

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

        const castListener = Cast.addListener(
            Cast.EVENT_CAST,
            e => {
                if (e.castState == "CONNECTED")
                    setConnected(true);
                else
                    setConnected(false);
            }
        )

        const stateListener = Music.addListener(
            Music.EVENT_STATE_UPDATE,
            e => setState(e)
        );

        const metadataListener = Music.addListener(
            Music.EVENT_METADATA_UPDATE,
            () => setTrack(Music.metadata)
        );

        const lkListener = Downloads.addListener(
            Downloads.EVENT_LIKE,
            like => setLiked(like)
        )
        
        for (let element of container.childNodes[2].childNodes) {
            element.addEventListener("mouseover", () => canvas.current.style.opacity = 0.3);
            element.addEventListener("mouseleave", () => canvas.current.style.opacity = 0.9);
        }

        return () => {
            castListener.remove();
            stateListener.remove();
            metadataListener.remove();
            lkListener.remove();
        }
    }, []);

    const canvas = useRef(null);
    useEffect(() => {
        canvas.current.width = width;
        canvas.current.height = height;
    }, [width, height]);

    useEffect(() => {
        let container = document.getElementById("container");
        container.style.backgroundColor = dark ? "black" : "white";
    }, [dark]);

    const renderFrame = () => {
        if (!playViewActive)
            return;

        requestAnimationFrame(renderFrame); // Takes callback function to invoke before rendering
        analyser.getByteFrequencyData(dataArray); // Copies the frequency data into dataArray
        // Results in a normalized array of values between 0 and 255
        // Before this step, dataArray's values are all zeros (but with length of 8192)

        ctx.fillStyle = "rgba(0,0,0,0.2)"; // Clears canvas before rendering bars (black with opacity 0.2)
        ctx.fillRect(0, 0, canvas.current.width, canvas.current.height); // Fade effect, set opacity to 1 for sharper rendering of bars

        let r, g, b;
        let bars = 0; // Set total number of bars you want per frame
        let canvasWidth = 0;

        while (canvasWidth <= canvas.current.width) {
            if (bars >= dataArray.length)
                break;

            canvasWidth += barWidth + 10;
            bars++;
        }

        x = (canvas.current.width - canvasWidth)/2;
        for (let i = 0; i < bars; i++) {
            barHeight = (dataArray[i] * 2.5);
    
            if (dataArray[i] > 210) { // pink
                r = 250
                g = 0
                b = 255
            } else if (dataArray[i] > 200) { // yellow
                r = 250
                g = 255
                b = 0
            } else if (dataArray[i] > 190) { // yellow/green
                r = 204
                g = 255
                b = 0
            } else if (dataArray[i] > 180) { // blue/green
                r = 0
                g = 219
                b = 131
            } else { // light blue
                r = 0
                g = 199
                b = 255
            }
    
            ctx.fillStyle = `rgb(${r},${g},${b})`;
            ctx.fillRect(x, (canvas.current.height - barHeight), barWidth, barHeight);
            // (x, y, i, j)
            // (x, y) Represents start point
            // (i, j) Represents end point
    
            x += barWidth + 10 // Gives 10px space between each bar
        }
    }

    return <div id="container">
        <canvas id="canvas" ref={canvas}/>
        <div id="background"/>
        <View style={[stylesTop.vertContainer, {zIndex: 2, flexDirection: "column"}]}>
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
                            size={30}
                            color={
                                isLiked == null
                                    ? "dimgray"
                                    : !isLiked
                                        ? colors.text
                                        : "dimgray"
                            }
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

                <SeekBar buffering={state}/>
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
                                            ? Music.pause
                                            : Music.play
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
                        disabled={
                            connected
                                ? true
                                : false
                        }
                        labelStyle={{marginHorizontal: 0}}
                        style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                        contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                        onPress={() => setRepeat(Music.cycleRepeatMode())}
                    >
                        <MaterialIcons
                            style={{alignSelf: "center"}}
                            selectable={false}
                            color={colors.text} size={30}
                            name={!Music.isStreaming
                                ? repeat
                                : "repeat-one-on"
                            }
                        />
                    </Button>
                </View>

                <View style={{justifyContent: "space-between", flexDirection: "row", paddingTop: 30}}>
                    <Button
                        labelStyle={{marginHorizontal: 0}}
                        style={{borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                        contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                        onPress={() => {
                            if (!navigation.canGoBack())
                                navigation.dispatch(insertBeforeLast("App"));
                            navigation.navigate("App");
                        }}
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
            style={{zIndex: 2}}
        />
    </div>
}

export default PlayView;

const stylesRest = StyleSheet.create({
    container: {
        borderTopRightRadius: 15,
        borderTopLeftRadius: 15,
        position: "fixed",
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