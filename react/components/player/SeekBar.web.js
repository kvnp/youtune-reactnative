import { useEffect, useState, useRef } from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';

import { useTheme } from '@react-navigation/native';
import Slider from '@react-native-community/slider';
import Music from '../../services/music/Music';

function pad(n, width, z = 0) {
    n = n + '';
    return n.length >= width
        ? n
        : new Array(width - n.length + 1).join(z) + n;
}

const minutesAndSeconds = position => ([
    pad( ~~(position / 60), 2),
    pad( ~~(position % 60), 2),
]);

var slider;
var leftBar;
var rightBar;
var thumb;
export default SeekBar = ({style, thumbColor, fontColor, buttonColor}) => {
    const { duration } = Music.metadata;
    const [width, setWidth] = useState("99.99%");
    const [position, setPosition] = useState(Music.position);
    const [state, setState] = useState({
        isSliding: false,
        cache: 0
    });

    const realPosition = state.isSliding != true
        ? position
        : state.cache

    const elapsed = minutesAndSeconds(realPosition);
    const remaining = minutesAndSeconds(duration - realPosition);
    const container = useRef(null);

    useEffect(() => {
        slider = container.current.childNodes[0];
        leftBar = slider.childNodes[0];
        rightBar = slider.childNodes[2];

        leftBar.style.height = "5px";
        rightBar.style.height = "5px";

        leftBar.style.borderRadius = "";
        leftBar.style.borderBottomLeftRadius = "5px";
        leftBar.style.borderTopLeftRadius = "5px";
        rightBar.style.borderRadius = "";
        rightBar.style.borderBottomRightRadius = "5px";
        rightBar.style.borderTopRightRadius = "5px";

        leftBar.style.transition = "height .3s, flex-grow .3s";
        rightBar.style.transition = "height .3s, flex-grow .3s";

        thumb = slider.childNodes[1];
        thumb.style.transition = "width .3s";

        const enter = () => {
            thumb.style.width = "0px";
            leftBar.style.height = "15px";
            rightBar.style.height = "15px";
        };
    
        const leave = () => {
            thumb.style.width = "20px";
            leftBar.style.height = "5px";
            rightBar.style.height = "5px";
        };

        container.current.onmouseenter = () => enter();
        container.current.ontouchstart = () => enter();
        container.current.onmouseleave = () => leave();
        container.current.ontouchend = () => leave();
    }, []);

    useEffect(() => {
        setWidth("100%");
        const listener = Music.addListener(
            Music.EVENT_POSITION_UPDATE,
            pos => {
                if (state.isSliding)
                    return;
                
                setPosition(pos);
            }
        );

        return () => listener.remove();
    }, []);

    return <View ref={container} style={[styles.container, style]}>
        <Slider
            onSlidingComplete={position => {
                leftBar.style.transition = "height .3s, flex-grow .3s";
                rightBar.style.transition = "height .3s, flex-grow .3s";
                Music.seekTo(position);
                setState({
                    isSliding: false,
                    cache: 0
                });
            }}

            onValueChange={value => {
                if (state.isSliding) {
                    setState({
                        isSliding: true,
                        cache: value
                    });
                }
            }}
            
            onSlidingStart={currentPosition => {
                leftBar.style.transition = "height .3s";
                rightBar.style.transition = "height .3s";
                setState({
                    isSliding: true,
                    cache: currentPosition
                });
            }}
            
            value={realPosition}
            maximumValue={duration}
            minimumTrackTintColor={fontColor}
            maximumTrackTintColor={buttonColor}
            thumbTintColor={thumbColor}
            thumbStyle={{color: thumbColor}}
            style={{width: width}}
        />

        <View style={{ flexDirection: 'row', paddingRight: 15, paddingLeft: 15 }}>
            <Text style={[styles.text, {color: fontColor}]}>
                {elapsed[0] + ':' + elapsed[1]}
            </Text>
            <View style={{ flex: 1 }} />
            <Text style={[styles.text, {textAlign: 'right', color: fontColor}]}>
                {'-' + remaining[0] + ':' + remaining[1]}
            </Text>
        </View>
    </View>
};

const styles = StyleSheet.create({
    slider: {
        marginTop: -12
    },

    container: {
        paddingTop: 16
    },

    track: {
        borderRadius: 1
    },

    text: Platform.OS == 'ios'
    ? {
        fontSize: 12,
        textAlign: 'center',
        marginLeft: -14,
        marginRight: -14
    }

    : {
        fontSize: 13,
        textAlign: 'center'
    }
});