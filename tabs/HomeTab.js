import React, {Component} from 'react';

import {
    Text,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

import {
    Results
} from '../components/HomeComponents';

import { Header } from '../components/SharedComponents';

export default class HomeTab extends Component {
    constructor(props) {
        super(props);
        this.state = {
            loading: false,
            image: null,
        }
    }

    startLoading = () => {
        if (this.state.loading == false)
            this.setState({loading: true});
    }

    setImage = (source) => {
        this.props.setImage(source);
        this.setState({loading: false, image: source});
    }

    render() {
        return (
            <>
                <Header style={styles.headerPicture} text="Home" source={this.state.image}/>
                <Results style={styles.homeView} setImage={this.setImage} load={this.state.loading} navigation={this.props.navigation}/>

                <TouchableOpacity onPress={this.startLoading} style={styles.refreshButton}>
                    <Text>Aktualisieren</Text>
                </TouchableOpacity>
            </>
        );
    }
};

const styles = StyleSheet.create({
    headerPicture: {
        width: '100%',
        height: '20%'
    },

    homeView: {
        flexGrow: 1,
        width: '100%'
    },

    refreshButton: {
        position: 'absolute',
        bottom: 5,
        paddingRight: 15,
        paddingLeft: 15,
        paddingBottom: 5,
        paddingTop: 5,
        borderRadius: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: 'white'
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
        fontWeight: 'bold'
    },

    albumDesc: {
        fontSize: 10,
    }
});