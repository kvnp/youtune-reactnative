import React, { PureComponent } from 'react';

import {
    View,
    Image,
    Linking,
    TouchableOpacity,
    Text,
    Button
} from "react-native";

import {
    fetchBrowse,
    fetchVideo
} from "../../modules/API";

import { resultStyle } from '../../styles/Search';

export default class Entry extends PureComponent {
    startVideo = (id) => fetchVideo(id).then((data) => {
        /*for (let i = 0; i < data.length; i++) {
            console.log(decodeURIComponent(data[i].signatureCipher.substring(data[i].signatureCipher.indexOf("url=") + 4)));
            new Player(decodeURIComponent(data[i].signatureCipher.substring(data[i].signatureCipher.indexOf("url=") + 4)));
        }*/
    });

    triggerEvent = () => {
        let { type, videoId, browseId, playlistId } = this.props.song;
        if (["Song", "Video"].includes(type))
            this.startVideo(videoId); // TODO: PlayerView
        else if (["Album", "Playlist"].includes(type))
            fetchBrowse(browseId).then((result) => 
                this.props.navigation.navigate("Playlist", result)
            );
        else console.log(browseId);
    }

    render() {
        let { title, subtitle, secondTitle, secondSubtitle, thumbnail, videoId } = this.props.song;

        return (
            <View style={resultStyle.resultView}>
                <TouchableOpacity onPress={() => {this.triggerEvent()}}>
                    <Image style={resultStyle.resultCover} source={{uri: thumbnail}}></Image>
                </TouchableOpacity>

                <View style={resultStyle.resultColumnOne}>
                    <Text numberOfLines={1} style={resultStyle.resultText}>{title}</Text>
                    <Text numberOfLines={1} style={resultStyle.resultText}>{subtitle}</Text>
                </View>

                <View style={resultStyle.resultColumnTwo}>
                    <Text numberOfLines={1} style={resultStyle.resultText}>{secondTitle}</Text>
                    <Text numberOfLines={1} style={resultStyle.resultText}>{secondSubtitle}</Text>
                </View>

                <Button title="▶️" onPress={() => {
                    Linking.openURL("https://music.youtube.com/watch?v=" + (videoId))
                }}/>
            </View>
        )
    }
}