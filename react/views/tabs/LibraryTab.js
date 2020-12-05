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

const Tab = createMaterialTopTabNavigator();

export default LibraryTab = ({navigation}) => {
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            global.setHeader({title: "Library"});
        });

        return () => unsubscribe();
    }, []);

    return (
        <>
        <Tab.Navigator tabBarOptions={tabOptions} initialRouteName="Playlists" tabBarPosition="bottom">
            <Tab.Screen name="Playlists" component={Playlists} options={global.navigationOptions}/>
            <Tab.Screen name="Albums" component={Albums} options={global.navigationOptions}/>
            <Tab.Screen name="Songs" component={Songs} options={global.navigationOptions}/>
            <Tab.Screen name="Artists" component={Artists} options={global.navigationOptions}/>
        </Tab.Navigator>
        <MiniPlayer navigation={navigation}/>
        </>
    );
};