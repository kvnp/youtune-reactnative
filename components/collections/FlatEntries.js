import React from 'react';

import { FlatList } from "react-native";
import Entry from '../shared/Entry';

export default function FlatEntries(entries, navigation) {
    return <FlatList
                data={entries}
                renderItem={
                    ({item}) => Entry(item, navigation)
                }
                keyExtractor={item => item.title}/>
}