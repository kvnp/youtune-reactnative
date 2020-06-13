import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export default class PlaylistView extends Component {
    render() {
        global.noTabBar = true;
        return (
            <View style={styles.mainView}>
                <Text>{global.playlist.title}</Text>
                <Text>{global.playlist.subtitle}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainView: {
        height: '100%',
        alignSelf: 'center',
        justifyContent: 'center'
    }
});