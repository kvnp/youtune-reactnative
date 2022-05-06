import { useState, useEffect, useRef } from "react";
import {
    View,
    StyleSheet,
    ActivityIndicator,
    Text
} from "react-native";

import { State } from 'react-native-track-player';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { useTheme } from "@react-navigation/native";
import { Button } from "react-native-paper";

import Music from "../../services/music/Music";
import Downloads from "../../services/device/Downloads";
import Settings from "../../services/device/Settings";
import Cast from "../../services/music/Cast";

import { insertBeforeLast } from "../../utils/Navigation";
import SeekBar from "../../components/player/SeekBar";
import SwipePlaylist from "../../components/player/SwipePlaylist";
import { showModal } from "../../components/modals/MoreModal";
import ScrollingText from "../../components/shared/ScrollingText";
import CastButton from "../../components/player/CastButton";

// Audio visualizer from https://github.com/gg-1414/music-visualizer
var audio;
var ctx;
var dataArray;
var analyser;
var playViewId;
var barHeight;
var barWidth;
var x = 0;
var bars = 0; // Set total number of bars you want per frame
var canvasWidth = 0;
var canvasFillStyle = null;

var firstPoint = 0;
var clientY = 0;

var firstImageX = 0;
var firstImageY = 0;
var imageX = 0;
var imageY = 0;
var passMovement = false;
var horizontalLocked = false;
const PlayView = ({route, navigation}) => {
    const [dimensions, setDimensions] = useState({height: window.innerHeight, width: window.innerWidth});
    const { height, width } = dimensions;
    const { dark, colors } = useTheme();
    const image = useRef(null);

    const [pointerDisabled, setPointerDisabled] = useState(false);
    const transition = "height .4s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity .1s";
    const canvas = useRef(null);
    const container = useRef(null);
    const vertContainer = useRef(null);
    const background = useRef(null);

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

    const updateDimensions = () => setDimensions({height: window.innerHeight, width: window.innerWidth});
    const prepareCanvas = () => {
        canvas.current.width = window.innerWidth;
        canvas.current.height = window.innerHeight;
        if (dataArray) {
            barWidth = (window.innerWidth / analyser.frequencyBinCount) * 13;
            bars = 0;
            canvasWidth = 0;
            while (canvasWidth <= canvas.current.width) {
                if (bars >= dataArray.length)
                    break;

                canvasWidth += barWidth + 5;
                bars++;
            }
        }
    }
    useEffect(prepareCanvas, [width, height]);

    const handlePlayback = () => {
        if (!title)
            Music.handlePlayback({
                id: route.params.v,
                playlistId: route.params.list
            });
    }

    const goBack = () => {
        cancelAnimationFrame(playViewId);
        container.current.style.transition = transition;
        container.current.style.height = "0px";
        if (!navigation.canGoBack())
            navigation.dispatch(insertBeforeLast("App"));
        navigation.navigate("App");
    }

    const handleMovement = value => {
        container.current.style.transition = "";
        setPointerDisabled(true);
        if (firstPoint == 0)
            firstPoint = value;
        clientY = value;

        let newHeight = (window.innerHeight - (clientY - firstPoint));
        let newOpacity = newHeight / window.innerHeight;
        container.current.style.height = newHeight + "px";
        container.current.style.opacity = newOpacity;
    };

    const handleTouch = e => handleMovement(e.touches[0].clientY);
    const handleMouse = e => {
        if (e.nativeEvent.target.getAttribute("role") == "slider")
            return;
        
        handleMovement(e.clientY);
    }

    const stopMovement = () => {
        setPointerDisabled(false);
        let diff = (window.innerHeight - (clientY - firstPoint)) / window.innerHeight;
        container.current.style.transition = transition;
        firstPoint = 0;
        clientY = 0;

        firstImageX = 0;
        firstImageY = 0;
        imageX = 0;
        imageY = 0;
        passMovement = false;
        horizontalLocked = false;
        if (diff < 0.5)
            return goBack();

        if (diff > 1.25 && !Music.isStreaming)
            Cast.cast();

        if (horizontalLocked) {
            if (image.current.style.transform.slice(11, -3)[0] == "-")
                Music.skipNext()
            else
                Music.skipPrevious()
        }
        
        container.current.style.height = "100%";
        image.current.style.transform = "translateX(0px)";
        image.current.style.opacity = 1;
        container.current.style.opacity = 1;
    }

    const handleImage = e => {
        let iX;
        let iY;
        if (e instanceof TouchEvent) {
            iX = e.touches[0].clientX;
            iY = e.touches[0].clientY;
        } else {
            iX = e.clientX;
            iY = e.clientY;
        }

        if (passMovement) {
            if (horizontalLocked)
                moveImage(iX);
            else
                handleMovement(iY);
            return;
        }

        if (!firstImageX) {
            firstImageX = iX;
            firstImageY = iY;
        }

        imageX = iX;
        imageY = iY;

        let xMovement = firstImageX - imageX;
        let yMovement = firstImageY - imageY;
        if (Math.abs(xMovement) >= 5) {
            passMovement = true;
            horizontalLocked = true;
            return;
        }

        if (Math.abs(yMovement) >= 5) {
            passMovement = true;
            horizontalLocked = false;
        }
    }

    const moveImage = value => {
        let newTranslate = value - firstImageX;
        let newOpacity = (image.current.width - Math.abs(newTranslate))/image.current.width;
        image.current.style.transform = "translateX(" + newTranslate + "px)";
        image.current.style.opacity = newOpacity;

    }

    const enableMovement = () => background.current.addEventListener("mousemove", handleMouse);
    const disableMovement = () => background.current.removeEventListener("mousemove", handleMouse);
    const darkenCanvas = () => canvas.current.style.opacity = .3;
    const restoreCanvas = () => canvas.current.style.opacity = .9;

    useEffect(() => {
        container.current.style.height = "100%";
        vertContainer.current.addEventListener("mouseover", darkenCanvas);
        vertContainer.current.addEventListener("mouseleave", restoreCanvas);
        vertContainer.current.addEventListener("touchstart", darkenCanvas);
        vertContainer.current.addEventListener("touchend", restoreCanvas);

        background.current.addEventListener("touchmove", handleTouch);
        background.current.addEventListener("touchend", stopMovement);
        background.current.addEventListener("mousedown", enableMovement);
        background.current.addEventListener("mouseout", disableMovement);
        background.current.addEventListener("mouseup", () => {disableMovement();stopMovement();});

        //image.current.addEventListener("mousemove", handleImage);
        image.current.addEventListener("touchmove", handleImage);
        image.current.addEventListener("touchend", stopMovement);

        document.addEventListener("mouseleave", stopMovement);
        window.addEventListener("resize", updateDimensions);
        return () => {
            document.removeEventListener("mouseleave", stopMovement);
            window.removeEventListener("resize", updateDimensions);
        };
    }, []);

    useEffect(() => {
        if (id != null) {
            navigation.setOptions({title: title});
            navigation.setParams({v: id, list: playlistId});
            Downloads.isTrackLiked(id).then(like => setLiked(like));
        }
    }, [id, playlistId]);

    useEffect(() => {
        container.current.style.backgroundColor = dark ? "black" : "white";
        canvasFillStyle = dark
            ? "rgba(0,0,0,0.2)" // Clears canvas before rendering bars (black with opacity 0.2)
            : "rgba(255,255,255,0.2)";
    }, [dark]);

    useEffect(() => {
        Settings.waitForInitialization().then(e => {
            if (!Settings.Values.visualizer)
                return;

            ctx = canvas.current.getContext("2d");
            if (!Music.audioContext) {
                Music.audioContext = new AudioContext(); // (Interface) Audio-processing graph
                if (!audio) audio = document.getElementsByTagName("audio")[0];
                let src = Music.audioContext.createMediaElementSource(audio); // Give the audio context an audio source,
                // to which can then be played and manipulated
                analyser = Music.audioContext.createAnalyser(); // Create an analyser for the audio context

                src.connect(analyser); // Connects the audio context source to the analyser
                analyser.connect(Music.audioContext.destination); // End destination of an audio graph in a given context
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
            
            prepareCanvas();
            renderFrame();
        });

        return () => cancelAnimationFrame(playViewId);
    }, []);

    useEffect(() => {
        if (Settings.initialized)
            handlePlayback();
        else
            Settings.waitForInitialization().then(handlePlayback);
            
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

        return () => {
            castListener.remove();
            stateListener.remove();
            metadataListener.remove();
            lkListener.remove();
        }
    }, []);

    const renderFrame = () => {
        playViewId = requestAnimationFrame(renderFrame); // Takes callback function to invoke before rendering
        analyser.getByteFrequencyData(dataArray); // Copies the frequency data into dataArray
        // Results in a normalized array of values between 0 and 255
        // Before this step, dataArray's values are all zeros (but with length of 8192)

        ctx.fillStyle = canvasFillStyle; // Clears canvas before rendering bars (black with opacity 0.2)
        ctx.fillRect(0, 0, canvas.current.width, canvas.current.height); // Fade effect, set opacity to 1 for sharper rendering of bars

        let r, g, b;
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

    return <View
        ref={container}
        style={{pointerEvents: "none", position: "fixed", width: "100%", height: "0px", bottom: 0, overflow: "hidden", transition: "height .25s ease-out, opacity .1s"}}
    >
        <canvas style={{pointerEvents: "none"}} id="canvas" ref={canvas}/>
        <div style={{pointerEvents: "auto"}} ref={background} id="background"/>
        <View ref={vertContainer} style={[stylesTop.vertContainer, {pointerEvents: "none", zIndex: 2, flexDirection: "column"}]}>
            <img ref={image} style={{height: height / 2.6, pointerEvents: "auto", ...imageStyles.view}} src={artwork}/>

            <View style={[stylesBottom.container, {pointerEvents: "none", width: width - 50, height: height / 2.6}]}>
                <View style={[controlStyles.container, {pointerEvents: "none"}]}>
                    <Button
                        onPress={() => likeSong(false)}
                        labelStyle={{marginHorizontal: 0}}
                        style={{pointerEvents: pointerDisabled ? "none" : "auto", borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                        contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                    >
                        <MaterialIcons
                            name="thumb-down" size={30} style={{alignSelf: "center"}} selectable={false}
                            color={isLiked == null ? "dimgray" : !isLiked ? colors.text : "dimgray"}
                        />
                    </Button>
                    
                    <View style={[{flexGrow: 1, width: 1, paddingHorizontal: 5, alignItems: "center", userSelect: "text", overflow: "hidden"}]}>
                        <ScrollingText>
                            <Text numberOfLines={1} style={[stylesBottom.titleText, {pointerEvents: pointerDisabled ? "none" : "auto", color: colors.text}]}>
                                {title}
                            </Text>
                        </ScrollingText>
                            
                        <ScrollingText>
                            <Text numberOfLines={1} style={[stylesBottom.subtitleText, {pointerEvents: pointerDisabled ? "none" : "auto", color: colors.text}]}>
                                {artist}
                            </Text>
                        </ScrollingText>
                    </View>

                    <Button
                        onPress={() => likeSong(true)} labelStyle={{marginHorizontal: 0}}
                        style={{pointerEvents: pointerDisabled ? "none" : "auto", borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                        contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                    >
                        <MaterialIcons name="thumb-up" size={30} color={isLiked == null ? "dimgray" : isLiked ? colors.text : "dimgray"} style={{alignSelf: "center"}} selectable={false}/>
                    </Button>
                </View>

                <SeekBar buffering={state} style={{pointerEvents: pointerDisabled ? "none" : "auto"}}/>

                <View style={[stylesBottom.buttonContainer, {pointerEvents: "none", overflow: "visible", alignSelf: "stretch", justifyContent: "space-between"}]}>
                    <CastButton style={{pointerEvents: pointerDisabled ? "none" : "auto"}}/>
                    <Button
                        labelStyle={{marginHorizontal: 0}}
                        style={{pointerEvents: pointerDisabled ? "none" : "auto", borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                        contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                        onPress={() => Music.skipPrevious()}
                    >
                        <MaterialIcons style={{alignSelf: "center"}} selectable={false} name="skip-previous" color={colors.text} size={40}/>
                    </Button>

                    <View style={{pointerEvents: pointerDisabled ? "none" : "auto", alignSelf: "center", alignItems: "center", justifyContent: "center", backgroundColor: dark ? colors.card : colors.primary, width: 60, height: 60, borderRadius: 30}}>
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
                        style={{pointerEvents: pointerDisabled ? "none" : "auto", borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                        contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                        onPress={() => Music.skipNext()}
                    >
                        <MaterialIcons style={{alignSelf: "center"}} selectable={false} name="skip-next" color={colors.text} size={40}/>
                    </Button>

                    <Button
                        disabled={connected ? true : false}
                        labelStyle={{marginHorizontal: 0}}
                        style={{pointerEvents: pointerDisabled ? "none" : "auto", borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                        contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                        onPress={() => setRepeat(Music.cycleRepeatMode())}
                    >
                        <MaterialIcons name={!Music.isStreaming ? repeat : "repeat-one-on"} color={colors.text} size={30} style={{alignSelf: "center"}} selectable={false}/>
                    </Button>
                </View>

                <View style={{pointerEvents: "none", justifyContent: "space-between", flexDirection: "row", paddingTop: 30}}>
                    <Button
                        labelStyle={{marginHorizontal: 0}}
                        style={{pointerEvents: pointerDisabled ? "none" : "auto", borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                        contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
                        onPress={goBack}
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
                        style={[stylesTop.topThird, {pointerEvents: pointerDisabled ? "none" : "auto", borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}]}
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
            style={{zIndex: 2, pointerEvents: pointerDisabled ? "none" : "auto"}}
        />
    </View>
}

export default PlayView;

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