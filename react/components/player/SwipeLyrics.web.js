import { useRef, useEffect } from "react";
import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    Animated
} from "react-native";
import { useTheme } from "@react-navigation/native";
import { TouchableRipple } from "react-native-paper";
import SlidingUpPanel from 'rn-sliding-up-panel';
import { ScrollView } from "react-native-gesture-handler";

var lastY;
export default SwipeLyrics = ({playlist, track, backgroundColor, textColor, style}) => {
    const { height } = Dimensions.get("window");
    const colors = useTheme();
    const panel = useRef(null);
    const container = useRef(null);
    const draggableRange = { top: height - 50, bottom: 50 }
    const draggedValue = new Animated.Value(0);

    const handleMovement = e => {
        let currentY = e.touches[0].clientY;
        let scroll = container.current;
        if (scroll.scrollTop != 0) {
            if (currentY > lastY) {
                e.stopPropagation();
            }
        }
        lastY = currentY;
    }

    useEffect(() => {
        for (let i in style) {
            panel.current._content.style[i] = style[i];
            for (let node of panel.current._content.childNodes)
                node.style[i] = style[i];
        }
    }, [style]);

    useEffect(() => {
        let test = [
            "[Intro]",
            "(Mmm, yeah)",
            "",
            "[Verse 1]",
            "One more day and I might just give in, mmm, yeah",
            "For heaven's sake you know my limits",
            "Did I say too much?",
            "You test me, you lead me on",
            "Did I say enough?",
            "I'm tongue-tied and the moment's gone",
            "[Chorus]",
            "I wasn't looking but I've found a light in you",
            "If I'm not careful I might slip and fall through",
            "Would you come get me if I ended up loving you",
            "Could I be falling for free?",
            "I wasn't looking but I've found a light in you",
            "If I'm not careful I might slip and fall through",
            "Wish I could mention it's the elephant in the room",
            "He's only got eyes for me",
            "",
            "[Drop]",
            "",
            "[Post-Chorus]",
            "You got me stuck like glue, oh, oh",
            "Stuck like glue, oh, oh",
            "I wasn't looking but I've found a light in you",
            "If I'm not careful, I might slip and fall through",
            "Stuck like glue, oh, oh, mmm",
            "",
            "[Verse 2]",
            "I love the way you say my name with your mouth, mmm yeah",
            "It feels so strange I cannot go without",
            "Happens all the time",
            "You test me, you lead me on",
            "Should I speak my mind?",
            "I'm tongue-tied and the moment's gone (The moment's gone)",
            "[Bridge]",
            "(Ooh, ooh)",
            "",
            "[Chorus]",
            "I wasn't looking but I've found a light in you",
            "If I'm not careful I might slip and fall through",
            "Would you come get me if I ended up loving you",
            "Could I be falling for free? (Oh yeah)",
            "I wasn't looking but I've found a light in you",
            "If I'm not careful I might slip and fall through",
            "Wish I could mention it's the elephant in the room",
            "He's only got eyes for me",
            "",
            "[Drop]",
            "",
            "[Post-Chorus]",
            "You got me stuck like glue, oh, oh (Oh)",
            "Stuck like glue, oh, oh (Oh, oh woah)",
            "I wasn't looking but I've found a light in you (Yeah)",
            "If I'm not careful I might slip and fall through",
            "Stuck like glue, oh, oh",
            "Did I say too much?",
            "You test me, you lead me on",
            "Did I say enough?",
            "I'm tongue-tied and the moment's gone (Ooh yeah)",
            "[Outro]",
            "(Ooh, ooh)",
            "You got me stuck like glue"
        ];

        let scroll = container.current;
        scroll.addEventListener("touchmove", handleMovement);
        scroll.style.alignItems = "center";
        scroll.style.fontFamily = "system-ui";
        scroll.style.fontSize = "large";
        scroll.style.paddingLeft = "5%";
        scroll.style.paddingRight = "5%";
        
        for (let s of test) {
            console.log(s);
            scroll.insertAdjacentText('beforeend', s);
            scroll.insertAdjacentHTML('beforeend', "<br>");
        }
    }, []);

    return <SlidingUpPanel
        showBackdrop={false}
        ref={panel}
        allowDragging={true}
        draggableRange={draggableRange}
        animatedValue={draggedValue}
        snappingPoints={[50, height - 50]}
        height={height}
        friction={0.5}
    >
        <View style={[styles.panel, {position: "absolute", top: -50}]}>
            <TouchableRipple 
                rippleColor={colors.primary}
                style={[styles.panelHeader, {backgroundColor: backgroundColor}]}
                onPress={() => panel.current.show()}
            >
                <>
                <View style={[
                    stylesRest.smallBar,
                    {backgroundColor: textColor}
                ]}/>
                <Text
                    style={{color: textColor}}
                    selectable={false}
                >
                    LYRICS
                </Text>
                </>
            </TouchableRipple>

            <ScrollView
                ref={container}
                style={{
                    height: height - 100,
                    backgroundColor: backgroundColor,
                    color: textColor,
                    paddingBottom: "5%"
                }}
                contentContainerStyle={stylesRest.playlistContainer}
            >

            </ScrollView>
        </View>
    </SlidingUpPanel>
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "stretch",
        justifyContent: "center"
    },

    panel: {
        flex: 1,
        backgroundColor: "transparent",
        position: "relative",
        alignSelf: "center",
        width: "100%",
        maxWidth: 800,
    },

    panelHeader: {
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 10
    },

    textHeader: {
        fontSize: 28,
        color: "#FFF"
    }
});

const stylesRest = StyleSheet.create({
    playlistContainer: {
        width: "100%",
        paddingHorizontal: 10,
        paddingBottom: "5%"
    },

    topAlign: {
        alignSelf: "center",
        marginBottom: 10
    },

    smallBar: {
        height: 4,
        width: 30,
        borderRadius: 2,
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 10
    }
});