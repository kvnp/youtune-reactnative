import React, { useState, useEffect } from 'react';

import {
    View,
    Text,
    StyleSheet,
    Platform
} from 'react-native';

import { useNavigation, useTheme } from '@react-navigation/native';
import Slider from '@react-native-community/slider';

import TrackPlayer from 'react-native-track-player';

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

export default SeekBar = ({style, duration}) => {
    const navigation = useNavigation();
    const [isSliding, setSliding] = useState(false);
    const [positionCache, setPositionCache] = useState(0);
    const [state, setState] = useState({
        position: 0,
        bufferedPosition: 0
    });

    const { position, bufferedPosition } = state;

    const elapsed = minutesAndSeconds(position);
    const remaining = minutesAndSeconds(duration - position);
    const { colors } = useTheme();

    const updateSeekbar = async() => {
        setState({
            position: await TrackPlayer.getPosition(),
            bufferedPosition: await TrackPlayer.getBufferedPosition()
        });
    }

    useEffect(() => {
        var interval;

        const focus = navigation.addListener('focus', async() => {
            updateSeekbar();
            if (await TrackPlayer.getState() == TrackPlayer.STATE_PLAYING) {
                clearInterval(interval);
                interval = setInterval(() => updateSeekbar(), 500);
            }
        });

        const trackState = TrackPlayer.addEventListener('playback-state', playback => {
            clearInterval(interval);
            switch (playback.state) {
                case TrackPlayer.STATE_PLAYING:
                    interval = setInterval(() => updateSeekbar(), 500);
                    break;
                case TrackPlayer.STATE_NONE:
                case TrackPlayer.STATE_PAUSED:
                case TrackPlayer.STATE_STOPPED:
                case TrackPlayer.STATE_BUFFERING:
                    updateSeekbar();
            }
        });

        return () => {
            clearInterval(interval);
            focus();
            trackState.remove();
        }
    }, []);

    return (
        <View style={[styles.container, style]}>
            <Slider
                maximumValue={Math.max(duration, 1, position)}
                onSlidingComplete={async(newPosition) => {
                    await TrackPlayer.seekTo(newPosition);
                    setState(oldState => ({
                        ...oldState,
                        position: newPosition
                    }));
                    setSliding(false);
                }}
                onSlidingStart={currentPosition => {
                    setSliding(true);
                    setPositionCache(currentPosition);
                }}

                value={isSliding != true ? position : positionCache}
                bufferedPosition={bufferedPosition}
                minimumTrackTintColor={colors.text}
                maximumTrackTintColor={colors.card}
                thumbTintColor={colors.primary}
                thumbStyle={{color: colors.primary}}
                trackStyle={styles.track}
            />

            <View style={{ flexDirection: 'row', paddingRight: 15, paddingLeft: 15 }}>
                <Text style={[styles.text, {color: colors.text}]}>
                    {elapsed[0] + ':' + elapsed[1]}
                </Text>
                <View style={{ flex: 1 }} />
                <Text style={[styles.text, {textAlign: 'right', color: colors.text}]}>
                    {'-' + remaining[0] + ':' + remaining[1]}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
    slider: {
        marginTop: -12
    },

    container: Platform.OS == 'android'
        ? {
            paddingTop: 16,
            marginLeft: -15,
            marginRight: -15
        }

        : {
            paddingTop: 16
        },

    track: {
        height: 2,
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