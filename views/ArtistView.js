import React from "react";
import {
    View,
    ScrollView,
    Text,
    StatusBar,
    StyleSheet,
    ImageBackground,
    TouchableOpacity,
    Image
} from "react-native";

import { Playlist } from "../components/SharedComponents";

export function ArtistView({ route, navigation }) {
    StatusBar.setBarStyle('dark-content', true);
    return (
        <>
            <ScrollView>
                <View style={styles.afterView}>
                    <View style={styles.topicView}>
                        <View style={styles.topicTextCollection}>
                            <Text style={styles.topicText}>Info</Text>
                            <Text style={styles.topicSubText}>3.733.974 Aufrufe</Text>
                        </View>
                        <View style={styles.infoView}>
                            <Text>
                                Tristam ist ein kanadischer Musikproduzent, der mit den Liedern Follow Me und Flight größere Bekanntheit erlangte. Seine Lieder, welche durch das Netlabel Monstercat veröffentlicht werden, sind in den Musikrichtungen Dubstep, Electronic, Glitch Hop, und Drumstep anzusiedeln. Er tauchte erstmals auf dem Album Monstercat 004 . Identity mit dem Song Party For The Living auf.
                            </Text>
                        </View>
                    </View>

                    <View style={styles.topicView}>
                        <View style={styles.topicTextCollection}>
                            <Text style={styles.topicText}>Musiktitel</Text>
                        </View>
                        <TouchableOpacity style={styles.musicView}>
                            <TouchableOpacity>
                                <Image style={styles.musicCover}/>
                            </TouchableOpacity>
                            <View style={styles.titleTextCollection}>
                                <Text style={styles.titleText}>Follow Me</Text>
                                <Text style={styles.titleSubText}>Tristam - Monstercat 005 - Evolution</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.musicView}>
                            <TouchableOpacity>
                                <Image style={styles.musicCover}/>
                            </TouchableOpacity>
                            <View style={styles.titleTextCollection}>
                                <Text style={styles.titleText}>Till It's Over</Text>
                                <Text style={styles.titleSubText}>Tristam - Till It's Over</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.musicView}>
                            <TouchableOpacity>
                                <Image style={styles.musicCover}/>
                            </TouchableOpacity>
                            <View style={styles.titleTextCollection}>
                                <Text style={styles.titleText}>Frame Of Mind</Text>
                                <Text style={styles.titleSubText}>Tristam - Frame Of Mind</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.musicView}>
                            <TouchableOpacity>
                                <Image style={styles.musicCover}/>
                            </TouchableOpacity>
                            <View style={styles.titleTextCollection}>
                                <Text style={styles.titleText}>Flight</Text>
                                <Text style={styles.titleSubText}>Tristam - Flight</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.musicView}>
                            <TouchableOpacity>
                                <Image style={styles.musicCover}/>
                            </TouchableOpacity>
                            <View style={styles.titleTextCollection}>
                                <Text numberOfLines={1} style={styles.titleText}>Razor Sharp</Text>
                                <Text numberOfLines={1} style={styles.titleSubText}>Pegboard Nerds und Tristam - Monstercat (3 Year Anniversary)</Text>
                            </View>
                        </TouchableOpacity>
                        <TouchableOpacity style={styles.allTitlesButton}>
                            <Text style={styles.allTitlesButtonText}>ALLE ANSEHEN</Text>
                        </TouchableOpacity>

                        <View style={styles.topicView}>
                            <View style={styles.topicTextCollection}>
                                <Text style={styles.topicText}>Alben</Text>
                            </View>
                            <ScrollView horizontal={true} style={styles.playlistCollection} contentContainerStyle={styles.playlistCollectionContainer}>
                                <View style={styles.playlistContainer}>
                                    <Playlist  navigation={navigation} playlist={{title: "Colors", subtitle: "EP - 2017"}}/>
                                </View>

                                <View style={styles.playlistContainer}>
                                    <Playlist  navigation={navigation} playlist={{title: "Starting Over", subtitle: "Album - 2017"}}/>
                                </View>

                                <View style={styles.playlistContainer}>
                                    <Playlist  navigation={navigation} playlist={{title: "Starting Over", subtitle: "Album - 2017"}}/>
                                </View>

                                <View style={styles.playlistContainer}>
                                    <Playlist  navigation={navigation} playlist={{title: "Starting Over", subtitle: "Album - 2017"}}/>
                                </View>

                                <View style={styles.playlistContainer}>
                                    <Playlist  navigation={navigation} playlist={{title: "Starting Over", subtitle: "Album - 2017"}}/>
                                </View>

                                <View style={styles.playlistContainer}>
                                    <Playlist  navigation={navigation} playlist={{title: "Starting Over", subtitle: "Album - 2017"}}/>
                                </View>
                            </ScrollView>

                            <View style={styles.topicView}>
                                <View style={styles.topicTextCollection}>
                                    <Text style={styles.topicText}>Videos</Text>
                                </View>
                                <ScrollView horizontal={true} style={styles.playlistCollection} contentContainerStyle={styles.playlistCollectionContainer}>
                                    <View style={styles.playlistContainer}>
                                        <Playlist navigation={navigation} playlist={{title: "Colors", subtitle: "EP - 2017"}}/>
                                    </View>

                                    <View style={styles.playlistContainer}>
                                        <Playlist navigation={navigation} playlist={{title: "Starting Over", subtitle: "Album - 2017"}}/>
                                    </View>

                                    <View style={styles.playlistContainer}>
                                        <Playlist navigation={navigation} playlist={{title: "Starting Over", subtitle: "Album - 2017"}}/>
                                    </View>

                                    <View style={styles.playlistContainer}>
                                        <Playlist navigation={navigation} playlist={{title: "Starting Over", subtitle: "Album - 2017"}}/>
                                    </View>

                                    <View style={styles.playlistContainer}>
                                        <Playlist navigation={navigation} playlist={{title: "Starting Over", subtitle: "Album - 2017"}}/>
                                    </View>

                                    <View style={styles.playlistContainer}>
                                        <Playlist navigation={navigation} playlist={{title: "Starting Over", subtitle: "Album - 2017"}}/>
                                    </View>
                                </ScrollView>
                            </View>


                            <View style={styles.topicView}>
                                <View style={styles.topicTextCollection}>
                                    <Text style={styles.topicText}>Das könnte Fans auch gefallen</Text>
                                </View>
                                <ScrollView horizontal={true} style={styles.playlistCollection} contentContainerStyle={styles.playlistCollectionContainer}>
                                    <View style={styles.playlistContainer}>
                                        <Playlist navigation={navigation} playlist={{title: "Colors", subtitle: "EP - 2017"}}/>
                                    </View>

                                    <View style={styles.playlistContainer}>
                                        <Playlist navigation={navigation} playlist={{title: "Starting Over", subtitle: "Album - 2017"}}/>
                                    </View>

                                    <View style={styles.playlistContainer}>
                                        <Playlist navigation={navigation} playlist={{title: "Starting Over", subtitle: "Album - 2017"}}/>
                                    </View>

                                    <View style={styles.playlistContainer}>
                                        <Playlist navigation={navigation} playlist={{title: "Starting Over", subtitle: "Album - 2017"}}/>
                                    </View>

                                    <View style={styles.playlistContainer}>
                                        <Playlist navigation={navigation} playlist={{title: "Starting Over", subtitle: "Album - 2017"}}/>
                                    </View>

                                    <View style={styles.playlistContainer}>
                                        <Playlist navigation={navigation} playlist={{title: "Starting Over", subtitle: "Album - 2017"}}/>
                                    </View>
                                </ScrollView>
                            </View>
                        </View>
                    </View>
                </View>
            </ScrollView>
            <ImageBackground style={styles.headerContainer}>
                <View style={styles.headerCenterContainer}>
                    <View style={styles.headerTopRow}>
                        <View style={styles.headerTopLeftPadding}/>
                        <View style={styles.headerArtistColumn}>
                            <Text style={styles.artistName}>Tristam</Text>
                            <TouchableOpacity>
                                <Text style={styles.subscribeArtist}>ABONNIEREN 271.000</Text>
                            </TouchableOpacity>
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
    mainView: {
        height: '100%',
        alignSelf: 'center',
        justifyContent: 'center'
    },

    headerPicture: {
        backgroundColor: 'gray',
        width: '100%',
        height: 120,
        justifyContent: 'center',
        alignItems: 'flex-end',
        paddingRight: '10%',
    },

    headerTopRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingTop: 10,
        paddingLeft: 5,
        paddingRight: 5,
    },

    headerTopLeftPadding: {
        flexGrow: 1
    },

    headerArtistColumn: {
        paddingRight: 40,
        alignSelf: 'flex-end',
        alignItems: 'flex-end',
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

    closeButtonText: {
        fontSize: 15,
    },

    artistName: {
        color: 'white',
        fontWeight: 'bold',
        fontSize: 25
    },

    subscribeArtist: {
        alignSelf: 'baseline',
        backgroundColor: 'red',
        fontWeight: 'bold',
        marginTop: 5,
        paddingRight: 5,
        paddingLeft: 5,
        borderRadius: 5,
    },

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

    headerButtonView: {
        paddingTop: 10,
        flexDirection: 'row',
        alignSelf: 'flex-start'
    },

    headerButton : {
        marginRight: 10,
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

    afterView: {
        paddingLeft: 25,
        paddingRight: 35,
    },

    topicView: {
        paddingTop: 20,
    },

    topicTextCollection: {
        paddingBottom: 10,
    },

    topicText: {
        fontWeight: 'bold',
        fontSize: 20,
        paddingRight: 20,
    },

    musicView: {
        flexDirection: 'row',
    },

    musicCover: {
        backgroundColor: 'gray',
        width: 40,
        height: 40,
        marginRight: 15,
        marginBottom: 10,
    },

    titleTextCollection: {
        paddingRight: 80,
    },

    titleText: {

    },

    titleSubText: {

    },

    allTitlesButton: {
        backgroundColor: 'gray',
        alignSelf: 'baseline',
        marginTop: 10,
        paddingRight: 10,
        paddingLeft: 10,
        borderRadius: 5
    },

    allTitlesButtonText: {
        color: 'white',
    },

    playlistCollection: {
        width: '100%',
    },

    playlistCollectionContainer: {
        flexDirection: 'row'
    },

    playlistContainer: {
        paddingRight: 5,
    }
});