import React, { PureComponent } from 'react';

import {
    ImageBackground,
    Text,
    StyleSheet
} from "react-native";

import LinearGradient from 'react-native-linear-gradient';

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
            <ImageBackground imageStyle={styles.imageStyle}
                             style={[styles.containerStyle, this.props.style]}
                             source={this.state.source}>
                <LinearGradient style={[styles.linearGradient, styles.imageStyle]}
                                colors={["#7f9f9f9f", "#ffffff00"]}>
                                    
                    <Text style={[{color: this.state.headerColor}, styles.textStyle]}>
                        {this.props.text}
                    </Text>
                </LinearGradient>
            </ImageBackground>
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