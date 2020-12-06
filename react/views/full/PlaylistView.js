import React from "react";
import {
    View,
    Text,
    Image,
    Pressable
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import {
    bottomBarStyle,
    bottomBarAlbumStyle
} from "../../styles/BottomBar";

import FlatEntries from "../../components/collections/FlatEntries";
import { rippleConfig } from "../../styles/Ripple";
import { useTheme } from "@react-navigation/native";

export default PlaylistView = ({ route, navigation }) => {
    const { entries, title, subtitle, secondSubtitle, thumbnail} = route.params;
    const { dark, colors } = useTheme();
    navigation.setOptions({ title: title });
    
    return (
        <>
            <FlatEntries entries={entries} isPlaylist={true} navigation={navigation}/>

            <View style={{
                alignSelf: "stretch",
                alignItems: "stretch",
                justifyContent: "space-evenly",
                backgroundColor: colors.card,
                width: "100%"
            }}>
                <View style={bottomBarStyle.topRow}>
                    <Image style={bottomBarAlbumStyle.albumCover} source={{uri: thumbnail}}/>
                    <View>
                        <Text numberOfLines={1} style={[bottomBarAlbumStyle.albumTitle, bottomBarAlbumStyle.albumText, {color: colors.text}]}>
                            {title}
                        </Text>

                        <Text numberOfLines={1} style={[bottomBarAlbumStyle.albumSubtitle, bottomBarAlbumStyle.albumText, {color: colors.text}]}>
                            {subtitle}
                        </Text>

                        <Text numberOfLines={1} style={[bottomBarAlbumStyle.albumInfo, bottomBarAlbumStyle.albumText, {color: colors.text}]}>
                            {secondSubtitle}
                        </Text>
                    </View>
                    <Pressable android_ripple={rippleConfig} style={[bottomBarStyle.closeButton, {backgroundColor: colors.border}]}
                               onPress={() => {navigation.pop()}}>
                        <MaterialIcons name="arrow-back" color={colors.text} size={20}/>
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
                    <Pressable android_ripple={rippleConfig} style={[bottomBarStyle.button, {backgroundColor: colors.border}]}>
                        <Text style={[bottomBarStyle.buttonText, {color: colors.text}]}>PLAY</Text>
                    </Pressable>
                    <Pressable android_ripple={rippleConfig} style={[bottomBarStyle.button, {backgroundColor: colors.border}]}>
                        <Text style={[bottomBarStyle.buttonText, {color: colors.text}]}>ADD TO LIBRARY</Text>
                    </Pressable>
                    <Pressable android_ripple={rippleConfig} style={[bottomBarStyle.button, {backgroundColor: colors.border}]}>
                        <Text style={[bottomBarStyle.buttonText, {color: colors.text}]}>SHARE</Text>
                    </Pressable>
                </View>
            </View>
        </>
    )
}