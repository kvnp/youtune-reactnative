import React, { PureComponent } from 'react';

import { StyleSheet } from 'react-native';

import {
    Results,
    SearchBar
} from '../components/SearchComponents';

export default class SearchTab extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            results: null,
            icon: '🔎'
        };
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            global.setHeader("Search");
        });
    }
    
    componentWillUnmount() {
        this._unsubscribe();
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
                <Results style={styles.resultView} passResults={this.state.results} passIcon={this.state.icon} navigation={this.props.navigation}/>
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