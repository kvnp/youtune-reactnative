import React, {Component} from 'react';

import {
    Text,
    StyleSheet,
    ScrollView,
    View,
    Image
} from "react-native";

import { Colors } from 'react-native/Libraries/NewAppScreen';

export class Results extends Component {
    constructor(){
        super();
    }

    displayAlbum = (album) => {
        return (
            <View style={styles.album}>
                <Image style={styles.albumCover} source={{uri: album.thumbnail}}/>
                <Text style={styles.albumTitle}>{album.title}</Text>
                <Text style={styles.albumDesc}>{album.subtitle}</Text>
            </View>
        )
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
        console.log(JSON.stringify(this.props.passthroughHome));
        if (this.props.passthroughHome == null) {
            return (
                <View>
                    <Text style={styles.homeText}>New releases</Text>
                    <ScrollView style={styles.albumCollection} horizontal={true}>
                        <View style={styles.album}>
                            <View style={styles.albumCover}></View>
                            <Text style={styles.albumTitle}>New Release Mix</Text>
                            <Text style={styles.albumDesc}>Just updated!</Text>
                        </View>

                        <View style={styles.album}>
                            <View style={styles.albumCover}></View>
                            <Text style={styles.albumTitle}>Shaniwar Special Bhajans</Text>
                            <Text style={styles.albumDesc}>Single • Sonu Nigam {"&"} Poonam Lakkha</Text>
                        </View>

                        <View style={styles.album}>
                            <View style={styles.albumCover}></View>
                            <Text style={styles.albumTitle}>GOOBA</Text>
                            <Text style={styles.albumDesc}>Single • 6ix9ine</Text>
                        </View>

                        <View style={styles.album}>
                            <View style={styles.albumCover}></View>
                            <Text style={styles.albumTitle}>Jeetenge Hum</Text>
                            <Text style={styles.albumDesc}>Single • Dhvani Bhanushali</Text>
                        </View>

                        <View style={styles.album}>
                            <View style={styles.albumCover}></View>
                            <Text style={styles.albumTitle}>Chromatica</Text>
                            <Text style={styles.albumDesc}>Album • Lady Gaga</Text>
                        </View>
                    </ScrollView>

                    <Text style={styles.homeText}>Morning Preparation</Text>
                    <ScrollView style={styles.albumCollection} horizontal={true}>
                        <View style={styles.album}>
                            <View style={styles.albumCover}></View>
                            <Text style={styles.albumTitle}>Boolywood Coolers</Text>
                            <Text style={styles.albumDesc}>Playlist • YouTube Music</Text>
                        </View>

                        <View style={styles.album}>
                            <View style={styles.albumCover}></View>
                            <Text style={styles.albumTitle}>Bollywood Happy Songs</Text>
                            <Text style={styles.albumDesc}>Playlist • YouTube Music</Text>
                        </View>

                        <View style={styles.album}>
                            <View style={styles.albumCover}></View>
                            <Text style={styles.albumTitle}>Hindi Mood Elevating Mixtape</Text>
                            <Text style={styles.albumDesc}>Playlist • YouTube Music</Text>
                        </View>

                        <View style={styles.album}>
                            <View style={styles.albumCover}></View>
                            <Text style={styles.albumTitle}>Bollywood Morning Beats</Text>
                            <Text style={styles.albumDesc}>Playlist • YouTube Music</Text>
                        </View>

                        <View style={styles.album}>
                            <View style={styles.albumCover}></View>
                            <Text style={styles.albumTitle}>Life is Good: Bollywood</Text>
                            <Text style={styles.albumDesc}>Playlist • YouTube Music</Text>
                        </View>
                    </ScrollView>

                    <Text style={styles.homeText}>Charts</Text>
                    <ScrollView style={styles.albumCollection} horizontal={true}>
                        <View style={styles.album}>
                            <View style={styles.albumCover}></View>
                            <Text style={styles.albumTitle}>Top 100 Songs India</Text>
                            <Text style={styles.albumDesc}>Chart • YouTube Music</Text>
                        </View>

                        <View style={styles.album}>
                            <View style={styles.albumCover}></View>
                            <Text style={styles.albumTitle}>Top 100 Music Videos India</Text>
                            <Text style={styles.albumDesc}>Chart • YouTube Music</Text>
                        </View>

                        <View style={styles.album}>
                            <View style={styles.albumCover}></View>
                            <Text style={styles.albumTitle}>Trending 20 India</Text>
                            <Text style={styles.albumDesc}>Chart • YouTube Music</Text>
                        </View>

                        <View style={styles.album}>
                            <View style={styles.albumCover}></View>
                            <Text style={styles.albumTitle}>Top 100 Songs Global</Text>
                            <Text style={styles.albumDesc}>Chart • YouTube Music</Text>
                        </View>

                        <View style={styles.album}>
                            <View style={styles.albumCover}></View>
                            <Text style={styles.albumTitle}>Top 100 Music Videos Global</Text>
                            <Text style={styles.albumDesc}>Chart • YouTube Music</Text>
                        </View>
                    </ScrollView>
                </View>
            )
        } else {
            return (
                <View>
                    {this.displayShelves(this.props.passthroughHome)}
                </View>
            )
        }
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
        backgroundColor: Colors.dark
    },

    albumTitle: {
        paddingTop: 5,
        fontSize: 10,
        fontWeight:'bold'
    },

    albumDesc: {
        fontSize: 10,
    }
});