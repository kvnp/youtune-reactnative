import React, {PureComponent} from 'react';

import {
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    View
} from "react-native";

export class Song extends PureComponent {
    constructor(props) {
        super(props);
        this.song = this.props.song;
    }

    render() {
        return (
            <TouchableOpacity style={styles.titleView}>
                <Image style={styles.titleCover} source={{uri: this.song.thumbnail}}/>
                <View style={styles.titleTextCollection}>
                    <Text numberOfLines={1} style={styles.titleTitle}>
                        {this.song.title}
                    </Text>
                    <Text numberOfLines={1} style={styles.titleSubTitle}>
                        {this.song.subtitle}
                    </Text>
                </View>
                <Text style={styles.titleTimeText}>
                    {this.song.length}
                </Text>
            </TouchableOpacity>
        )
    }
}

const styles = StyleSheet.create({
    imageStyle: {
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        backgroundColor: 'transparent'
    },

    linearGradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    containerStyle: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        marginBottom: -20,
        zIndex: 1
    },

    textStyle: {
        fontSize: 45,
        fontWeight: 'bold'
    },

    playlistContainer: {
        height: 230,
        width: 150,
    },

    playlistCover: {
        alignItems:'center',
        justifyContent:'center',
        height: 150,
        width: 150,
        backgroundColor: 'gray'
    },

    playlistTitle: {
        paddingTop: 5,
        fontSize: 14,
        fontWeight:'bold'
    },

    playlistDesc: {
        fontSize: 14,
    },

    titleView: {
        paddingTop: 5,
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-around',
    },

    titleCover: {
        width: 50,
        height: 50,
        backgroundColor: 'gray'
    },

    titleTextCollection: {
        width: '60%'
    },

    titleTitle: {
        fontWeight: 'bold'
    }
});