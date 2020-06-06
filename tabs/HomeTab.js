import React, {Component} from 'react';

import {
    View,
    Dimensions,
    Text,
    StyleSheet,
    ScrollView,
    TouchableHighlight
} from 'react-native';

import {
    Header
} from '../components/SharedComponents'

import {
    Results
} from '../components/HomeComponents';
import { Colors } from 'react-native/Libraries/NewAppScreen';

import * as Tube from '../modules/Tube';

export default class HomeTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            home: null,
            background: require("../assets/img/header.jpg"),
        };
    }

    onPressRefresh = () => {
        Tube.fetchHome().then((result) => {

            /*let source = require("../assets/img/header.jpg");
            if (result.background != undefined) source = {uri: result.background};
            
            this.setState({home: result, background: source});*/

            if (result.background != undefined) this.setState({home: result, background: result.background});
            else                                this.setState({home: result, background: "../assets/img/header.jpg"});
        });
        
        
    }

    render() {
        return (
            <>
                <View style={styles.headerPicture}>
                    <Header style={{borderRadius: 100}} sourcee={this.state.background}  text={"Home"}/>
                </View>

                <View style={styles.middleView}>
                    <ScrollView style={styles.homeView}>
                        <Results passthroughHome={this.state.home}/>
                    </ScrollView>
                </View>

                <TouchableHighlight onPress={this.onPressRefresh} style={styles.refreshButton}>
                        <Text>Aktualisieren</Text>
                </TouchableHighlight>
                
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
        width: '100%',
        height: (Dimensions.get('window').height) - 200
    },

    refreshButton: {
        position: 'absolute',
        bottom: 5,
        paddingRight: 10,
        paddingLeft: 10,
        paddingBottom: 5,
        paddingTop: 5,
        borderRadius: 20,
        alignSelf: 'center',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: Colors.white
    },

    homeView: {
        paddingBottom:0
    },

    homeText: {
        fontWeight: 'bold',
        paddingLeft: 20,
        paddingTop: 15,
        fontSize: 20
    },

    albumCollection: {
        paddingTop: 20,
        paddingLeft: 20,
        paddingBottom: 5,
        marginBottom: 35
    },

    album: {
        marginRight: 20,
        width: 100,
        height: 160
    },

    albumCover: {
        height: 100,
        width: 100,
        backgroundColor: Colors.dark
    },

    albumTitle: {
        paddingTop: 5,
        fontSize: 10,
        fontWeight:'bold'
    },

    albumDesc: {
        fontSize: 10,
    }
});