import React, {PureComponent} from 'react';

import {
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    View
} from "react-native";

import { fetchBrowse } from '../../modules/API';

export default class Playlist extends PureComponent {
    constructor(props) {
        super(props);
        this.playlist = this.props.playlist;
        this.browse = null;
    }

    viewPlaylist = () => {
        if (this.browse == null) fetchBrowse(this.playlist.browseId).then((result) => {
            this.browse = result;
            this.props.navigation.navigate("Playlist", result);
        });

        else this.props.navigation.navigate("Playlist", this.browse);
    }

    render() {
        return (
            <View style={[this.props.style, styles.playlistContainer]}>
                <TouchableOpacity onPress={() => this.viewPlaylist()}>
                    <Image style={styles.playlistCover} source={{uri: this.playlist.thumbnail}}/>
                </TouchableOpacity>

                <Text style={styles.playlistTitle}
                      numberOfLines={2}>
                    {this.playlist.title}
                </Text>

                <Text style={styles.playlistDesc}
                      numberOfLines={2}>
                    {this.playlist.subtitle}
                </Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imageStyle: {
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        backgroundColor: 'transparent'
    },

    linearGradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    containerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        marginBottom: -20,
        zIndex: 1
    },

    textStyle: {
        fontSize: 45,
        fontWeight: 'bold'
    },

    playlistContainer: {
        height: 230,
        width: 150,
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
        fontSize: 14,
        fontWeight:'bold'
    },

    playlistDesc: {
        fontSize: 14,
    },

    titleView: {
        paddingTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    titleCover: {
        width: 50,
        height: 50,
        backgroundColor: 'gray'
    },

    titleTextCollection: {
        width: '60%'
    },

    titleTitle: {
        fontWeight: 'bold'
    }
});