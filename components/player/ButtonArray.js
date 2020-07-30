import React from "react";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { Pressable, View } from "react-native";

import { ActivityIndicator } from 'react-native-paper';

import { rippleConfig } from "../../styles/Ripple";

export default ({
    style,
    onPlay,
    onPrevious,
    onNext,
    onRepeat,
    onShuffle,
    isPlaying,
    isRepeating,
    isLoading
}) => {
    return (
        <View style={style}>
            <Pressable onPress={onShuffle} android_ripple={rippleConfig}>
                <MaterialIcons name="shuffle" color="black" size={30}/>
            </Pressable>

            <Pressable onPress={onPrevious} android_ripple={rippleConfig}>
                <MaterialIcons name="skip-previous" color="black" size={40}/>
            </Pressable>

            <Pressable onPress={() => {
                                    isLoading ? null : onPlay();
                                }} android_ripple={rippleConfig}>
                {isLoading ? <ActivityIndicator color="black" size="small"/>
                           : <MaterialIcons name={isPlaying ? "pause" : "play-arrow"} color="black" size={40}/>
                }
                
            </Pressable>

            <Pressable onPress={onNext} android_ripple={rippleConfig}>
                <MaterialIcons name="skip-next" color="black" size={40}/>
            </Pressable>

            <Pressable onPress={onRepeat} android_ripple={rippleConfig}>
                <MaterialIcons name={isRepeating ? "repeat-one" : "repeat"} color="black" size={30}/>
            </Pressable>
        </View>
    )
}