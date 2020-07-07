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

function getEntry(entry) {
    return <Entry entry={entry}/>
}

function getEntries(entries) {
    return entries.map(getEntry);
}

export function PlaylistView({ route, navigation }) {
    const browse = route.params;
    return (
        <>
            <ScrollView>
                <Text style={resultHomeStyle.homeText}>{browse.title}</Text>
                {getEntries(browse.entries)}
            </ScrollView>

            <ImageBackground style={bottomBarStyle.container}>
                <View style={bottomBarStyle.centerContainer}>
                    <View style={bottomBarStyle.topRow}>
                        <Image style={bottomBarAlbumStyle.albumCover} source={{uri: browse.thumbnail}}/>
                        <View style={bottomBarAlbumStyle.topColumn}>
                            <Text style={bottomBarAlbumStyle.albumTitle}>{browse.title}</Text>
                            <Text style={bottomBarAlbumStyle.albumSubtitle}>{browse.subtitle}</Text>
                            <Text style={bottomBarAlbumStyle.albumInfo}>{browse.secondSubtitle}</Text>
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