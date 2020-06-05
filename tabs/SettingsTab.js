import React, {Component} from 'react';

import {
    View,
    Text
} from 'react-native';

export default class SettingsTab extends Component {
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
                <View style={{flex:1, alignSelf:'center', justifyContent:'center'}}>
                    <Text style={{fontSize:40}}>┬┴┬┴┤ ✧≖ ͜ʖ≖)</Text>
                </View>
            </>
        );
    }
};