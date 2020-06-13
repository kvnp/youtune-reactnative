import React, {Component} from 'react';

import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Image
} from 'react-native';

import {
    Header
} from '../components/SharedComponents';

import { Colors } from 'react-native/Libraries/NewAppScreen';
import { ScrollView } from 'react-native-gesture-handler';

export default class LibraryTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            selection: 0,
            playlists: [],
            albums: [],
            songs: [],
            artists: [],
            subscriptions: []
        }
    }

    getStyle = (value) => {
        if (value == this.state.selection)
            return styles.headerEntryFocus;
        else
            return styles.headerEntry;
    }

    getTextStyle = (value) => {
        if (value == this.state.selection)
            return styles.headerEntryTextFocus;
        else
            return styles.headerEntryText;
    }

    getAddPlaylist = () => {
        return (
            <View style={styles.playlist}>
                <TouchableOpacity onPress={() => {this.createPlaylist()}} style={styles.playlistCover}>
                    <Text style={styles.newPlaylist}>+</Text>
                </TouchableOpacity>
                <Text style={styles.playlistTitle}>Neue Playlist</Text>
                <Text style={styles.playlistDesc}></Text>
            </View>
        );
    }

    createPlaylist = () => {
        let temp = this.state.playlists;
        temp.push({title: "Neue Playlist " + (this.state.playlists.length + 1), subtitle: "Du • 0 songs"});

        this.setState({playlists: temp});
    }

    focusPlaylist = (json) => {
        global.playlist = json;
        this.props.navigation.navigate("Playlist");
    }

    getPlaylist = (playlistJson) => {
        return (
            <View style={styles.playlist}>
                <TouchableOpacity onPress={() => this.focusPlaylist(playlistJson)}>
                    <Image style={styles.playlistCover}>{playlistJson.cover}</Image>
                </TouchableOpacity>
                <Text style={styles.playlistTitle}>{playlistJson.title}</Text>
                <Text style={styles.playlistDesc}>{playlistJson.subtitle}</Text>
            </View>
        );
    }

    getPlaylists = () => {
        return this.state.playlists.map(this.getPlaylist);
    }

    render() {
        return (
            <>
                <View style={styles.headerPicture}>
                    <Header text={"Bibliothek"}
                            color={this.props.passBackground.headerColor} sourcee={this.props.passBackground.source}/>
                </View>
            
                <View style={styles.middleView}>
                    <ScrollView style={styles.playlistCollection} contentContainerStyle={styles.playlistCollectionContainer}>
                        {this.getUpdatedView()}
                    </ScrollView>
                </View>

                <ScrollView style={styles.header} horizontal={true}>
                    <TouchableOpacity onPress={() => {this.update(0)}} style={this.getStyle(0)}>
                        <Text style={this.getTextStyle(0)}>PLAYLISTS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {this.update(1)}} style={this.getStyle(1)}>
                        <Text style={this.getTextStyle(1)}>ALBUMS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {this.update(2)}} style={this.getStyle(2)}>
                        <Text style={this.getTextStyle(2)}>SONGS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {this.update(3)}} style={this.getStyle(3)}>
                        <Text style={this.getTextStyle(3)}>ARTISTS</Text>
                    </TouchableOpacity>

                    <TouchableOpacity onPress={() => {this.update(4)}} style={this.getStyle(4)}>
                        <Text style={this.getTextStyle(4)}>SUBSCRIPTIONS</Text>
                    </TouchableOpacity>
                </ScrollView>
            </>
        );
    }

    update = (value) => this.setState({selection: value});

    getUpdatedView = () => {
        switch (this.state.selection) {
            case 0: return this.getPlaylistView();
            case 1: return <Text>Alben</Text>;
            case 2: return <Text>Songs</Text>;
            case 3: return <Text>Künstler</Text>;
            case 4: return <Text>Abos</Text>;
        }
    }

    getPlaylistView = () => {
        return (
            <>
                {this.getAddPlaylist()}
                {this.getPlaylists()}
            </>
        );
    }
};

const styles = StyleSheet.create({
    headerPicture: {
        width: '100%',
        height: 150,
    },

    middleView: {
        width: '100%',
        marginBottom: 190
    },

    header: {
        alignSelf: 'center',
        width: '100%',
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
        justifyContent: 'center'
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

    playlistCollection: {
        width: '100%',
        paddingTop: 20
    },

    playlistCollectionContainer: {
        justifyContent: 'center',
        flexDirection: 'row',
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