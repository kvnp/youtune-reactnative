import React from "react";
import {
    View,
    ScrollView,
    Text,
    Image,
    ImageBackground,
    TouchableOpacity
} from "react-native";

import Entry from "../../components/shared/Entry";
import { bottomBarStyle, bottomBarAlbumStyle } from "../../styles/BottomBar";
import { resultHomeStyle } from "../../styles/Home";

export default function PlaylistView({ route, navigation }) {
    const { entries, title, subtitle, secondSubtitle, thumbnail} = route.params.browse;

    return (
        <>
            <ScrollView>
                <Text style={resultHomeStyle.homeText}>{title}</Text>
                {entries.map(
                    (entry) => {
                        return Entry(entry, navigation);
                    }
                )}
            </ScrollView>

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