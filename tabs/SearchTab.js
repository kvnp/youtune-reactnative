import React, {Component} from 'react';

import {
    View,
    Dimensions,
    StyleSheet
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
                    <Header text={"Suche"} color={this.props.passBackground.color} sourcee={this.props.passBackground.source}/>
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
        position: 'absolute',
        top: 0,
        width: '100%',
        height: 150,
        flex: 1,
        flexDirection: 'column'
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