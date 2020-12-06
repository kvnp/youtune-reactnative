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
import MiniPlayer from '../../components/player/MiniPlayer';

import { shelvesStyle } from '../../styles/Shelves';
import { refreshStyle, preResultHomeStyle } from '../../styles/Home';
import { useTheme } from '@react-navigation/native';

export default HomeTab = ({navigation}) => {
    const [shelves, setShelves] = useState([]);
    const [loading, setLoading] = useState(false);
    const { colors } = useTheme();

    useEffect(() => {
        const _unsubscribe = navigation.addListener('focus', () => {
            global.setHeader({title: "Home"});
        });

        startRefresh();

        return () => {
            _unsubscribe();
        };
    }, []);

    const startRefresh = async() => {
        setLoading(true);
        let result = await fetchHome();

        if (result.background != undefined)
            global.setHeader({image: result.background});

        setShelves(result.shelves);
        setLoading(false);
    }

    return <>
        <FlatList
            style={shelvesStyle.scrollView}
            contentContainerStyle={shelvesStyle.scrollContainer}

            ListEmptyComponent={
                loading
                ? <View style={[shelvesStyle.scrollView, shelvesStyle.scrollContainer]}>
                    <ActivityIndicator color={colors.text} size="large"/>
                </View>

                : <Pressable onPress={Platform.OS == "web" ?startRefresh :null}>
                    <Text style={[preResultHomeStyle.preHomeBottomText, preResultHomeStyle.preHomeTopText]}>🏠</Text>
                    <Text style={preResultHomeStyle.preHomeBottomText}>
                        {
                            Platform.OS == "web"
                                ? "Press the home icon to load"
                                : "Pull down to load"
                        }
                    </Text>
                </Pressable>
            }

            ListFooterComponent={
                Platform.OS == "web"
                    ? loading
                        ? <View style={[shelvesStyle.scrollView, shelvesStyle.scrollContainer]}>
                            <ActivityIndicator color={colors.text} size="large"/>
                        </View>

                        : <Pressable onPress={startRefresh} style={[refreshStyle.button, {backgroundColor: colors.card}]}>
                            <Text style={[refreshStyle.buttonText, {color: colors.text}]}>Aktualisieren</Text>
                        </Pressable>

                    : <Pressable onPress={startRefresh} style={[refreshStyle.button, {backgroundColor: colors.card}]}>
                        <Text style={[refreshStyle.buttonText, {color: colors.text}]}>Aktualisieren</Text>
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
        <MiniPlayer navigation={navigation}/>
    </>
};