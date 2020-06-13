import React, {Component} from 'react';

import {
    View,
    StyleSheet,
    Dimensions
} from 'react-native';

import {
    Results,
    SearchBar
} from '../components/SearchComponents';

import {
    Header
} from '../components/SharedComponents';

export default class SearchTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: null
        };
    }

    resultReceiver = (childData) => {
        this.setState({results: childData});
    };

    render() {
        return (
            <>
                <View style={styles.headerPicture}>
                    <Header text={"Suche"}
                            color={this.props.passBackground.headerColor} sourcee={this.props.passBackground.source}/>
                </View>

                <View style={styles.middleView}>
                    <Results passthroughResults={this.state.results}/>
                </View>

                <View style={styles.searchBar}>
                    <SearchBar resultSender={this.resultReceiver}/>
                </View>
            </>
        );
    }
};

const styles = StyleSheet.create({
    headerPicture: {
        width: '100%',
        height: 150
    },

    middleView: {
        position: 'absolute',
        top: 150,
        width:'100%',
        height: (Dimensions.get('window').height) - 305
    },

    searchBar: {
        width: '100%',
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center'
    }
});