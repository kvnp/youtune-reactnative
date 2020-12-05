import React, { useEffect, useState } from 'react';
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

import { searchBarStyle } from '../../styles/Search';
import { resultHomeStyle, preResultHomeStyle } from '../../styles/Home';
import Entry from '../../components/shared/Entry';
import { shelvesStyle } from '../../styles/Shelves';
import { fetchResults } from '../../modules/remote/API';
import MiniPlayer from '../../components/player/MiniPlayer';
import { rippleConfig } from '../../styles/Ripple';
import { useTheme } from '@react-navigation/native';

export default SearchTab = ({navigation}) => {
    const [shelves, setShelves] = useState([]);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [suggestion, setSuggestion] = useState(null);
    const [instead, setInstead] = useState(null);
    const [query, setQuery] = useState("");
    const { dark, colors } = useTheme();

    useEffect(() => {
        _unsubscribe = navigation.addListener('focus', () => {
            global.setHeader({title: "Search"});
        });

        return () => {
            _unsubscribe();
        }

    }, []);

    const search = query => {
        Keyboard.dismiss();
        if (query.length > 0) {
            setLoading(true);

            fetchResults(query).then(data => {
                if (data.suggestionOption == suggestion)
                    data.suggestionOption = null;

                if (data.insteadOption == instead)
                    data.insteadOption = null;
                
                setShelves(data.shelves);
                setInstead(data.instead);
                setSuggestion(data.suggestion);
                setLoading(false);
            });
        }
    }

    const searchInstead = query => {
        setQuery(query);
        search(query);
    }

    return (
        <>
        <SectionList
            style={shelvesStyle.scrollView}
            contentContainerStyle={shelvesStyle.scrollContainer}

            ListEmptyComponent={
                <>
                <Text style={[preResultHomeStyle.preHomeBottomText, preResultHomeStyle.preHomeTopText, {color: colors.text}]}>🔍</Text>
                <Text style={[preResultHomeStyle.preHomeBottomText, {color: colors.text}]}>Look for music using the search bar</Text>
                </>
            }

            renderSectionHeader={({ section: { title } }) => (
                <View style={resultHomeStyle.textView}>
                    <Text style={[resultHomeStyle.homeText, {color: colors.text}]}>{title}</Text>
                </View>
            )}

            progressViewOffset={20}
            sections={shelves}

            refreshing={loading}
            onRefresh={() => search(query)}

            keyExtractor={(item, index) => index + item.title}
            renderItem={({ item }) =>  <Entry entry={item} navigation={navigation}/>}
        />

        {instead != null
            ? <View style={searchBarStyle.suggestion}>
                <Pressable style={searchBarStyle.suggestionContainer} onPress={() => searchInstead(instead.endpoints.corrected.query)}>
                    <Text style={{color: colors.text}}>{instead.endpoints.corrected.text}</Text>
                    <Text style={{color: colors.text}}>
                        {instead.correctedList
                            .map(entry => <Text style={entry.italics ? {fontWeight: "bold", color: colors.text} :null}>{entry.text}</Text>)}
                    </Text>
                </Pressable>

                <Pressable style={searchBarStyle.suggestionContainer} onPress={() => searchInstead(instead.endpoints.original.query)}>
                    <Text style={{color: colors.text}}>{instead.endpoints.original.text}</Text>
                    <Text style={{color: colors.text}}>
                        {instead.originalList
                            .map(entry => <Text style={entry.italics ? {fontWeight: "bold", color: colors.text} :null}>{entry.text}</Text>)}
                    </Text>
                </Pressable>
            </View>

            : null
        }

        <KeyboardAvoidingView enabled={Platform.OS == "ios" ? true : false} behavior="padding" keyboardVerticalOffset={170}>
            {suggestion != null
                ?   <View style={searchBarStyle.suggestion}>
                        <Pressable style={[searchBarStyle.suggestionContainer, {width: "25%"}]} onPress={() => searchInstead(suggestion.endpoints.query)}>
                            <Text style={{color: colors.text}}>{suggestion.endpoints.text}</Text>
                            <Text style={{color: colors.text}}>
                                {suggestion.correctedList
                                    .map(entry => <Text style={entry.italics ? {fontWeight: "bold", color: colors.text} :null}>{entry.text}</Text>)}
                            </Text>
                        </Pressable>
                    </View>

                : null
            }

            <View style={[searchBarStyle.container, {backgroundColor: colors.card}]}>
                <TextInput style={[searchBarStyle.input, {color: colors.text}]}
                           placeholder="Search"
                           value={query}
                           onChangeText={setQuery}
                           placeholderTextColor={colors.text}
                           onSubmitEditing={() => search(query)}/>
                <Pressable onPress={() => search(query)}
                           android_ripple={rippleConfig}
                           style={searchBarStyle.button}>
                    { loading
                        ? <ActivityIndicator color={colors.text} size="small"/>
                        : <MaterialIcons name="search" color={colors.text} size={24}/>
                    }
                </Pressable>
            </View>

            <MiniPlayer navigation={navigation}/>
        </KeyboardAvoidingView>
        </>
    );
}