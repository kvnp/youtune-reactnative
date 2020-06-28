import React, {Component} from 'react';

import {
    ImageBackground,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    View
} from "react-native";

import LinearGradient from 'react-native-linear-gradient';

import { fetchBrowse } from '../modules/Tube';

export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            source: require("../assets/img/header.jpg")
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
            this.setState({source: require("../assets/img/header.jpg")});
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

export class Playlist extends Component {
    constructor(props) {
        super(props);
        this.playlist = this.props.playlist;
        this.browse = null;
    }

    viewPlaylist = () => {
        if (this.browse == null) fetchBrowse(this.playlist.browseId).then((result) => {
            this.browse = result;
            this.props.navigation.navigate("Playlist", result);
        });

        else this.props.navigation.navigate("Playlist", this.browse);
    }

    render() {
        return (
            <View style={[this.props.style, styles.playlistContainer]}>
                <TouchableOpacity onPress={() => this.viewPlaylist()}>
                    <Image style={styles.playlistCover} source={{uri: this.playlist.thumbnail}}/>
                </TouchableOpacity>

                <Text style={styles.playlistTitle}
                      numberOfLines={2}>
                    {this.playlist.title}
                </Text>

                <Text style={styles.playlistDesc}
                      numberOfLines={2}>
                    {this.playlist.subtitle}
                </Text>
            </View>
        );
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
});