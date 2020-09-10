import React from "react";
import {
    View,
    Text,
    ImageBackground,
    Pressable
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import LinearGradient from "react-native-linear-gradient";
import { bottomBarStyle, artistGradient } from "../../styles/BottomBar";

import FlatShelves from "../../components/collections/FlatShelves";
import { rippleConfig } from "../../styles/Ripple";

export default ({route, navigation}) => {
    const { shelves } = route.params;
    const { title, subscriptions, thumbnail } = route.params.header;
    navigation.setOptions({ title: title });

    return (
        <>
            <FlatShelves shelves={shelves} navigation={navigation}/>

            <ImageBackground style={bottomBarStyle.container} source={{uri: thumbnail}}>
                <LinearGradient style={bottomBarStyle.artistGradientStyle} colors={artistGradient}>
                    <View style={bottomBarStyle.topRow}>
                        <View style={bottomBarStyle.artistColumn}>
                            <Text style={bottomBarStyle.artistName}>{title}</Text>

                            <Pressable style={bottomBarStyle.subscribeArtist}>
                                <Text style={{fontWeight: "bold"}}>SUBSCRIBE {subscriptions}</Text>
                            </Pressable>
                        </View>
                        <Pressable android_ripple={rippleConfig} onPress={() => navigation.pop()}>
                            <View style={bottomBarStyle.closeButton}>
                                <MaterialIcons name="arrow-back" color="black" size={20}/>
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
                        <Pressable android_ripple={rippleConfig}>
                            <Text style={[bottomBarStyle.buttonText, bottomBarStyle.button]}>PLAY</Text>
                        </Pressable>
                        <Pressable android_ripple={rippleConfig}>
                            <Text style={[bottomBarStyle.buttonText, bottomBarStyle.button]}>ADD TO LIBRARY</Text>
                        </Pressable>
                        <Pressable android_ripple={rippleConfig}>
                            <Text style={[bottomBarStyle.buttonText, bottomBarStyle.button]}>SHARE</Text>
                        </Pressable>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </>
    )
}