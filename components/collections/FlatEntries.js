import React from 'react';

import { shelvesStyle } from "../../styles/Shelves";
import { FlatList } from "react-native";
import Entry from '../shared/Entry';

export default function FlatEntries(entries, navigation) {
    return <FlatList
                style={shelvesStyle.scrollView}
                data={entries}
                renderItem={
                    ({item}) => Entry(item, navigation)
                }
                keyExtractor={item => item.title}/>
}