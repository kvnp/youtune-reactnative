import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import LibraryNavigator from '../../components/library/LibraryNavigator';
import Playlists from '../library/Playlists';
import Albums from '../library/Albums';
import Songs from '../library/Songs';
import Artists from '../library/Artists';
import Subscriptions from '../library/Subscriptions';

export default function LibraryTab({navigation}) {
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            global.setHeader({title: "Library"});
        });

        return () => unsubscribe();
    }, [navigation]);

    const LibraryStack = createStackNavigator();
    return (
        <>
            <LibraryStack.Navigator>
                <LibraryStack.Screen name="LibraryPlaylist" component={Playlists} options={global.navigationOptions}/>
                <LibraryStack.Screen name="LibraryAlbums" component={Albums} options={global.navigationOptions}/>
                <LibraryStack.Screen name="LibrarySongs" component={Songs} options={global.navigationOptions}/>
                <LibraryStack.Screen name="LibraryArtists" component={Artists} options={global.navigationOptions}/>
                <LibraryStack.Screen name="LibrarySubscriptions" component={Subscriptions} options={global.navigationOptions}/>
            </LibraryStack.Navigator>
            <LibraryNavigator navigation={navigation}/>
        </>
    );
};