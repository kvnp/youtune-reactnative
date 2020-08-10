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
                    <View style={bottomBarStyle.centerContainer}>
                        <View style={bottomBarStyle.topRow}>
                            <View style={bottomBarStyle.topLeftPadding}/>
                            <View style={bottomBarStyle.artistColumn}>
                                <Text style={bottomBarStyle.artistName}>{title}</Text>

                                <Pressable style={bottomBarStyle.subscribeArtist}>
                                    <Text style={{fontWeight: "bold"}}>ABONNIEREN {subscriptions}</Text>
                                </Pressable>
                            </View>
                            <Pressable android_ripple={rippleConfig} onPress={() => {navigation.pop()}}>
                                <View style={bottomBarStyle.closeButton}>
                                    <MaterialIcons name="arrow-back" color="black" size={20}/>
                                </View>
                            </Pressable>
                        </View>

                        <View style={bottomBarStyle.buttonView}>
                            <Pressable android_ripple={rippleConfig}>
                                <Text style={[bottomBarStyle.buttonText, bottomBarStyle.button]}>WIEDERGEBEN</Text>
                            </Pressable>
                            <Pressable android_ripple={rippleConfig}>
                                <Text style={[bottomBarStyle.buttonText, bottomBarStyle.button]}>ZUR MEDIATHEK</Text>
                            </Pressable>
                            <Pressable android_ripple={rippleConfig}>
                                <Text style={[bottomBarStyle.buttonText, bottomBarStyle.button]}>TEILEN</Text>
                            </Pressable>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </>
    )
}