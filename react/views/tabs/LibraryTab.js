import React, { useEffect } from 'react';
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';

//import ViewPagerAdapter from 'react-native-tab-view-viewpager-adapter';
// pager={props => <ViewPagerAdapter {...props}/>}

import Playlists from '../library/Playlists';
import Albums from '../library/Albums';
import Songs from '../library/Songs';
import Artists from '../library/Artists';
import { tabOptions } from '../../styles/Library';
import MiniPlayer from '../../components/player/MiniPlayer';
import { setHeader } from '../../components/overlay/Header';
import { navigationOptions } from '../../App';
import Downloads from '../library/Downloads';

const Tab = createMaterialTopTabNavigator();

export default LibraryTab = ({navigation}) => {
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            setHeader({title: "Library"});
        });

        return () => unsubscribe();
    }, []);

    return <>
        <Tab.Navigator tabBarOptions={tabOptions} initialRouteName="Playlists" tabBarPosition="bottom">
            <Tab.Screen name="Playlists" component={Playlists} options={navigationOptions}/>
            <Tab.Screen name="Albums" component={Albums} options={navigationOptions}/>
            <Tab.Screen name="Songs" component={Songs} options={navigationOptions}/>
            <Tab.Screen name="Artists" component={Artists} options={navigationOptions}/>
            <Tab.Screen name="Downloads" component={Downloads} options={navigationOptions}/>
        </Tab.Navigator>
        <MiniPlayer navigation={navigation}/>
    </>
};