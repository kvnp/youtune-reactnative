import React, {Component} from 'react';

import {
    Text,
    StyleSheet,
    ScrollView,
    View,
    Dimensions
} from "react-native";

import { Playlist } from './SharedComponents';

export class Results extends Component {
    constructor(props){
        super(props);
    }

    openAlbum = (album) => {
        this.props.navigation.navigate("Playlist", album);
    }

    displayAlbum = (album) => {
        return (
            <View style={styles.album}>
                <Playlist playlist={album} navigation={this.props.navigation}/>
            </View>
        );
    }

    displayAlbums = (albums) => {
        return albums.map(this.displayAlbum);
    }

    displayShelf = (shelf) => {
        if (shelf.albums.length > 0) {
            return (
                <>
                    <Text style={styles.homeText}>{shelf.title}</Text>
                    <ScrollView style={styles.albumCollection} horizontal={true}>
                        {this.displayAlbums(shelf.albums)}
                    </ScrollView>
                </>
            )
        }
    }

    displayShelves = (result) => {
        return result.shelves.map(this.displayShelf);
    }

    displayHome = () => {
        if (this.props.passthroughHome == null)
            return (
                <Text style={styles.preHome}>
                    {this.props.homeIcon}
                </Text>
            )
        else 
            return (
                <View>
                    {this.displayShelves(this.props.passthroughHome)}
                </View>
            )
    }

    render() {
        return (
            <ScrollView style={{height: '100%', flex: 1, flexDirection: 'column'}} contentContainerStyle={{ alignItems: 'center' }}>
                {this.displayHome()}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    preHome: {
        fontSize: 70,
        marginTop: (Dimensions.get("screen").height / 2) - 300,
        alignSelf: 'center'
    },

    homeText: {
        fontWeight: 'bold',
        paddingLeft: 20,
        paddingTop: 15,
        fontSize: 20
    },

    albumCollection: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingBottom: 5,
        marginBottom: 35
    },

    album: {
        marginRight: 20,
        width: 100,
        height: 160
    },

    albumCover: {
        height: 100,
        width: 100,
        backgroundColor: 'gray'
    },

    albumTitle: {
        paddingTop: 5,
        fontSize: 10,
        fontWeight: 'bold'
    },

    albumDesc: {
        fontSize: 10,
    }
});