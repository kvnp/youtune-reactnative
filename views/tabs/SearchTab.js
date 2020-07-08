import React, { PureComponent } from 'react';
import {
    SectionList,
    Text,
    View,
    Button,
    TextInput,
    Keyboard,
    TouchableOpacity
} from 'react-native';

import { ActivityIndicator } from 'react-native-paper';

import { searchBarStyle, specificStyle } from '../../styles/Search';
import { resultHomeStyle, preResultHomeStyle } from '../../styles/Home';
import Entry from '../../components/shared/Entry';
import { shelvesStyle } from '../../styles/Shelves';
import { textStyle } from '../../styles/App';
import { fetchResults } from '../../modules/API';

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
        return <>
                    <SectionList
                        style={shelvesStyle.scrollView}
                        contentContainerStyle={shelvesStyle.scrollContainer}

                        ListEmptyComponent={
                            this.state.loading ? 
                                <View style={[shelvesStyle.scrollView, shelvesStyle.scrollContainer]}>
                                    <ActivityIndicator size="large"/>
                                </View> 
                            :
                                <View>
                                    <Text style={[preResultHomeStyle.preHomeBottomText, preResultHomeStyle.preHomeTopText]}>🔍</Text>
                                    <Text style={preResultHomeStyle.preHomeBottomText}>Look for music using the search bar</Text>
                                </View>
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
                            this.state.oldQuery == null ?
                                undefined :
                                () => {
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

                    <View style={[searchBarStyle.container, searchBarStyle.bar]}>
                        {this.getSpecificButtons()}
                        <TextInput style={[searchBarStyle.content, textStyle.text]}
                                placeholder="Search"
                                value={this.state.query}
                                placeholderTextColor={textStyle.placeholder.color}
                                onChange={this.setQuery}
                                onSubmitEditing={this.search}/>

                        <View style={searchBarStyle.content}>
                            <Button onPress={this.search}
                                    title='🔎'
                                    disabled={this.state.buttonDisabled}/>
                        </View>
                    </View>
                </>
    }

    getSpecificButtons = () => {
        this.state.shelves.length > 0 ?
            <View style={specificStyle.container}>
                <TouchableOpacity style={specificStyle.button}>
                    <Text style={specificStyle.text}>
                        Videos
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={specificStyle.button}>
                    <Text style={specificStyle.text}>
                        Playlists
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={specificStyle.button}>
                    <Text style={specificStyle.text}>
                        Songs
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={specificStyle.button}>
                    <Text style={specificStyle.text}>
                        Künstler
                    </Text>
                </TouchableOpacity>

                <TouchableOpacity style={specificStyle.button}>
                    <Text style={specificStyle.text}>
                        Alben
                    </Text>
                </TouchableOpacity>
            </View> 
        : null;
    }
};