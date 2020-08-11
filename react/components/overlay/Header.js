import React, { PureComponent } from 'react';

import {
    ImageBackground,
    Text,
    Pressable,
} from "react-native";

import LinearGradient from 'react-native-linear-gradient';
import { headerStyle, gradientColors } from '../../styles/App';

export default class Header extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            title: "Home",
            source: null
        }

        global.setHeader = ({title, image}) => {
            let state = {};
            if (image != undefined)
                state.source = {uri: image};

            if (title != undefined)
                state.title = title;

            this.setState(state);
        }
    }

    render() {
        return (
            <ImageBackground imageStyle={null}
                             style={[headerStyle.container, headerStyle.headerHeight, this.props.style]}
                             source={this.state.source}>
                <LinearGradient style={[headerStyle.gradient, this.state.source == null ?headerStyle.image :headerStyle.imageFound]}
                                colors={gradientColors}>
                    <Pressable onPress={this.props.onPress}>             
                        <Text style={headerStyle.text}>
                            {this.state.title}
                        </Text>
                    </Pressable>
                </LinearGradient>
            </ImageBackground>
        )
    }
}