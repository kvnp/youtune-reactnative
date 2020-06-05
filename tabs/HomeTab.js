import React, {Component} from 'react';

import {
    View,
    Dimensions,
    Text,
    StyleSheet
} from 'react-native';

import {
    Header
} from '../components/SearchComponents.js';
import { Colors } from 'react-native/Libraries/NewAppScreen';
import { ScrollView } from 'react-native-gesture-handler';

export default class SearchTab extends Component {
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
                    <Header style={{borderRadius: 100}} text={"Home"}/>
                </View>

                <View style={styles.middleView}>
                    <ScrollView style={styles.homeView}>
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
                    </ScrollView>
                </View>

                <View style={styles.refreshButton}>
                    <Text>Aktualisieren</Text>
                </View>
            </>
        );
    }
};

const styles = StyleSheet.create({
    headerPicture: {
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 150,
        flex: 1,
        flexDirection: 'column'
    },

    middleView: {
        position: 'absolute',
        top: 150,
        width: '100%',
        height: (Dimensions.get('window').height) - 200
    },

    refreshButton: {
        position: 'absolute',
        bottom: 5,
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 5,
        paddingTop: 5,
        borderRadius: 20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white
    },

    homeView: {
        paddingBottom:0
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