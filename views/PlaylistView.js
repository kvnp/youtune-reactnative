import { Component } from "react";
import { View, StyleSheet } from "react-native";

export default class PlaylistView extends Component {
    render() {
        return (
            <View style={styles.mainView}>
                <Text>Playlist</Text>
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