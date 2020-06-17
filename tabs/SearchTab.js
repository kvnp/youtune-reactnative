import React, {Component} from 'react';

import { StyleSheet } from 'react-native';

import {
    Results,
    SearchBar
} from '../components/SearchComponents';

import { Header } from '../components/SharedComponents';

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
                <Header style={styles.headerPicture} text="Suche" source={this.props.passImage}/>
                <Results style={styles.resultView} passResults={this.state.results} passIcon={this.state.icon}/>
                <SearchBar style={styles.searchBar} resultSender={this.resultReceiver} sendIcon={this.iconReceiver}/>
            </>
        );
    }
};

const styles = StyleSheet.create({
    headerPicture: {
        width: '100%',
        height: '20%'
    },

    resultView: {
        paddingBottom: 120
    },

    searchBar: {
        width: '100%',
        position: 'absolute',
        bottom: 10,
        alignSelf: 'center'
    }
});