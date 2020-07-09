import React from "react";

import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInput
} from "react-native";
import { rippleConfig } from "../../styles/Ripple";

export default ({ callback }) => {
    let title = "";
    let description = "";
    return (
        <View style={styles.headerContainer}>
            <View style={styles.headerCenterContainer}>
                <View style={styles.headerTopRow}>
                    <View style={styles.headerTopColumn}>
                        <TextInput style={styles.inputText}
                                   onChangeText={ text => title = text }
                                   placeholder="Titel"/>

                        <TextInput style={styles.inputText}
                                   onChangeText={ text => description = text}
                                   placeholder="Beschreibung"/>
                    </View>
                </View>

                <View style={styles.headerButtonView}>
                    <Pressable android_ripple={rippleConfig} style={styles.headerButton}
                                      onPress={() => callback() }>
                        <Text style={styles.headerButtonText}>ABBRECHEN</Text>
                    </Pressable>
                    <Pressable android_ripple={rippleConfig}style={styles.headerButton}
                                      onPress={() =>  {
                                            if (title.length > 0 && description.length > 0) {
                                                callback({title: title, description: description});
                                            }
                                      }}>
                        <Text style={styles.headerButtonText}>SPEICHERN</Text>
                    </Pressable>
                </View>
            </View>
        </View>
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
        paddingTop: 20,
        paddingBottom: 20,
        marginLeft: 20,
        marginRight: 20,
    },

    headerCenterContainer: {
        alignSelf: 'center',
    },

    inputText: {
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
    }
});

/*
"Man hilft immer zwei", Elias Koné - 14. Juni 2020
*/