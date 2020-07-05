import React, { PureComponent } from "react";
import {
    ScrollView,
    StyleSheet,
    View,
    Text,
    TouchableOpacity
} from "react-native";

import {
    Playlist
} from '../../components/SharedComponents';

export default class Playlists extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            playlists: []
        }

        global.createPlaylist = (title, subtitle) => {
            this.createPlaylist(title, subtitle);
        }
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            global.setLibraryNavigator(0);
        });
    }
    
    componentWillUnmount() {
        this._unsubscribe();
    }

    openCreatePlaylist = () => {
        this.props.navigation.navigate("CreatePlaylist");
    }

    createPlaylist = (title, description) => {
        let temp = this.state.playlists;
        temp.push({title: title, subtitle: description});

        this.setState({playlists: temp});
        this.forceUpdate();
    }

    getPlaylist = (playlistJson) => {
        return (
            <View style={styles.playlist}>
                <Playlist playlist={playlistJson} navigation={this.props.navigation}/>
            </View>
        );
    }

    getPlaylists = () => {
        return this.state.playlists.map(this.getPlaylist);
    }

    getAddPlaylist = () => {
        return (
            <View style={styles.playlist}>
                <TouchableOpacity onPress={() => {this.openCreatePlaylist()}}
                                  style={styles.playlistCover}>
                    <Text style={styles.newPlaylist}>+</Text>
                </TouchableOpacity>
                <Text style={styles.playlistTitle}>Neue Playlist</Text>
            </View>
        );
    }

    render() {
        return (
            <ScrollView style={styles.playlistCollection} contentContainerStyle={styles.playlistCollectionContainer}>
                {this.getAddPlaylist()}
                {this.getPlaylists()}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
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
        borderBottomColor: 'gray',
    },

    playlistCollection: {
        width: '100%'
    },

    playlistCollectionContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap-reverse'
    },

    playlist: {
        alignItems: 'center',
        marginTop: 140,
        marginLeft: 30,
        marginRight: 30,
        width: 100,
        height: 100
    },

    playlistCover: {
        alignItems:'center',
        justifyContent:'center',
        height: 150,
        width: 150,
        backgroundColor: 'gray'
    },

    playlistTitle: {
        paddingTop: 5,
        fontSize: 15,
        fontWeight:'bold',
        width: '150%',
    },

    playlistDesc: {
        fontSize: 10,
    },

    newPlaylist: {
        color: 'white',
        fontSize: 80,
    },

    addPlaylist: {

    }
});