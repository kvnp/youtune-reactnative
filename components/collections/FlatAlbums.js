import React from 'react';
import { FlatList } from "react-native";

import Playlist from '../shared/Playlist';
import { albumStyle } from '../../styles/Home';

export default function FlatAlbums(albums, navigation) {
    return <FlatList style={albumStyle.albumCollection}
                     horizontal={true}
                     showsHorizontalScrollIndicator={false}
                     data={albums}
                     renderItem={
                         ({item}) => <Playlist playlist={item} navigation={navigation} style={albumStyle.album}/>
                     }
                     keyExtractor={item => item.title}/>

}