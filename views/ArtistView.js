import { Component } from "react";
import { View, StyleSheet } from "react-native";

export default class ArtistView extends Component {
    render() {
        return (
            <View style={styles.mainView}>
                <Text>Artist</Text>
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