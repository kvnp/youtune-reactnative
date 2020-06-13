import React, {Component} from 'react';

import {
    ImageBackground,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    View
} from "react-native";
import { Colors } from 'react-native/Libraries/NewAppScreen';

export class Header extends Component {
    fetchImage = (data) => {
        if (typeof data == "string") {
            if (data != "") return {uri: data};
            else            return require("../assets/img/header.jpg");

        } else return require("../assets/img/header.jpg");
    }

    render() {
        return (
            <>
                <ImageBackground imageStyle={styles.imageStyle} style={styles.containerStyle}
                                 source={this.fetchImage(this.props.header.source)} >
                    <Text style={[{color: this.props.header.headerColor}, styles.textStyle]}>{this.props.text}</Text>
                </ImageBackground>
            </>
        )
    }
}

export class Playlist extends Component {
    focusPlaylist = (json) => {
        this.props.navigation.navigate("Playlist", json);
    }

    render() {
        /*let imageSource
        if (this.props.playlist.thumbnail.includes("http")) {
            imageSource = {uri: this.props.playlist.thumbnail}
        }*/

        return (
            <View style={styles.playlist}>
                <TouchableOpacity onPress={() => this.focusPlaylist(this.props.playlist)}>
                    <Image style={styles.playlistCover} source={{uri: this.props.playlist.thumbnail}}/>
                </TouchableOpacity>
                <Text style={styles.playlistTitle}>{this.props.playlist.title}</Text>
                <Text style={styles.playlistDesc}>{this.props.playlist.subtitle}</Text>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    imageStyle: {
        borderBottomLeftRadius:25,
        borderBottomRightRadius: 25
    },

    containerStyle: {
        flex: 1,
        resizeMode: 'cover',
        alignItems: 'center',
        justifyContent: 'center'
    },

    textStyle: {
        fontSize: 45,
        fontWeight: 'bold'
    },


    playlist: {
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
});