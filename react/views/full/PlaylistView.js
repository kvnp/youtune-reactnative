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
import { appColor } from "../../styles/App";

export default PlaylistView = ({ route, navigation }) => {
    const { entries, title, subtitle, secondSubtitle, thumbnail} = route.params;
    navigation.setOptions({ title: title });
    
    return (
        <View style={{overflow: "hidden", height: "100%"}}>
            <FlatEntries entries={entries} isPlaylist={true} navigation={navigation}/>

            <View style={{
                alignSelf: "stretch",
                alignItems: "stretch",
                justifyContent: "space-evenly",
                backgroundColor: appColor.background.backgroundColor,
                width: "100%"
            }}>
                <View style={bottomBarStyle.topRow}>
                    <Image style={bottomBarAlbumStyle.albumCover} source={{uri: thumbnail}}/>
                    <View>
                        <Text numberOfLines={1} style={[bottomBarAlbumStyle.albumTitle, bottomBarAlbumStyle.albumText]}>
                            {title}
                        </Text>

                        <Text numberOfLines={1} style={[bottomBarAlbumStyle.albumSubtitle, bottomBarAlbumStyle.albumText]}>
                            {subtitle}
                        </Text>

                        <Text numberOfLines={1} style={[bottomBarAlbumStyle.albumInfo, bottomBarAlbumStyle.albumText]}>
                            {secondSubtitle}
                        </Text>
                    </View>
                    <Pressable android_ripple={rippleConfig} style={bottomBarStyle.closeButton}
                               onPress={() => {navigation.pop()}}>
                        <MaterialIcons name="arrow-back" color="black" size={20}/>
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
                    <Pressable android_ripple={rippleConfig} style={bottomBarStyle.button}>
                        <Text style={bottomBarStyle.buttonText}>PLAY</Text>
                    </Pressable>
                    <Pressable android_ripple={rippleConfig} style={bottomBarStyle.button}>
                        <Text style={bottomBarStyle.buttonText}>ADD TO LIBRARY</Text>
                    </Pressable>
                    <Pressable android_ripple={rippleConfig} style={bottomBarStyle.button}>
                        <Text style={bottomBarStyle.buttonText}>SHARE</Text>
                    </Pressable>
                </View>
            </View>
        </View>
    )
}