import React from "react";
import {
    View,
    Text,
    Image,
    ImageBackground,
    TouchableOpacity
} from "react-native";

import { bottomBarStyle, bottomBarAlbumStyle } from "../../styles/BottomBar";
import FlatEntries from "../../components/collections/FlatEntries";
import { playlistViewStyle } from "../../styles/Playlist";

export default ({ route, navigation }) => {
    const { entries, title, subtitle, secondSubtitle, thumbnail} = route.params;

    return (
        <>
            <Text style={playlistViewStyle.topText}>{title}</Text>
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
                            <Text style={[bottomBarStyle.buttonText, bottomBarStyle.closeButtonText]}>X</Text>
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