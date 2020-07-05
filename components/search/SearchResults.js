import React, { PureComponent } from 'react';

import {
    Text,
    View,
    ScrollView,
} from "react-native";

import { searchStyle, topicStyle } from '../../styles/Search';
import Entry from '../shared/Entry';

export default class SearchResults extends PureComponent {
    displayElement = (element) => {
        return <Entry song={element} navigation={this.props.navigation}/>;
    }

    displayElements = (elements) => {
        return elements.elements.map(this.displayElement);
    }

    displayTopic = (topic) => {
        if (topic.elements.length > 0)
            return (
                <View style={topicStyle.topicView}>
                    <Text style={topicStyle.topicHeader}>{topic.topic}</Text>
                    {this.displayElements(topic)}
                </View>
            );
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