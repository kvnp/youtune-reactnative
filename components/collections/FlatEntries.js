import React from 'react';

import { FlatList } from "react-native";
import Entry from '../shared/Entry';

export default ({entries, navigation}) => {
    return <FlatList
                data={entries}
                renderItem={
                    ({item}) => <Entry entry={item} navigation={navigation}/>
                }
                keyExtractor={item => item.title}/>
}