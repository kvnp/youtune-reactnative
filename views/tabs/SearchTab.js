import React, { PureComponent } from 'react';

import SearchBar from '../../components/search/SearchBar';
import Results from '../../components/search/SearchResults';

import { searchBarStyle } from '../../styles/SearchTab';

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
                <Results passResults={this.state.results} passIcon={this.state.icon} navigation={this.props.navigation}/>
                <SearchBar style={searchBarStyle.bar} resultSender={this.resultReceiver} sendIcon={this.iconReceiver}/>
            </>
        );
    }
};