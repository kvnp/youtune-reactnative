import React from "react";
import {
    View,
    ScrollView,
    Text,
    Image,
    StyleSheet,
    ImageBackground,
    TouchableOpacity
} from "react-native";

import Song from "../../components/shared/Song";

function getEntry(song) {
    return <Song song={song}/>
}

function getEntries(songs) {
    return songs.map(getEntry);
}

export function PlaylistView({ route, navigation }) {
    const browse = route.params;
    return (
        <>
            <ScrollView style={styles.playlistContent}>
                <View style={styles.topicView}>
                    <Text style={styles.topicTitle}>{browse.title}</Text>
                    {getEntries(browse.songs)}
                </View>
            </ScrollView>

            <ImageBackground style={styles.headerContainer}>
                <View style={styles.headerCenterContainer}>
                    <View style={styles.headerTopRow}>
                        <Image style={styles.albumCover} source={{uri: browse.thumbnail}}/>
                        <View style={styles.headerTopColumn}>
                            <Text style={styles.albumTitle}>{browse.title}</Text>
                            <Text style={styles.albumSubTitle}>{browse.subtitle}</Text>
                            <Text style={styles.albumInfo}>{browse.secondSubtitle}</Text>
                        </View>
                        <TouchableOpacity style={styles.closeButton}
                                          onPress={() => {navigation.pop()}}>
                            <Text style={[styles.headerButtonText, styles.closeButtonText]}>X</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.headerButtonView}>
                        <TouchableOpacity style={styles.headerButton}>
                            <Text style={styles.headerButtonText}>WIEDERGEBEN</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerButton}>
                            <Text style={styles.headerButtonText}>ZUR MEDIATHEK</Text>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.headerButton}>
                            <Text style={styles.headerButtonText}>TEILEN</Text>
                        </TouchableOpacity>
                    </View>
                </View>
            </ImageBackground>
        </>
    )
}

const styles = StyleSheet.create({
    headerContainer: {
        backgroundColor: 'gray',
        width: '100%',
        height: 130,
        alignSelf: 'flex-end',
        justifyContent: 'space-around',
    },

    headerCenterContainer: {
        alignSelf: 'center',
    },

    headerTopRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'row',

        paddingRight: 5,
        paddingLeft: 5
    },

    albumCover: {
        backgroundColor: 'darkgray',
        height: 70,
        width: 70,
        marginRight: 30,
    },

    closeButton: {
        backgroundColor: 'white',
        paddingTop: 10,
        paddingBottom: 10,
        paddingLeft: 15,
        paddingRight: 15,
        borderRadius: 25,

        alignSelf: 'center',
    },

    headerButtonView: {
        paddingTop: 10,
        flexDirection: 'row',
        alignSelf: 'center'
    },

    headerButton : {
        marginRight: 5,
        marginLeft: 5,
        paddingLeft: 13,
        paddingRight: 13,
        paddingTop: 2,
        paddingBottom: 2,
        backgroundColor: 'white',
        borderRadius: 5
    },

    headerButtonText: {
        fontWeight: 'bold'
    },

    closeButtonText: {
        fontSize: 15,
    },

    topicView: {
        padding: 25
    },

    topicTitle: {
        fontWeight: 'bold',
        fontSize: 30
    }
});