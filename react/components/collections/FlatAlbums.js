import React from 'react';
import { FlatList } from "react-native";

import Playlist from '../shared/Playlist';
import { albumStyle } from '../../styles/Home';

export default FlatAlbums = ({albums, navigation}) => {
    return <FlatList style={albumStyle.albumCollection}
        horizontal={true}
        showsHorizontalScrollIndicator={false}
        data={albums}
        renderItem={
            ({item, index}) => <Playlist
                key={{index}}
                playlist={item}
                navigation={navigation}
                style={albumStyle.album}
            />
        }
    />

}