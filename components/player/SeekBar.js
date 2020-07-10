import React from 'react';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import Slider from "@react-native-community/slider";

function pad(n, width, z = 0) {
    n = n + '';
    return n.length >= width ? n : new Array(width - n.length + 1).join(z) + n;
}

const minutesAndSeconds = (position) => ([
    pad(Math.floor(position / 60), 2),
    pad(position % 60, 2),
]);

const defaultString = {
    darkColor: "rgb(0, 0, 0)",
    lightGrayColor:  "rgb(25, 25, 25)",
}

export default ({
    trackLength,
    currentPosition,
    onSeek,
    onSlidingStart,
}) => {
    const elapsed = minutesAndSeconds(currentPosition);
    const remaining = minutesAndSeconds(trackLength - currentPosition);
    return (
        <View style={styles.container}>
            <Slider
                maximumValue={Math.max(trackLength, 1, currentPosition + 1)}
                onSlidingStart={onSlidingStart}
                onSlidingComplete={onSeek}
                value={currentPosition}
                minimumTrackTintColor={defaultString.darkColor}
                maximumTrackTintColor={defaultString.lightGrayColor}
                thumbStyle={styles.thumb}
                trackStyle={styles.track}
            />

            <View style={{ flexDirection: 'row', paddingRight: 15, paddingLeft: 15 }}>
                <Text style={[styles.text, { color: defaultString.darkColor }]}>
                    {elapsed[0] + ":" + elapsed[1]}
                </Text>
                <View style={{ flex: 1 }} />
                <Text style={[styles.text, { width: 40, color: defaultString.darkColor }]}>
                    {trackLength > 1 && "-" + remaining[0] + ":" + remaining[1]}
                </Text>
            </View>
        </View>
    );
};

const styles = StyleSheet.create({
  slider: {
    marginTop: -12,
  },

  container: {
    paddingTop: 16,
    marginLeft: -15,
    marginRight: -15,
  },

  track: {
    height: 2,
    borderRadius: 1,
  },

  thumb: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: "black",
    color: "black"
  },

  text: {
    color: 'rgba(255, 255, 255, 0.72)',
    fontSize: 12,
    textAlign: 'center',
  }
});