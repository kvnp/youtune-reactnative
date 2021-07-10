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

export default HomeTab = ({navigation, route}) => {
    const [shelves, setShelves] = useState([]);
    const [continuation, setContinuation] = useState(null);
    const [loading, setLoading] = useState(true);
    const { colors } = useTheme();
    const [homeText, setHomeText] = useState(
        Platform.OS == "web"
            ? "Press the home icon to load"
            : "Pull down to load"
    );

    useEffect(() => {
        const _unsubscribe = navigation.addListener('focus', () => {
            setHeader({title: "Home"});
            if (shelves.length == 0)
                startRefresh();
        });

        const _offlineListener = Platform.OS == "web"
            ? window.addEventListener("online", () => {
                setLoading(true);
                startRefresh();
            })
            : undefined;

        return () => {
            _unsubscribe();

            if (_offlineListener)
                _offlineListener();
        };
    }, []);

    const startRefresh = async() => {
        let temp = continuation;

        fetchHome(temp)
            .then(result => {
                setHomeText(
                    Platform.OS == "web"
                        ? "Press the home icon to load"
                        : "Pull down to load"
                );

                if (result.background)
                    setHeader({image: result.background});

                setShelves(result.shelves);

                if (result.continuation)
                    setContinuation(result.continuation);

                if (loading)
                    setLoading(false);
            })

            .catch(e => {
                setHomeText("You are offline");
                setLoading(false);
            })

        
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
                <Text style={[preResultHomeStyle.preHomeBottomText, preResultHomeStyle.preHomeTopText, {color: colors.text}]}>🏠</Text>
                <Text style={[preResultHomeStyle.preHomeBottomText, {color: colors.text}]}>
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