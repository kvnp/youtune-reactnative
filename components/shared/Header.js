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
            source: null
        }
    }

    componentDidUpdate(previousProps) {
        if (this.props.source != undefined) {
            if (this.props.source != previousProps.source) {
                this.setImage(this.props.source);
            }
        }
    }

    setImage = (url) => {
        if (url == null) {
            this.setState({source: null});
        } else {
            if (typeof url == "string")
                this.setState({source: {uri: url}});
            else if (typeof url == "number")
                this.setState({source: url});
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
                        {this.props.text}
                    </Text>
                </LinearGradient>
            </ImageBackground>
        )
    }
}