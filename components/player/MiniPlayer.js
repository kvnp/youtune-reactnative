import React from "react";
import { StyleSheet, Animated, View, Pressable, Image, Text } from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { ActivityIndicator } from "react-native-paper";

export default (props) => {
    const {
        style,
        isPlaying,
        isStopped,
        isLoading,

        onOpen,
        onNext,
        onPlay,
        onStop
    } = props;

    if (props.media != undefined)
        var {title, subtitle, thumbnail} = props.media;

    return isStopped
        ?   false
        :   <Animated.View style={style}>
                <Pressable style={styles.container} onPress={onOpen}>
                    <Image source={{uri: thumbnail}} style={styles.image}/>
                    <View style={styles.textContainer}>
                        <Text numberOfLines={1} style={[styles.text, styles.titleText]}>{title}</Text>
                        <Text numberOfLines={1} style={[styles.text, styles.subtitleText]}>{subtitle}</Text>
                    </View>

                    <Pressable style={styles.button} onPress={onStop}>
                        <MaterialIcons name="clear" color="white" size={29}/>
                    </Pressable>

                    <Pressable style={styles.button} onPress={onPlay}>
                        {
                        isLoading ? <ActivityIndicator color="white" size="small"/>
                                  : <MaterialIcons name={isPlaying ?"pause" :"play-arrow"} color="white" size={29}/>
                        }
                    </Pressable>

                    <Pressable style={styles.button}  onPress={onNext}>
                        <MaterialIcons name="skip-next" color="white" size={29}/>
                    </Pressable>
                </Pressable>
            </Animated.View>
}

const styles = StyleSheet.create({
    container: {
        flexDirection: "row",
        overflow: "hidden",
        height: 50,
        paddingRight: 15,
        paddingLeft: 15,
        paddingBottom: 2,
        paddingTop: 2,
        alignItems: "center",
        alignSelf: "center",
    },

    image: {
        height: "100%",
        aspectRatio: 1,
        backgroundColor: "gray",
    },

    textContainer: {
        flex: 1,
        overflow: "hidden",
        paddingLeft: 10
    },

    text: {
        color: "white",
    },

    titleText: {
        fontWeight: "bold"
    },

    subtitleText: {
        
    },

    button: {
        paddingLeft: 2,
        paddingRight: 2
    }
});