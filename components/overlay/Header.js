import React, { PureComponent } from 'react';

import {
    ImageBackground,
    Text,
} from "react-native";

import LinearGradient from 'react-native-linear-gradient';
import { headerStyle, gradientColors } from '../../styles/App';

export default class Header extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            title: "Home",
            image: null,
            source: null
        }

        global.setHeader = ({title, image}) => {
            if (image != this.state.image) {
                this.setState({
                    title: title,
                    source: { uri: image }
                });
            }

            if (title != undefined)
                this.setState({title: title});
        }
    }

    componentDidUpdate(previousProps) {
        if (this.props.source != undefined) {
            if (this.props.source != previousProps.source) {
                this.setImage(this.props.source);
            }
        }
    }

    render() {
        return (
            <ImageBackground imageStyle={headerStyle.image}
                             style={[headerStyle.container, this.props.style]}
                             source={this.state.source}>
                <LinearGradient style={[headerStyle.gradient, headerStyle.image]}
                                colors={gradientColors}>
                                    
                    <Text style={[{color: this.state.headerColor}, headerStyle.text]}>
                        {this.state.title}
                    </Text>
                </LinearGradient>
            </ImageBackground>
        )
    }
}