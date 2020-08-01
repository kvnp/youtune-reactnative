import React, { PureComponent } from 'react';
import {
    SectionList,
    Text,
    View,
    TextInput,
    Keyboard,
    Pressable
} from 'react-native';

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { ActivityIndicator } from 'react-native-paper';

import { searchBarStyle, specificStyle } from '../../styles/Search';
import { resultHomeStyle, preResultHomeStyle } from '../../styles/Home';
import Entry from '../../components/shared/Entry';
import { shelvesStyle } from '../../styles/Shelves';
import { textStyle, appColor } from '../../styles/App';
import { fetchResults } from '../../modules/remote/API';
import MiniPlayer from '../../components/player/MiniPlayer';

export default class SearchTab extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            message: "",
            suggestion: [],
            shelves: [],

            query: null,
            oldQuery: null,
            loading: false,
            buttonDisabled: true
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
                .then(data => {
                    if (data.results > 0)
                        this.setState({shelves: data.shelves, loading: false});
                    else
                        this.setState({suggestion: data.suggestion, message: data.reason, loading: false});

                    this.forceUpdate();
                });
        }
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
                            if (this.state.query != this.state.oldQuery) {
                                this.setState({query: this.state.oldQuery});
                                this.forceUpdate();
                            }
                            
                            this.search();
                        }
                }

                keyExtractor={(item, index) => index + item.title}
                renderItem={({ item }) =>  <Entry entry={item} navigation={this.props.navigation}/>}
            />

            <View style={searchBarStyle.container}>
                {this.getSpecificButtons()}
                <TextInput style={searchBarStyle.input}
                            placeholder="Search"
                            value={this.state.query}
                            placeholderTextColor={textStyle.placeholder.color}
                            onChange={this.setQuery}
                            onSubmitEditing={this.search}/>

                <Pressable onPress={this.search}
                           style={searchBarStyle.button}
                           disabled={this.state.buttonDisabled}>
                    { this.state.loading
                        ? <ActivityIndicator color="white" size="small"/>
                        : <MaterialIcons name="search" color="white" size={24}/>
                    }
                </Pressable>
            </View>

            <MiniPlayer navigation={this.props.navigation} style={appColor.background}/>
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