import React, { PureComponent } from 'react';

import {
    Text,
    TouchableOpacity
} from 'react-native';

import {
    Results
} from '../../components/HomeComponents';
import { mainStyle, refreshStyle } from '../../styles/HomeTab';

export default class HomeTab extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            loading: false
        }
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            global.setHeader("Home");
        });
    }
    
    componentWillUnmount() {
        this._unsubscribe();
    }


    startLoading = () => {
        if (this.state.loading == false)
            this.setState({loading: true});
    }

    setImage = (source) => {
        this.setState({loading: false});
        global.setHeader("Home", source);
    }

    render() {
        return (
            <>
                <Results style={mainStyle.homeView} setImage={this.setImage} load={this.state.loading} navigation={this.props.navigation}/>

                <TouchableOpacity onPress={this.startLoading} style={refreshStyle.button}>
                    <Text style={refreshStyle.buttonText}>Aktualisieren</Text>
                </TouchableOpacity>
            </>
        );
    }
};