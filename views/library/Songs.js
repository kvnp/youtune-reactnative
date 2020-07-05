import React, { PureComponent } from "react";
import {
    ScrollView,
    StyleSheet,
    Text,
} from "react-native";

export default class Songs extends PureComponent {
    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            global.setLibraryNavigator(2);
        });
    }
    
    componentWillUnmount() {
        this._unsubscribe();
    }

    render() {
        return (
            <ScrollView style={styles.playlistCollection} contentContainerStyle={styles.playlistCollectionContainer}>
                <Text style={{paddingBottom: 50}}>Songs</Text>
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    playlistCollection: {
        width: '100%'
    },

    playlistCollectionContainer: {
        flexGrow: 1,
        justifyContent: 'center',
        flexDirection: 'row',
        flexWrap: 'wrap-reverse'
    },
});