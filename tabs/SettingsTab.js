import React, {Component} from 'react';

import {
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

export default class SettingsTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            results: null
        };
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            global.setHeader("Settings");
        });
    }
    
    componentWillUnmount() {
        this._unsubscribe();
    }

    resultReceiver = (childData) => this.setState({results: childData});

    render() {
        return (
            <TouchableOpacity style={styles.middleView} onPress={() => this.props.navigation.navigate("Artist")}>
                <Text style={styles.placeholder}>⚙️</Text>
            </TouchableOpacity>
        );
    }
};

const styles = StyleSheet.create({
    headerPicture: {
        width: '100%',
        height: '20%'
    },

    middleView: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },

    placeholder: {
        fontSize: 70
    },
});