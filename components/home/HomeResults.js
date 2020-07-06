import React, { PureComponent } from 'react';

import {
    Text,
    ScrollView,
    View
} from "react-native";

import { fetchHome } from '../../modules/API';

import { resultHomeStyle } from '../../styles/Home';
import Shelf from '../shared/Shelf';
import { shelvesStyle } from '../../styles/Shelves';

export default class Results extends PureComponent {
    constructor(props){
        super(props);
        this.state = {
            icon: '🏠',
            home: null,
            started: false,
        }
    }

    componentDidUpdate() {
        if (this.props.load && !this.state.started) {
            this.setState({started: true});
            this.startRefresh();
        }
    }
    
    startRefresh = () => {
        this.setState({icon: '|'});

        let loader = setInterval(() => {
            switch (this.state.icon) {
                case '|' :
                    return this.setState({icon: '/'});
                case '/' :
                    return this.setState({icon: '-'});
                case '-' :
                    return this.setState({icon: '\\'});
                case '\\':
                    return this.setState({icon: '|'});
            }
        }, 300);

        fetchHome().then((result) => {
            clearInterval(loader);

            if (result.background != undefined) {
                this.props.setImage(result.background);
                this.setState({home: result});
            } else this.props.setImage(null);

            this.setState({icon: '🏠', started: false});
        });
    }

    displayShelf = (shelf) => {
        return <Shelf shelf={shelf} navigation={this.props.navigation}/>
    }

    displayShelves = (result) => {
        return result.shelves.map(this.displayShelf);
    }

    displayHome = () => {
        if (this.state.home == null || this.state.started)
            return <Text style={resultHomeStyle.preHome}>{this.state.icon}</Text>
        else
            return <View>{this.displayShelves(this.state.home)}</View>
    }

    render() {
        return (
            <ScrollView style={shelvesStyle.scrollView}
                        contentContainerStyle={shelvesStyle.scrollContainer}>
                {this.displayHome()}
            </ScrollView>
        );
    }
}