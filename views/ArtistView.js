import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export default class ArtistView extends Component {
    render() {
        global.noTabBar = true;
        return (
            <View style={styles.mainView}>
                <Text>Artist</Text>
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