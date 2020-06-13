import React, {Component} from 'react';

import {
    ImageBackground,
    Text,
    StyleSheet
} from "react-native";

export class Header extends Component {
    fetchImage = (data) => {
        if (typeof data == "string") {
            if (data != "") return {uri: data};
            else            return require("../assets/img/header.jpg");

        } else return require("../assets/img/header.jpg");
    }

    render() {
        return (
            <>
                <ImageBackground imageStyle={styles.imageStyle} style={styles.containerStyle}
                                 source={this.fetchImage(this.props.sourcee)} >
                    <Text style={[{color: this.props.color}, styles.textStyle]}>{this.props.text}</Text>
                </ImageBackground>
            </>
        )
    }
}

const styles = StyleSheet.create({
    imageStyle: {
        borderBottomLeftRadius:25,
        borderBottomRightRadius: 25
    },

    containerStyle: {
        flex: 1,
        resizeMode: 'cover',
        alignItems: 'center',
        justifyContent: 'center'
    },

    textStyle: {
        fontSize: 45,
        fontWeight: 'bold'
    },
});