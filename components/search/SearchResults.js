import React, { PureComponent } from 'react';

import {
    Text,
    View,
    ScrollView,
} from "react-native";

import { searchStyle, resultStyle } from '../../styles/Search';
import Shelf from '../shared/Shelf';
import { shelvesStyle } from '../../styles/Shelves';

export default class SearchResults extends PureComponent {
    displayShelf = (shelf) => {
        return <Shelf shelf={shelf} navigation={this.props.navigation}/>
    }

    displayShelves = (result) => {
        if (result.suggestion.length > 0) {
            //TODO: Did you mean?
        }
        
        if (result.reason != null) {
            //TODO: Display error message
        }

        return result.shelves.map(this.displayShelf);
    }

    displayResults = () => {
        if (this.props.passResults == null || this.props.passResults.results < 1)
            return (
                <View style={shelvesStyle.scrollContainer}>
                    <Text style={searchStyle.preResults}>{this.props.passIcon}</Text>
                </View>
            );
        else
            return (
                <ScrollView
                    style={[shelvesStyle.scrollView, resultStyle.scrollMargin]}
                    contentContainerStyle={shelvesStyle.scrollContainer}>
                    {this.displayShelves(this.props.passResults)}
                </ScrollView>
            );
    }

    render() {
        return this.displayResults();
    }
}