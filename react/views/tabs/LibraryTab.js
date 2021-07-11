import React, { useEffect } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import { navigationOptions } from '../../App';
import Playlists from '../library/Playlists';
import Albums from '../library/Albums';
import Songs from '../library/Songs';
import Artists from '../library/Artists';
import Downloads from '../library/Downloads';
import { setHeader } from '../../components/overlay/Header';
import { getIcon } from '../../modules/utils/Icon';

const Tab = createBottomTabNavigator();
const tabOptions = {};

export default LibraryTab = ({navigation}) => {
    useEffect(() => {
        const unsubscribe = navigation.addListener('tabPress', () => {
            setHeader({title: "Library"});
        });

        const unsubscribe2 = navigation.addListener('focus', () => {
            setHeader({title: "Library"});
        });

        return () => {
            unsubscribe();
            unsubscribe2();
        }
    }, []);

    return <Tab.Navigator initialRouteName="Playlists" tabBarPosition="bottom" screenOptions={{...navigationOptions, ...tabOptions}}>
        <Tab.Screen name="Playlists" component={Playlists} options={{ tabBarIcon: ({ color }) => getIcon({title: "playlist-play", color}) }}/>
        <Tab.Screen name="Albums" component={Albums} options={{ tabBarIcon: ({ color }) => getIcon({title: "album", color}) }}/>
        <Tab.Screen name="Songs" component={Songs} options={{ tabBarIcon: ({ color }) => getIcon({title: "library-music", color}) }}/>
        <Tab.Screen name="Artists" component={Artists} options={{ tabBarIcon: ({ color }) => getIcon({title: "people", color}) }}/>
        <Tab.Screen name="Downloads" component={Downloads} options={{ lazy: true, tabBarIcon: ({ color }) => getIcon({title: "file-download", color}) }}/>
    </Tab.Navigator>
};