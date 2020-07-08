import React from "react";
import { View, Text, StatusBar, StyleSheet } from "react-native";

export default function PlayView({route, navigation}) {
    StatusBar.setBarStyle('dark-content', true);
    return (
        <View style={styles.mainView}>
            <Text>Play</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    mainView: {
        height: '100%',
        alignSelf: 'center',
        justifyContent: 'center'
    }
});