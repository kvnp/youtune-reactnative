import React, { useEffect, useState } from 'react';

import {
    Text,
    Pressable,
    FlatList,
    View,
    ActivityIndicator,
    Platform
} from 'react-native';

import { fetchHome } from "../../modules/remote/API";

import Shelf from '../../components/shared/Shelf';

import { shelvesStyle } from '../../styles/Shelves';
import { refreshStyle, preResultHomeStyle } from '../../styles/Home';
import { useTheme } from '@react-navigation/native';
import { setHeader } from '../../components/overlay/Header';

export default HomeTab = ({navigation}) => {
    const [shelves, setShelves] = useState([]);
    const [continuation, setContinuation] = useState(null);
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();
    const homeText = Platform.OS == "web"
        ? "Press the home icon to load"
        : "Pull down to load";

    useEffect(() => {
        const _unsubscribe = navigation.addListener('focus', () => {
            setHeader({title: "Home"});
        });

        startRefresh();

        return () => {
            _unsubscribe();
        };
    }, []);

    const startRefresh = async() => {
        let temp = continuation;
        setContinuation(null);

        let result = await fetchHome(temp);

        if (result.background)
            setHeader({image: result.background});

        setShelves(shelves.concat(result.shelves));

        if (result.continuation)
            setContinuation(result.continuation);

        if (loading)
            setLoading(false);
    }

    return <FlatList
        style={shelvesStyle.scrollView}
        contentContainerStyle={shelvesStyle.scrollContainer}

        ListEmptyComponent={
            loading
            ? <View style={[shelvesStyle.scrollView, shelvesStyle.scrollContainer]}>
                <ActivityIndicator color={colors.text} size="large"/>
            </View>

            : <Pressable onPress={Platform.OS == "web" ? () => startRefresh() :null}>
                <Text style={[preResultHomeStyle.preHomeBottomText, preResultHomeStyle.preHomeTopText]}>🏠</Text>
                <Text style={preResultHomeStyle.preHomeBottomText}>
                    {homeText}
                </Text>
            </Pressable>
        }

        onEndReached={() => {
            if (continuation)
                startRefresh();
        }}

        ListFooterComponent={
            Platform.OS == "web"
                ? loading
                    ? <View style={[shelvesStyle.scrollView, shelvesStyle.scrollContainer]}>
                        <ActivityIndicator color={colors.text} size="large"/>
                    </View>

                    : <Pressable onPress={startRefresh} style={[refreshStyle.button, {backgroundColor: colors.card}]}>
                        <Text style={[refreshStyle.buttonText, {color: colors.text}]}>Refresh</Text>
                    </Pressable>

                : <Pressable onPress={startRefresh} style={[refreshStyle.button, {backgroundColor: colors.card}]}>
                    <Text style={[refreshStyle.buttonText, {color: colors.text}]}>Refresh</Text>
                </Pressable>
            
        }

        progressViewOffset={0}

        renderItem={({item}) => <Shelf shelf={item} navigation={navigation}/>}

        refreshing={loading}
        onRefresh={startRefresh}

        ListFooterComponentStyle={
            shelves.length == 0 
            ? {display: "none"}
            : {paddingBottom: 20}
        }

        data={shelves}
        keyExtractor={item => item.title}
    />
};