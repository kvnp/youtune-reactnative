import React, {Component} from 'react';

import {
    Button,
    Image,
    StyleSheet,
    Text,
    TextInput,
    View,
    ScrollView,
    Linking,
    Keyboard,
    Dimensions,
    TouchableOpacity
} from "react-native";

import { Colors } from 'react-native/Libraries/NewAppScreen';

import * as Tube from '../modules/Tube';

export class SearchBar extends Component {
    constructor(props) {
        super(props);
        this.state = {
            query: null,
            buttonDisabled: true
        };
    }

    sendData = (result) => {
        this.props.resultSender(result);
    }

    setQuery = (event) => {
        if (event.nativeEvent.text.length > 0) {
            this.setState({query: event.nativeEvent.text,
                           buttonDisabled: false});
        } else {
            this.setState({query: event.nativeEvent.text,
                           buttonDisabled: false});
        }
    }

    search = () => {
        Keyboard.dismiss();
        if (this.state.query.length > 0) {
            this.setState({query: this.state.query,
                           buttonDisabled: true});

            Tube.fetchResults(this.state.query)
                .then(data => { this.setState({query: this.state.query,
                                               buttonDisabled: true});
                                this.sendData(data);});
        }
    }

    render() {
        return (
            <View style={{backgroundColor: Colors.white, width: '100%', alignItems:'center'}}>
                <TextInput style={{marginBottom: 5, width: '80%'}}
                           placeholder="Suchen"
                           onChange={this.setQuery}
                           onSubmitEditing={this.search}/>

                <View style={{width: '80%', marginBottom: 5}}>
                    <Button onPress={this.search}
                            title='🔎'
                            disabled={this.state.buttonDisabled}/>
                </View>
            </View>
        )
    }
}

export class Results extends Component {
    startVideo = (id) => {
        Tube.fetchVideo(id).then((data) => {
            /*for (let i = 0; i < data.length; i++) {
                console.log(decodeURIComponent(data[i].signatureCipher.substring(data[i].signatureCipher.indexOf("url=") + 4)));
                new Player(decodeURIComponent(data[i].signatureCipher.substring(data[i].signatureCipher.indexOf("url=") + 4)));
            }*/
        });
    }

    displayElement = (element) => {
        return (
            <View style={styles.resultView}>
                <TouchableOpacity onPress={() => {this.startVideo(element.videoId)}}>
                    <Image style={styles.resultCover} source={{uri: element.thumb}}></Image>
                </TouchableOpacity>
                
                <View style={styles.resultColumnOne}>
                    <Text style={styles.resultText}>{element.title}</Text>
                    <Text style={styles.resultText}>{element.interpret}</Text>
                </View>
                <View style={styles.resultColumnTwo}>
                    <Text style={styles.resultText}>{element.type}</Text>
                    <Text style={styles.resultText}>{element.length}</Text>
                </View>

                <Button
                    title="▶️"
                    onPress={() => {
                        Linking.openURL("https://music.youtube.com/watch?v=" + (element.videoId))
                    }}/>
            </View>
        )
    }

    displayElements = (elements) => {
        return elements.elements.map(this.displayElement);
    }

    displayTopic = (topic) => {
        if (topic.elements.length > 0) {
            return (
                <View style={styles.topicView}>
                    <Text style={styles.topicHeader}>{topic.topic}</Text>
                    {this.displayElements(topic)}
                </View>
            )
        }
    }

    displayTopics = (result) => {
        if (result.suggestion.length > 0) {
            //TODO: Did you mean?
        }
        return result.topics.map(this.displayTopic);
    }

    displayResults = () => {
        if (this.props.passthroughResults == null || this.props.passthroughResults.results < 1) {
            return (
                <>
                    <Text style={styles.preResults}>🔍 </Text>
                </>
            )
        } else {
            return (
                <>
                    <Text style={styles.resultHeader}>Ergebnisse</Text>
                    {this.displayTopics(this.props.passthroughResults)}
                </>
            )
        }
    }

    render() {
        return (
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={styles.scrollContainer}>
                {this.displayResults()}
            </ScrollView>
        )
    }
}

const styles = StyleSheet.create({
    scrollView: {
        height: '100%',
        flex: 1,
        flexDirection: 'column'
    },

    scrollContainer: {
        alignItems: 'center'
    },

    resultHeader: {
        marginTop: 10,
        fontSize: 30,
        fontWeight: 'bold'
    },

    preResults: {
        fontSize: 70,
        marginTop: (Dimensions.get("screen").height / 2) - 300,
        alignSelf: 'center'
    },

    topicView: {
        paddingTop: 20,
        width: '100%'
    },

    topicHeader: {
        fontWeight: 'bold',
        fontSize: 20,
        paddingLeft: 50
    },

    resultView: {
        width: '100%',
        paddingLeft: 15,
        paddingRight: 15,
        marginTop: 10,
        flexDirection: 'row',
        backgroundColor: Colors.dark,
        alignItems: 'center'
    },

    resultCover: {
        width: 50,
        height: 50
    },

    resultColumnOne: {
        paddingLeft: 10,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },

    resultColumnTwo: {
        paddingLeft: 20,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },

    resultText: {
        color: Colors.white
    }
});