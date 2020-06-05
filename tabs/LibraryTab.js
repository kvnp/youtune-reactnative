import React, {Component} from 'react';

import {
    View,
    Text,
    StyleSheet
} from 'react-native';

import {
    Header
} from '../components/SearchComponents.js';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { ScrollView } from 'react-native-gesture-handler';

export default class LibraryTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: null
        };
    }

    resultReceiver = (childData) => {
        this.setState({results: childData});
    };

    render() {
        return (
            <>
                <View style={styles.headerPicture}>
                    <Header style={{borderRadius: 100}} text={"Bibliothek"}/>
                </View>
            
                <View style={styles.middleView}>
                    <ScrollView style={styles.playlistsView}>
                        <ScrollView style={styles.playlistCollection} contentContainerStyle={styles.playlistCollectionContainer}>
                            <View style={styles.playlist}>
                                <View style={styles.playlistCover}>
                                    <Text style={styles.newPlaylist}>+</Text>
                                </View>
                                <Text style={styles.playlistTitle}>Neue Playlist</Text>
                                <Text style={styles.playlistDesc}></Text>
                            </View>

                            <View style={styles.playlist}>
                                <View style={styles.playlistCover}></View>
                                <Text style={styles.playlistTitle}>Meine Playlist 1</Text>
                                <Text style={styles.playlistDesc}>Kevin • 1 song</Text>
                            </View>

                            <View style={styles.playlist}>
                                <View style={styles.playlistCover}></View>
                                <Text style={styles.playlistTitle}>Meine Playlist 2</Text>
                                <Text style={styles.playlistDesc}>Kevin • 6 songs</Text>
                            </View>

                            <View style={styles.playlist}>
                                <View style={styles.playlistCover}></View>
                                <Text style={styles.playlistTitle}>Meine Playlist 3</Text>
                                <Text style={styles.playlistDesc}>Kevin • 20 songs</Text>
                            </View>

                            <View style={styles.playlist}>
                                <View style={styles.playlistCover}></View>
                                <Text style={styles.playlistTitle}>Meine Playlist 4</Text>
                                <Text style={styles.playlistDesc}>Kevin • 5 songs</Text>
                            </View>
                        </ScrollView>
                    </ScrollView>
                </View>

                <ScrollView style={styles.header} horizontal={true}>
                    <View style={styles.headerEntryFocus}>
                        <Text style={styles.headerEntryTextFocus}>PLAYLISTS</Text>
                    </View>

                    <View style={styles.headerEntry}>
                        <Text style={styles.headerEntryText}>ALBUMS</Text>
                    </View>

                    <View style={styles.headerEntry}>
                        <Text style={styles.headerEntryText}>SONGS</Text>
                    </View>

                    <View style={styles.headerEntry}>
                        <Text style={styles.headerEntryText}>ARTISTS</Text>
                    </View>

                    <View style={styles.headerEntry}>
                        <Text style={styles.headerEntryText}>SUBSCRIPTIONS</Text>
                    </View>
                </ScrollView>
            </>
        );
    }
};

const styles = StyleSheet.create({
    headerPicture: {
        width: '100%',
        height: 150,
        flexDirection: 'column'
    },

    middleView: {
        alignContent:'flex-start',
        width: '100%'
    },

    header: {
        alignSelf: 'center',
        width: '98%',
        height: 50,
        position: 'absolute',
        bottom: -5
    },

    headerEntry: {
        height: 50,
        paddingRight: 15,
        paddingLeft: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerEntryFocus: {
        height: 50,
        paddingRight: 15,
        paddingLeft: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },

    headerEntryText: {
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
    },

    headerEntryTextFocus: {
        fontWeight: 'bold',
        borderBottomWidth: 3,
        borderBottomColor: Colors.dark,
    },

    playlistsView: {
        alignSelf:'center',
        alignContent:'center',
        paddingBottom: 0
    },

    playlistCollection: {
        width: '100%',
        paddingTop: 20,
        paddingLeft: 20,
        paddingBottom: 5,
        marginBottom: 35
    },

    playlistCollectionContainer: {
        flexDirection: 'row',
        flexGrow: 1,
        flexWrap: 'wrap'
    },

    playlist: {
        margin: 10,
        width: 100,
        height: 160
    },

    playlistCover: {
        alignItems:'center',
        justifyContent:'center',
        height: 100,
        width: 100,
        backgroundColor: Colors.dark
    },

    playlistTitle: {
        paddingTop: 5,
        fontSize: 10,
        fontWeight:'bold'
    },

    playlistDesc: {
        fontSize: 10,
    },

    newPlaylist: {
        color: Colors.white,
        fontSize: 50,
    }
});