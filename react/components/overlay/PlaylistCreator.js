import React from "react";

import {
    View,
    Text,
    StyleSheet,
    Pressable,
    TextInput
} from "react-native";
import { rippleConfig } from "../../styles/Ripple";
import { useTheme } from "@react-navigation/native";

export default PlaylistCreator = ({ callback, style }) => {
    const {dark, colors} = useTheme();

    let title = "";
    let description = "";
    return (
        <View style={[style, styles.headerContainer, {backgroundColor: colors.card}]}>
            <View style={styles.headerCenterContainer}>
                <View style={styles.headerTopRow}>
                    <TextInput style={[styles.inputText, {color: colors.text}]}
                               onChangeText={ text => title = text }
                               placeholder="Title"/>

                    <TextInput style={[styles.inputText, {color: colors.text}]}
                               onChangeText={ text => description = text}
                               placeholder="Description"/>
                    
                </View>

                <View style={styles.headerButtonView}>
                    <Pressable android_ripple={rippleConfig} style={[styles.headerButton, {backgroundColor: colors.primary}]}
                                      onPress={() => callback() }>
                        <Text style={[styles.headerButtonText, {color: colors.text}]}>CANCEL</Text>
                    </Pressable>
                    <Pressable android_ripple={rippleConfig} style={[styles.headerButton, {backgroundColor: colors.primary}]}
                                      onPress={() =>  {
                                            if (title.length > 0) {
                                                callback({title: title, description: description});
                                            }
                                      }}>
                        <Text style={[styles.headerButtonText, {color: colors.text}]}>CREATE</Text>
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
        width: "100%",
        fontSize: 15
    },

    headerTopRow: {
        justifyContent: 'space-between',
        alignItems: 'center',
        flexDirection: 'column',
        width: 200,
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
        borderRadius: 5
    },

    headerButtonText: {
        fontWeight: 'bold',
        paddingHorizontal: 10,
        paddingVertical: 2,
        borderRadius: 20
    },

    closeButtonText: {
        fontSize: 15,
    }
});

/*
"Man hilft immer zwei", Elias Koné - 14. Juni 2020
*/