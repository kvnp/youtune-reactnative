import React from 'react';

import { FlatList } from "react-native";
import Entry from '../shared/Entry';
import { handleMedia } from '../../modules/event/mediaNavigator';
import Playlist from '../../modules/models/music/playlist';
import Track from '../../modules/models/music/track';
import { textToSec } from '../../modules/utils/Time';

const handle = (navigation, list, index) => {
    let playlist = new Playlist();
    playlist.index = index;

    for (let i = 0; i < list.length; i++) {
        playlist.list.push(
            new Track(
                list[i].videoId,
                list[i].playlistId,
                list[i].title,
                list[i].subtitle,
                list[i].thumbnail,
                textToSec(list[i].secondTitle)
            )
        );
    }

    handleMedia(null, navigation, index, playlist);
}

export default FlatEntries = ({entries, navigation, isPlaylist}) => {
    return <FlatList
                style={{}}
                contentContainerStyle={{marginHorizontal: "auto", position: "absolute", width: "100%"}}
                data={entries}
                renderItem={
                    ({item, index}) => <Entry entry={item} index={index + 1}
                                              playPlaylist={
                                                isPlaylist != undefined
                                                    ? () => {
                                                        handle(navigation, entries, index);
                                                    }

                                                    : undefined
                                             }

                                            navigation={navigation}
                                        />
                }

                keyExtractor={item => item.title}/>
}