import React, {Component} from 'react';

import {
    ImageBackground,
    Text
} from "react-native";

import { Colors } from 'react-native/Libraries/NewAppScreen';

export class Header extends Component {
    constructor(props) {
        super(props);
    }

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
                                 source={this.fetchImage(this.props.sourcee)}>
                    <Text style={{color: Colors.white, fontSize: 45, fontWeight: 'bold'}}>{this.props.text}</Text>
                </ImageBackground>
            </>
        )
    }
}