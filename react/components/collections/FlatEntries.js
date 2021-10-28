import React from 'react';

import { FlatList } from "react-native";
//import { textToSec } from '../../modules/utils/Time';
import Entry from '../shared/Entry';

/*const entriesToPlaylist = (entries, playlistId) => {
    let tracks = {
        list: [],
        index: 0
    }

    for (let i = 0; i < entries.length; i++) {
        tracks.list.push({
            id: entries[i].videoId,
            playlistId: playlistId,
            artwork: entries[i].thumbnail,
            title: entries[i].title,
            artist: entries[i].subtitle,
            duration: textToSec(entries[i].secondTitle)
        });
    }

    return tracks;
}*/

export default FlatEntries = ({entries, playlistId, navigation}) => {
    /*if (playlistId)
        hackTracks = entriesToPlaylist(entries, playlistId);
    else
        hackTracks = null;*/

    return <FlatList
        contentContainerStyle={{
            marginHorizontal: 10,
            alignSelf: "center",
            maxWidth: 800,
            width: "100%"
        }}

        data={entries}
        renderItem={
            ({item, index}) => <Entry 
                entry={item}
                index={index + 1}
                forcedPlaylistId={playlistId}
                navigation={navigation}
            />
        }

        keyExtractor={item => item.title}/>
}