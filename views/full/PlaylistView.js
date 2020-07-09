import React from "react";
import {
    View,
    Text,
    Image,
    ImageBackground,
    TouchableOpacity
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import {
    bottomBarStyle,
    bottomBarAlbumStyle
} from "../../styles/BottomBar";

import FlatEntries from "../../components/collections/FlatEntries";

export default ({ route, navigation }) => {
    const { entries, title, subtitle, secondSubtitle, thumbnail} = route.params;
    navigation.setOptions({ title: title });
    return (
        <>
            <FlatEntries entries={entries} navigation={navigation}/>

            <ImageBackground style={bottomBarStyle.container}>
                <View style={bottomBarStyle.centerContainer}>
                    <View style={bottomBarStyle.topRow}>
                        <Image style={bottomBarAlbumStyle.albumCover} source={{uri: thumbnail}}/>
                        <View style={bottomBarAlbumStyle.topColumn}>
                            <Text style={bottomBarAlbumStyle.albumTitle}>{title}</Text>
                            <Text style={bottomBarAlbumStyle.albumSubtitle}>{subtitle}</Text>
                            <Text style={bottomBarAlbumStyle.albumInfo}>{secondSubtitle}</Text>
                        </View>
                        <TouchableOpacity style={bottomBarStyle.closeButton}
                                          onPress={() => {navigation.pop()}}>
                            <MaterialIcons name="arrow-back" color="black" size={20}/>
                        </TouchableOpacity>
                    </View>

                    <View style={bottomBarStyle.buttonView}>
                        <TouchableOpacity style={bottomBarStyle.button}>
                            <Text style={bottomBarStyle.buttonText}>WIEDERGEBEN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={bottomBarStyle.button}>
                            <Text style={bottomBarStyle.buttonText}>ZUR MEDIATHEK</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={bottomBarStyle.button}>
                            <Text style={bottomBarStyle.buttonText}>TEILEN</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </>
    )
}