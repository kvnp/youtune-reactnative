import React from "react";
import {
    View,
    Text,
    Image,
    ImageBackground,
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
        <>
            <FlatEntries entries={entries} navigation={navigation}/>

            <View style={[bottomBarStyle.centerContainer, {alignSelf: "stretch", backgroundColor: appColor.background.backgroundColor}]}>
                <View style={bottomBarStyle.topRow}>
                    <Image style={bottomBarAlbumStyle.albumCover} source={{uri: thumbnail}}/>
                    <View style={bottomBarAlbumStyle.topColumn}>
                        <Text style={bottomBarAlbumStyle.albumTitle}>{title}</Text>
                        <Text style={bottomBarAlbumStyle.albumSubtitle}>{subtitle}</Text>
                        <Text style={bottomBarAlbumStyle.albumInfo}>{secondSubtitle}</Text>
                    </View>
                    <Pressable android_ripple={rippleConfig} style={bottomBarStyle.closeButton}
                                        onPress={() => {navigation.pop()}}>
                        <MaterialIcons name="arrow-back" color="black" size={20}/>
                    </Pressable>
                </View>

                <View style={[bottomBarStyle.buttonView, {alignSelf: "center", paddingBottom: 10}]}>
                    <Pressable android_ripple={rippleConfig} style={bottomBarStyle.button}>
                        <Text style={bottomBarStyle.buttonText}>WIEDERGEBEN</Text>
                    </Pressable>
                    <Pressable android_ripple={rippleConfig} style={bottomBarStyle.button}>
                        <Text style={bottomBarStyle.buttonText}>ZUR MEDIATHEK</Text>
                    </Pressable>
                    <Pressable android_ripple={rippleConfig} style={bottomBarStyle.button}>
                        <Text style={bottomBarStyle.buttonText}>TEILEN</Text>
                    </Pressable>
                </View>
            </View>
        </>
    )
}

PlaylistView.setOptions