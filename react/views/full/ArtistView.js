import React from "react";
import {
    View,
    Text,
    ImageBackground,
    Pressable
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import LinearGradient from "react-native-linear-gradient";
import { bottomBarStyle } from "../../styles/BottomBar";

import FlatShelves from "../../components/collections/FlatShelves";
import { rippleConfig } from "../../styles/Ripple";
import { useTheme } from "@react-navigation/native";

export default ({route, navigation}) => {
    const { shelves } = route.params;
    const { title, subscriptions, thumbnail } = route.params.header;
    navigation.setOptions({ title: title });

    const { dark, colors } = useTheme();
    const gradientColors = ["rgba(242, 242, 242, 1)", "rgba(242, 242, 242, 0.8)", "rgba(242, 242, 242, 0.5)", "rgba(242, 242, 242, 0.2)"];
    const gradientColorsDark = ["rgba(0, 0, 0, 1)", "rgba(0, 0, 0, 0.8)", "rgba(0, 0, 0, 0.5)", "rgba(0, 0, 0, 0.2)"];

    return (
        <>
            <FlatShelves shelves={shelves} navigation={navigation}/>

            <ImageBackground style={bottomBarStyle.container} source={{uri: thumbnail}}>
                <LinearGradient style={bottomBarStyle.artistGradientStyle} colors={dark ? gradientColorsDark : gradientColors}>
                    <View style={bottomBarStyle.topRow}>
                        <View style={bottomBarStyle.artistColumn}>
                            <Text style={[bottomBarStyle.artistName, {color: colors.text}]}>{title}</Text>

                            <Pressable android_ripple={rippleConfig} style={bottomBarStyle.subscribeArtist}>
                                <Text style={{fontWeight: "bold", color: "white"}}>SUBSCRIBE {subscriptions}</Text>
                            </Pressable>
                        </View>
                        <Pressable android_ripple={rippleConfig} onPress={() => navigation.pop()}>
                            <View style={[bottomBarStyle.closeButton, {backgroundColor: colors.card}]}>
                                <MaterialIcons name="arrow-back" color={colors.text} size={20}/>
                            </View>
                        </Pressable>
                    </View>

                    <View style={{
                        flexDirection: "row",
                        alignSelf: "stretch",
                        alignItems: "center",
                        alignContent: "center",
                        justifyContent: "space-evenly",
                        paddingVertical: 10
                    }}>
                        <Pressable android_ripple={rippleConfig} style={{backgroundColor: colors.card}}>
                            <Text style={[bottomBarStyle.buttonText, bottomBarStyle.button, {color: colors.text}]}>PLAY</Text>
                        </Pressable>
                        <Pressable android_ripple={rippleConfig} style={{backgroundColor: colors.card}}>
                            <Text style={[bottomBarStyle.buttonText, bottomBarStyle.button, {color: colors.text}]}>ADD TO LIBRARY</Text>
                        </Pressable>
                        <Pressable android_ripple={rippleConfig} style={{backgroundColor: colors.card}}>
                            <Text style={[bottomBarStyle.buttonText, bottomBarStyle.button, {color: colors.text}]}>SHARE</Text>
                        </Pressable>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </>
    )
}