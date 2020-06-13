import React, { Component } from "react";
import { View, Text, StyleSheet } from "react-native";

export default class PlayView extends Component {
    render() {
        global.noTabBar = true;
        return (
            <View style={styles.mainView}>
                <Text>Play</Text>
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