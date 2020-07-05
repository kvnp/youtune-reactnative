import React, {PureComponent} from 'react';

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
    TouchableOpacity
} from "react-native";

import {
    fetchResults,
    fetchVideo,
    fetchBrowse
} from '../modules/Tube';

export class SearchBar extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            query: null,
            buttonDisabled: true,
            results: null
        };
    }

    setQuery = (event) => {
        if (event.nativeEvent.text.length > 0)
            this.setState({query: event.nativeEvent.text,
                           buttonDisabled: false});
        else
            this.setState({query: event.nativeEvent.text,
                           buttonDisabled: true});
    }

    search = () => {
        Keyboard.dismiss();
        if (this.state.query.length > 0) {
            let icon = '|';
            this.props.sendIcon(icon);
            let loader = setInterval(() => {
                switch (icon) {
                    case '|' :
                        icon = '/';
                        return this.props.sendIcon(icon);
                    case '/' :
                        icon = '-';
                        return this.props.sendIcon(icon);
                    case '-' :
                        icon = '\\';
                        return this.props.sendIcon(icon);
                    case '\\':
                        icon = '|';
                        return this.props.sendIcon(icon);
                }
            }, 300);

            this.setState({buttonDisabled: true});
            fetchResults(this.state.query)
                .then(data => { clearInterval(loader);
                                this.props.sendIcon('🔎');
                                this.setState({results: data});
                                this.props.resultSender(data);
                               });
        }
    }

    getSpecificButtons = () => {
        if (this.state.results != null)
            return (
                <View style={styles.specificButtonContainer}>
                    <TouchableOpacity style={styles.specificButton}>
                        <Text style={styles.specificButtonText}>
                            Videos
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.specificButton}>
                        <Text style={styles.specificButtonText}>
                            Playlists
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.specificButton}>
                        <Text style={styles.specificButtonText}>
                            Songs
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.specificButton}>
                        <Text style={styles.specificButtonText}>
                            Künstler
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity style={styles.specificButton}>
                        <Text style={styles.specificButtonText}>
                            Alben
                        </Text>
                    </TouchableOpacity>
                </View>
            )
        else return null;
    }

    render() {
        return (
            <View style={[styles.searchBox, this.props.style]}>
                {this.getSpecificButtons()}
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

export class Results extends PureComponent {
    startVideo = (id) => fetchVideo(id).then((data) => {
        /*for (let i = 0; i < data.length; i++) {
            console.log(decodeURIComponent(data[i].signatureCipher.substring(data[i].signatureCipher.indexOf("url=") + 4)));
            new Player(decodeURIComponent(data[i].signatureCipher.substring(data[i].signatureCipher.indexOf("url=") + 4)));
        }*/
    });

    triggerEvent = (element) => {
        if (["Song", "Video"].includes(element.type))
            this.startVideo(element.videoId); // TODO: PlayerView
        else if (["Album", "Playlist"].includes(element.type))
            fetchBrowse(element.browseId).then((result) => 
                this.props.navigation.navigate("Playlist", result)
            );
        else console.log(element.browseId);
    }

    displayElement = (element) => {
        return (
            <View style={styles.resultView}>
                <TouchableOpacity onPress={() => {this.triggerEvent(element)}}>
                    <Image style={styles.resultCover} source={{uri: element.thumbnail}}></Image>
                </TouchableOpacity>

                <View style={styles.resultColumnOne}>
                        <Text numberOfLines={1} style={styles.resultText}>{element.title}</Text>
                        <Text style={styles.resultText}>{element.subtitle}</Text>
                    </View>
                    <View style={styles.resultColumnTwo}>
                        <Text numberOfLines={1} style={styles.resultText}>{element.secondTitle}</Text>
                        <Text style={styles.resultText}>{element.secondSubtitle}</Text>
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
            );
        }
    }

    displayTopics = (result) => {
        if (result.suggestion.length > 0) {
            //TODO: Did you mean?
        }
        return result.topics.map(this.displayTopic);
    }

    displayResults = () => {
        if (this.props.passResults == null || this.props.passResults.results < 1)
            return <Text style={styles.preResults}>{this.props.passIcon}</Text>;
        else
            return this.displayTopics(this.props.passResults);
    }

    render() {
        return (
            <ScrollView
                style={styles.scrollView}
                contentContainerStyle={[styles.scrollContainer, this.props.style]}>
                {this.displayResults()}
            </ScrollView>
        );
    }
}

const styles = StyleSheet.create({
    searchBox: {
        backgroundColor: 'white',
        width: '100%',
        alignItems: 'center'
    },

    scrollView: {
        flexDirection: 'column',
        paddingTop: 20,
        marginBottom: 50
    },

    scrollContainer: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center'
    },

    resultHeader: {
        marginTop: 10,
        fontSize: 30,
        fontWeight: 'bold'
    },

    preResults: {
        fontSize: 70,
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
        backgroundColor: 'gray',
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
        paddingLeft: 10,
        flex: 1,
        flexDirection: 'column',
        alignItems: 'center'
    },

    resultText: {
        color: 'white'
    },

    specificButtonContainer: {
        paddingTop: 5,
        paddingBottom: 5,
        flexDirection: 'row',
        width: '80%',
        backgroundColor: 'transparent'
    },

    specificButton: {
        backgroundColor: 'transparent',
        flexGrow: 1,
        height: 30,
        borderRadius: 75,
        marginLeft: 2,
        marginRight: 2,
        justifyContent: 'center',
        borderColor: 'black',
        borderWidth: 1.5
    },

    specificButtonText: {
        color: 'black',
        alignSelf: 'center',
    },
});