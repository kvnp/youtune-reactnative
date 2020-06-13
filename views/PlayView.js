import { Component } from "react";
import { View, StyleSheet } from "react-native";

export default class PlayView extends Component {
    render() {
        return (
            <View style={styles.mainView}>
                <Text>Play</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    mainView: {
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center'
    }
});