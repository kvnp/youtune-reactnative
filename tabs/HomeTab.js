import React, {Component} from 'react';

import {
    View,
    Dimensions,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity
} from 'react-native';

import {
    Results
} from '../components/HomeComponents';

import * as Tube from '../modules/Tube';
import { Header } from '../components/SharedComponents';

export default class HomeTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            icon: '🏠',
            home: {
                shelves: [],
                background: null
            }
        };
    }

    refresh = () => {
        this.setState({icon: '|', home: {shelves: []}});
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

        Tube.fetchHome().then((result) => {
            clearInterval(loader);
            this.setState({icon: '🏠'});
            if (result.background != undefined) {
                this.props.setImage(result.background);
                this.setState({home: result});
            }
        });
    }

    render() {
        return (
            <>
                <View style={styles.headerPicture}>
                    <Header text="Home" source={this.state.home.background}/>
                </View>

                <View style={styles.middleView}>
                    <ScrollView style={styles.homeView}>
                        <Results passHome={this.state.home} homeIcon={this.state.icon} navigation={this.props.navigation}/>
                    </ScrollView>
                </View>

                <TouchableOpacity onPress={this.refresh} style={styles.refreshButton}>
                    <Text>Aktualisieren</Text>
                </TouchableOpacity>
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
        backgroundColor: 'white'
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
        backgroundColor: 'gray'
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