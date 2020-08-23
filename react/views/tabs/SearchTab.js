import React, { PureComponent } from 'react';
import {
    SectionList,
    Text,
    View,
    TextInput,
    Keyboard,
    Pressable,
    ActivityIndicator,
    KeyboardAvoidingView,
    Platform
} from 'react-native';

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { searchBarStyle, specificStyle } from '../../styles/Search';
import { resultHomeStyle, preResultHomeStyle } from '../../styles/Home';
import Entry from '../../components/shared/Entry';
import { shelvesStyle } from '../../styles/Shelves';
import { textStyle, appColor } from '../../styles/App';
import { fetchResults } from '../../modules/remote/API';
import MiniPlayer from '../../components/player/MiniPlayer';
import { rippleConfig } from '../../styles/Ripple';

export default class SearchTab extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            shelves: [],

            query: "",
            oldQuery: null,
            buttonDisabled: true,
            loading: false,

            message: "",
            suggestion: null,
            instead: null,
        };
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            global.setHeader({title: "Search"});
        });
    }
    
    componentWillUnmount() {
        this._unsubscribe();
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
            this.setState({buttonDisabled: true, loading: true, oldQuery: this.state.query});
            fetchResults(this.state.query)
                .then(data => this.setState(
                    {
                        shelves: data.shelves,
                        suggestion: data.suggestion,
                        instead: data.insteadOption,
                        suggestion: data.suggestionOption,
                        loading: false
                    }
            ));
        }
    }

    searchInstead = async(query) => {
        this.setState({query: query, message: null, instead: null, suggestion: null});
        this.search();
    }

    render() {
        return (
            <>
            <SectionList
                style={shelvesStyle.scrollView}
                contentContainerStyle={shelvesStyle.scrollContainer}

                ListEmptyComponent={
                    <>
                    <Text style={[preResultHomeStyle.preHomeBottomText, preResultHomeStyle.preHomeTopText]}>🔍</Text>
                    <Text style={preResultHomeStyle.preHomeBottomText}>Look for music using the search bar</Text>
                    </>
                }

                renderSectionHeader={({ section: { title } }) => (
                    <View style={resultHomeStyle.textView}>
                        <Text style={resultHomeStyle.homeText}>{title}</Text>
                    </View>
                )}

                progressViewOffset={20}
                sections={this.state.shelves}

                refreshing={this.state.loading}
                onRefresh={
                    this.state.oldQuery == null
                        ? undefined
                        : () => {
                            if (this.state.query != this.state.oldQuery)
                                this.setState({query: this.state.oldQuery});
                            
                            this.search();
                        }
                }

                keyExtractor={(item, index) => index + item.title}
                renderItem={({ item }) =>  <Entry entry={item} navigation={this.props.navigation}/>}
            />

            {this.state.instead != null
                ? <View style={searchBarStyle.suggestion}>
                    <Pressable style={searchBarStyle.suggestionContainer} onPress={() => this.searchInstead(this.state.instead.endpoints.corrected.query)}>
                        <Text style={{color: "white"}}>{this.state.instead.endpoints.corrected.text}</Text>
                        <Text style={{color: "white"}}>
                        {this.state.instead.correctedList
                                .map(entry => <Text style={entry.italics ? {fontWeight: "bold"} :null}>{entry.text}</Text>)}
                        </Text>
                    </Pressable>

                    <Pressable style={searchBarStyle.suggestionContainer} onPress={() => this.searchInstead(this.state.instead.endpoints.original.query)}>
                        <Text style={{color: "white"}}>{this.state.instead.endpoints.original.text}</Text>
                        <Text style={{color: "white"}}>
                            {this.state.instead.originalList
                                .map(entry => <Text style={entry.italics ? {fontWeight: "bold"} :null}>{entry.text}</Text>)}
                        </Text>
                    </Pressable>

                </View>

                : null
            }

            <KeyboardAvoidingView enabled={Platform.OS == "ios" ? true : false} behavior="padding" keyboardVerticalOffset={170}>
                {this.state.suggestion != null
                    ? <View style={searchBarStyle.suggestion}>
                        <Pressable style={[searchBarStyle.suggestionContainer, {width: "25%"}]} onPress={() => this.searchInstead(this.state.suggestion.endpoints.query)}>
                            <Text style={{color: "white"}}>{this.state.suggestion.endpoints.text}</Text>
                            <Text style={{color: "white"}}>
                                {this.state.suggestion.correctedList
                                    .map(entry => <Text style={entry.italics ? {fontWeight: "bold"} :null}>{entry.text}</Text>)}
                            </Text>
                        </Pressable>

                    </View>

                    : null
                }

                
                {this.getSpecificButtons()}
                <View style={searchBarStyle.container}>
                    <TextInput  style={searchBarStyle.input}
                                placeholder="Search"
                                value={this.state.query}
                                placeholderTextColor={textStyle.placeholder.color}
                                onChange={this.setQuery}
                                onSubmitEditing={this.search}/>
                    <Pressable  onPress={this.search}
                                android_ripple={rippleConfig}
                                style={searchBarStyle.button}
                                disabled={this.state.buttonDisabled}>
                        { this.state.loading
                            ? <ActivityIndicator color="white" size="small"/>
                            : <MaterialIcons name="search" color="white" size={24}/>
                        }
                    </Pressable>
                </View>

                <MiniPlayer navigation={this.props.navigation} style={appColor.background}/>
            </KeyboardAvoidingView>
            </>
        )
    }

    getSpecificButtons = () => {
        this.state.shelves.length > 0 
            ? <View style={specificStyle.container}>
                <Pressable style={specificStyle.button}>
                    <Text style={specificStyle.text}>
                        Videos
                    </Text>
                </Pressable>

                <Pressable style={specificStyle.button}>
                    <Text style={specificStyle.text}>
                        Playlists
                    </Text>
                </Pressable>

                <Pressable style={specificStyle.button}>
                    <Text style={specificStyle.text}>
                        Songs
                    </Text>
                </Pressable>

                <Pressable style={specificStyle.button}>
                    <Text style={specificStyle.text}>
                        Künstler
                    </Text>
                </Pressable>

                <Pressable style={specificStyle.button}>
                    <Text style={specificStyle.text}>
                        Alben
                    </Text>
                </Pressable>
            </View>

            : null;
    }
};