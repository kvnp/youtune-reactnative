import React, { useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

import { navigationOptions } from '../../App';
import Playlists from '../library/Playlists';
import Albums from '../library/Albums';
import Songs from '../library/Songs';
import Artists from '../library/Artists';
import Downloads from '../library/Downloads';
import { tabOptions } from '../../styles/Library';
import { setHeader } from '../../components/overlay/Header';

const Tab = createMaterialTopTabNavigator();

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

    return <Tab.Navigator tabBarOptions={tabOptions} initialRouteName="Playlists" tabBarPosition="bottom">
        <Tab.Screen name="Playlists" component={Playlists} options={navigationOptions}/>
        <Tab.Screen name="Albums" component={Albums} options={navigationOptions}/>
        <Tab.Screen name="Songs" component={Songs} options={navigationOptions}/>
        <Tab.Screen name="Artists" component={Artists} options={navigationOptions}/>
        <Tab.Screen name="Downloads" component={Downloads} options={navigationOptions}/>
    </Tab.Navigator>
};