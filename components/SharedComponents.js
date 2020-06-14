import React, {Component} from 'react';

import {
    ImageBackground,
    Text,
    StyleSheet,
    Image,
    TouchableOpacity,
    View,
    StatusBar
} from "react-native";

const HeaderDb = {
    "https://lh3.googleusercontent.com/3OazqYM5TA4lMDZ0A-52-v6Zg4L-uFsAmfMp8aC-l-TUgr_UwPvayfxy_5hs5ll4B4zpj2hrG9A=w2880-h1613-l90-rj": true,
    "https://lh3.googleusercontent.com/G2nNxQ2O_svAtYlismpu0ZfNvusgKGBVpq-LI4xsHPeJELQO2_wOOu9NvOHcb9X1VvPR5_qx=w2880-h1620-l90-rj":    true,
    "https://lh3.googleusercontent.com/zG2J10I50KGW5v6bk9nPzkHEUI-JRU8Ok_h4rZD1AbrT0dM2zGFUUR-IFzL7oXISeY1ZEJAbrL4=w2880-h1613-l90-rj": true,
    "https://lh3.googleusercontent.com/KSM3z3kDJmVatKI47EHy7rkP9wZY6kkM1pAe1YGW7dajrs0ioZd9j_BCF2Q0ql25RottK03Z0Q=w2880-h1613-l90-rj":  true,
    "https://lh3.googleusercontent.com/oTR9fV0U5-sWG4ftLG7mBDtZHyxVgXlhPy7v8zDhRgUQnrCTPC_Eq3uodcYOo9bViF8A8CMy5w=w2880-h1613-l90-rj":  true,
};

export class Header extends Component {
    constructor(props) {
        super(props);
        this.state = {
            barStyle: "light-content",
            headerColor: "white"
        }
    }

    setImage = (url) => {
        if (url == null) {
            return require("../assets/img/header.jpg");
        } else {
            if (HeaderDb.hasOwnProperty(url))
                return {uri: url};

            else {
                if (typeof url == "string")
                    return {uri: url};
                else if (typeof url == "number")
                    return url;
            }
        }
    }

    setHeader = (url) => {
        if (url == null)
            StatusBar.setBarStyle(this.state.barStyle, true);

        else {
            if (HeaderDb.hasOwnProperty(url)) {
                let barStyle = HeaderDb[url] ? "dark-content" : "light-content";
                let headerColor = HeaderDb[url] ? "gray" : "white";

                this.setState({
                    barStyle: barStyle,
                    headerColor: headerColor
                });

                StatusBar.setBarStyle(this.state.barStyle, true);
            } else {
                this.setState({
                    barStyle: "light-content",
                    headerColor: "white"
                });

                if (typeof url == "string")
                    StatusBar.setBarStyle(this.state.barStyle, true);
                else if (typeof url == "number")
                    StatusBar.setBarStyle(this.state.barStyle, true);
            }
        }
    }

    render() {
        return (
            <ImageBackground imageStyle={styles.imageStyle} style={styles.containerStyle}
                             source={this.setImage(this.props.source)}>
                <Text style={[{color: this.state.headerColor}, styles.textStyle]}>{this.props.text}</Text>
            </ImageBackground>
        )
    }
}


export class Playlist extends Component {
    focusPlaylist = (json) => this.props.navigation.navigate("Playlist", json);

    render() {
        return (
            <View style={styles.playlist}>
                <TouchableOpacity onPress={() => this.focusPlaylist(this.props.playlist)}>
                    <Image style={styles.playlistCover} source={{uri: this.props.playlist.thumbnail}}/>
                </TouchableOpacity>
                <Text style={styles.playlistTitle}>{this.props.playlist.title}</Text>
                <Text style={styles.playlistDesc}>{this.props.playlist.subtitle}</Text>
            </View>
        );
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


    playlist: {
        width: 100,
        height: 160
    },

    playlistCover: {
        alignItems:'center',
        justifyContent:'center',
        height: 100,
        width: 100,
        backgroundColor: 'gray'
    },

    playlistTitle: {
        paddingTop: 5,
        fontSize: 10,
        fontWeight:'bold'
    },

    playlistDesc: {
        fontSize: 10,
    },
});