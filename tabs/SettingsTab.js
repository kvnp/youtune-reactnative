import React, {Component} from 'react';

import {
    View,
    Text,
    StyleSheet,
    Dimensions,
    TouchableOpacity
} from 'react-native';

import { Header } from '../components/SharedComponents';

export default class LibraryTab extends Component {
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
                    <Header text="Einstellungen" source={this.props.passImage}/>
                </View>
            
                <TouchableOpacity style={styles.middleView} onPress={() => this.props.navigation.navigate("Artist")}>
                    <Text style={styles.placeholder}>⚙️</Text>
                </TouchableOpacity>
            </>
        );
    }
};

const styles = StyleSheet.create({
    headerPicture: {
        width: '100%',
        height: 150,
        flexDirection: 'column'
    },

    middleView: {
        alignContent:'flex-start',
        width: '100%'
    },

    placeholder: {
        fontSize: 70,
        marginTop: (Dimensions.get("screen").height / 2) - 300,
        alignSelf: 'center'
    },
});