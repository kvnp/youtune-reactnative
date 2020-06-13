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
            background: {
                source: require("../assets/img/header.jpg"),
                bright: false,
                color: Colors.white
            }
        };
    }


    refresh = () => {
        Tube.fetchHome().then((result) => {
            if (result.background != undefined)
                this.setState({
                    home: result,
                    background: {
                        source: result.background,
                        bright: this.state.background.bright,
                        color: this.state.background.color
                    }
                });
            
            else
                this.setState({
                    home: result,
                    background: {
                        source: require("../assets/img/header.jpg"),
                        bright: false,
                        color: Colors.white
                    }
                });

            const db = {
                "https://lh3.googleusercontent.com/3OazqYM5TA4lMDZ0A-52-v6Zg4L-uFsAmfMp8aC-l-TUgr_UwPvayfxy_5hs5ll4B4zpj2hrG9A=w2880-h1613-l90-rj":
                true,
                "https://lh3.googleusercontent.com/G2nNxQ2O_svAtYlismpu0ZfNvusgKGBVpq-LI4xsHPeJELQO2_wOOu9NvOHcb9X1VvPR5_qx=w2880-h1620-l90-rj":
                true,
                "https://lh3.googleusercontent.com/zG2J10I50KGW5v6bk9nPzkHEUI-JRU8Ok_h4rZD1AbrT0dM2zGFUUR-IFzL7oXISeY1ZEJAbrL4=w2880-h1613-l90-rj":
                true,
                "https://lh3.googleusercontent.com/KSM3z3kDJmVatKI47EHy7rkP9wZY6kkM1pAe1YGW7dajrs0ioZd9j_BCF2Q0ql25RottK03Z0Q=w2880-h1613-l90-rj":
                true
            };

            if (db.hasOwnProperty(result.background)) {
                let color;
                if (db[result.background]) color = Colors.dark;
                else                       color = Colors.white;

                this.setState({
                    background: {
                        source: this.state.background.source,
                        bright: db[result.background],
                        color: color
                    }
                });
            } else
                this.setState({
                    background: {
                        source: this.state.background.source,
                        bright: false,
                        color: Colors.white
                    }
                });

            this.props.appCallback(this.state.background);
        });
    }

    componentDidMount() {
        //this.refresh();
    }

    render() {
        return (
            <>
                <View style={styles.headerPicture}>
                    <Header style={{borderRadius: 100}} color={this.state.background.color} sourcee={this.state.background.source}  text={"Home"}/>
                </View>

                <View style={styles.middleView}>
                    <ScrollView style={styles.homeView}>
                        <Results passthroughHome={this.state.home}/>
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