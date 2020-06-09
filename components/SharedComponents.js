import React, {Component} from 'react';

import {
    ImageBackground,
    Text
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
                <ImageBackground imageStyle={{borderBottomLeftRadius:25, borderBottomRightRadius: 25}} style={{flex: 1, resizeMode: 'cover', alignItems: 'center', justifyContent: 'center'}}
                                 source={this.fetchImage(this.props.sourcee)} >
                    <Text style={{color: this.props.color, fontSize: 45, fontWeight: 'bold'}}>{this.props.text}</Text>
                </ImageBackground>
            </>
        )
    }
}