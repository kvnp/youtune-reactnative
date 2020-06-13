import React from "react";

import {
    View,
    Text,
    StatusBar,
    StyleSheet,
    ImageBackground,
    TouchableOpacity
} from "react-native";
import { TextInput } from "react-native-gesture-handler";

export function CreatePlaylistView({ route, navigation }) {
    StatusBar.setBarStyle('dark-content', true);

    let title = "";
    let description = "";
    return (
        <>
        <View style={styles.paddingView}>
            <Text style={styles.topText}>Playlist erstellen</Text>
        </View>
        <ImageBackground style={styles.headerContainer}>
            <View style={styles.headerCenterContainer}>
                <View style={styles.headerTopRow}>
                    <View style={styles.headerTopColumn}>
                        <TextInput style={styles.inputText}
                                   onChangeText={ text => title = text }
                                   placeholderTextColor='white'
                                   placeholder="Titel"/>

                        <TextInput style={styles.inputText}
                                   onChangeText={ text => description = text}
                                   placeholderTextColor='white'
                                   placeholder="Beschreibung"/>
                    </View>
                    <TouchableOpacity style={styles.closeButton}
                                      onPress={() => {navigation.pop()}}>
                        <Text style={[styles.headerButtonText, styles.closeButtonText]}>X</Text>
                    </TouchableOpacity>
                </View>

                <View style={styles.headerButtonView}>
                    <TouchableOpacity style={styles.headerButton}
                                      onPress={() => {navigation.pop()}}>
                        <Text style={styles.headerButtonText}>ABBRECHEN</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.headerButton}
                                      onPress={() =>  {
                                          if (title.length > 0 && description.length > 0) {
                                            navigation.goBack();
                                            route.params.onGoBack(title, description);
                                          }
                                      }}>
                        <Text style={styles.headerButtonText}>SPEICHERN</Text>
                    </TouchableOpacity>
                </View>
            </View>
        </ImageBackground>
        </>
    )
}

const styles = StyleSheet.create({
    paddingView: {
        flexGrow: 1,
    },

    topText: {
        padding: 50,
        fontSize: 35,
        fontWeight: 'bold',
    },

    headerContainer: {
        backgroundColor: 'gray',
        width: '100%',
        height: 150,
        justifyContent: 'space-around',
        paddingBottom: 20
    },

    headerCenterContainer: {
        alignSelf: 'center',
    },

    inputText: {
        color: 'white',
        textAlign: 'justify',
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
    }
});


/*
"Man hilft immer zwei", Elias Koné - 14. Juni 2020
*/