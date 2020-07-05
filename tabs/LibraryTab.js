import React, { PureComponent } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { LibraryNavigator } from '../components/LibraryComponents';
import Playlists from '../libraries/Playlists';
import Albums from '../libraries/Albums';
import Songs from '../libraries/Songs';
import Artists from '../libraries/Artists';
import Subscriptions from '../libraries/Subscriptions';

export default class LibraryTab extends PureComponent {
    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            global.setHeader("Library");
        });
    }
    
    componentWillUnmount() {
        this._unsubscribe();
    }

    render() {
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
                <LibraryNavigator navigation={this.props.navigation}/>
            </>
        );
    }
};