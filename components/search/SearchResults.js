import React, { PureComponent } from 'react';

import {
    Text,
    View,
    ScrollView,
} from "react-native";

import {
    fetchVideo,
    fetchBrowse
} from '../../modules/API';

import { searchStyle, topicStyle } from '../../styles/SearchTab';
import SongElement from '../shared/SongElement';

export default class SearchResults extends PureComponent {
    startVideo = (id) => fetchVideo(id).then((data) => {
        /*for (let i = 0; i < data.length; i++) {
            console.log(decodeURIComponent(data[i].signatureCipher.substring(data[i].signatureCipher.indexOf("url=") + 4)));
            new Player(decodeURIComponent(data[i].signatureCipher.substring(data[i].signatureCipher.indexOf("url=") + 4)));
        }*/
    });

    triggerEvent = (element) => {
        if (["Song", "Video"].includes(element.type))
            this.startVideo(element.videoId); // TODO: PlayerView
        else if (["Album", "Playlist"].includes(element.type))
            fetchBrowse(element.browseId).then((result) => 
                this.props.navigation.navigate("Playlist", result)
            );
        else console.log(element.browseId);
    }

    displayElement = (element) => {
        return <SongElement song={element}/>;
    }

    displayElements = (elements) => {
        return elements.elements.map(this.displayElement);
    }

    displayTopic = (topic) => {
        if (topic.elements.length > 0) {
            return (
                <View style={topicStyle.topicView}>
                    <Text style={topicStyle.topicHeader}>{topic.topic}</Text>
                    {this.displayElements(topic)}
                </View>
            );
        }
    }

    displayTopics = (result) => {
        if (result.suggestion.length > 0) {
            //TODO: Did you mean?
        }
        return result.topics.map(this.displayTopic);
    }

    displayResults = () => {
        if (this.props.passResults == null || this.props.passResults.results < 1)
            return <Text style={searchStyle.preResults}>{this.props.passIcon}</Text>;
        else
            return this.displayTopics(this.props.passResults);
    }

    render() {
        return (
            <ScrollView
                style={searchStyle.scrollView}
                contentContainerStyle={searchStyle.scrollContainer}>
                {this.displayResults()}
            </ScrollView>
        );
    }
}