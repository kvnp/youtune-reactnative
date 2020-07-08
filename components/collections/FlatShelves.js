import React from 'react';

import { shelvesStyle } from "../../styles/Shelves";
import { FlatList } from "react-native";
import Shelf from '../shared/Shelf';

export default function FlatShelves(shelves, navigation) {
    return <FlatList
                style={shelvesStyle.scrollView}
                refreshing={false}
                onRefresh={() => {}}
                data={shelves}
                renderItem={
                    ({item}) => <Shelf shelf={item} navigation={navigation}/>
                }
                keyExtractor={item => item.title}
            />
}