import React, { useState, useEffect } from "react";
import {
    View,
    Text,
    Image,
    Pressable
} from "react-native";

import { useTheme } from "@react-navigation/native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import FlatEntries from "../../components/collections/FlatEntries";
import { fetchBrowse } from "../../modules/remote/API";

import {
    bottomBarStyle,
    bottomBarAlbumStyle
} from "../../styles/BottomBar";
import { rippleConfig } from "../../styles/Ripple";

export default PlaylistView = ({ route, navigation }) => {
    const {dark, colors} = useTheme();
    const [playlist, setPlaylist] = useState(null);
    navigation.setOptions({ title: "Loading" });

    useEffect(() => {
        fetchBrowse("VL" + route.params.list)
            .then(playlist => {
                setPlaylist(playlist);
                navigation.setOptions({ title: playlist.title });
            });
    }, []);

    var entries;
    if (playlist != null)
        entries = playlist.entries;
    else
        entries = [];
    
    return <>
        <FlatEntries 
            entries={entries}
            isPlaylist={true}
            navigation={navigation}
        />

        <View style={{
            alignSelf: "stretch",
            alignItems: "stretch",
            justifyContent: "space-evenly",
            backgroundColor: colors.card,
            width: "100%"
        }}>
            <View style={bottomBarStyle.topRow}>
                <Image style={bottomBarAlbumStyle.albumCover} source={{uri: playlist == null ? null : playlist.thumbnail}}/>
                <View>
                    {
                        playlist == null
                        ? <View style={{width: "250px", height: "20px", marginBottom: "2px", backgroundColor: colors.text}}/>
                        : <Text numberOfLines={1} style={[bottomBarAlbumStyle.albumTitle, bottomBarAlbumStyle.albumText, {color: colors.text}]}>
                            {playlist.title}
                        </Text>
                    }

                    {
                        playlist == null
                        ? <View style={{width: "200px", height: "20px", marginBottom: "2px", backgroundColor: colors.text}}/>
                        : <Text numberOfLines={1} style={[bottomBarAlbumStyle.albumSubtitle, bottomBarAlbumStyle.albumText, {color: colors.text}]}>
                            {playlist.subtitle}
                        </Text>
                    }

                    {
                        playlist == null
                        ? <View style={{width: "230px", height: "20px", marginBottom: "2px", backgroundColor: colors.text}}/>
                        : <Text numberOfLines={1} style={[bottomBarAlbumStyle.albumInfo, bottomBarAlbumStyle.albumText, {color: colors.text}]}>
                            {playlist.secondSubtitle}
                        </Text>
                    }
                    
                </View>
                <Pressable android_ripple={rippleConfig} style={[bottomBarStyle.closeButton, {backgroundColor: colors.border}]}
                            onPress={() => {
                                navigation.pop()
                                if (navigation.isFocused())
                                    navigation.navigate("App");
                            }}>
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
}