import React, { PureComponent } from 'react';
import { createStackNavigator } from '@react-navigation/stack';

import { LibraryNavigator } from '../components/LibraryComponents';
import Playlists from '../views/library/Playlists';
import Albums from '../views/library/Albums';
import Songs from '../views/library/Songs';
import Artists from '../views/library/Artists';
import Subscriptions from '../views/library/Subscriptions';

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