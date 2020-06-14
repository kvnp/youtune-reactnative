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
            results: null,
            icon: '🔎'
        };
    }

    resultReceiver = (data) => {
        this.setState({results: data});
    };

    iconReceiver = (icon) => {
        if (this.state.results != null) this.setState({results: null});
        this.setState({icon: icon});
    }

    render() {
        return (
            <>
                <View style={styles.headerPicture}>
                    {this.props.passBackground}
                </View>

                <View style={styles.middleView}>
                    <Results passResults={this.state.results} passIcon={this.state.icon}/>
                </View>

                <View style={styles.searchBar}>
                    <SearchBar resultSender={this.resultReceiver} sendIcon={this.iconReceiver}/>
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