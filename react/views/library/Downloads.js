import React, { useEffect, useState } from 'react';

import {
    ScrollView,
    Text,
    View,
    Pressable
} from "react-native";

import { useTheme } from '@react-navigation/native';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entry from "../../components/shared/Entry";
import { loadSongLocal, localIDs } from "../../modules/storage/SongStorage";
import { rippleConfig } from "../../styles/Ripple";
import { shelvesStyle } from '../../styles/Shelves';
import { handleMedia, playLocal } from '../../modules/event/mediaNavigator';

export default Downloads = ({ navigation }) => {
    const [entries, setEntries] = useState([]);

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', async() => {
            let entries = [];

            for (let i = 0; i < localIDs.length; i++) {
                entries.push(await loadSongLocal(localIDs[i]));
            }

            setEntries(entries);
        });

        return () => unsubscribe();
    }, []);

    const {dark, colors} = useTheme();

    const emptyFiller = <View style={{height: 300, justifyContent: "space-evenly", alignItems: "center"}}>
        <MaterialIcons name="get-app" color={colors.text} size={50}/>
        <Text style={{fontSize: 20, color: colors.text}}>Downloaded songs are displayed here</Text>
        
        <View style={{borderRadius: 20, backgroundColor: dark ? colors.card : colors.primary}}>
            <Pressable
                style={{paddingHorizontal: 20, paddingVertical: 10}}
                onPress={() => navigation.navigate("Search")} android_ripple={rippleConfig}
            >
                <Text style={{color: colors.text, fontWeight: "bold"}}>Look for music</Text>
            </Pressable>
        </View>
    </View>

    return (
        <ScrollView contentContainerStyle={[shelvesStyle.searchContainer, entries.length != 0 ? {flex: "none"} : undefined]}>
            {
                entries.length > 0
                    ? entries.map(track => {
                        return <Entry
                            key={track.id}
                            entry={{
                                title: track.title,
                                subtitle: track.artist,
                                thumbnail: track.artwork,
                                videoId: track.id
                            }}
                            navigation={navigation}
                        />
                    })
                    : emptyFiller
            }
            {
                entries.length > 0
                    ? <Pressable
                        android_ripple={rippleConfig}
                        style={{padding: 10, margin: 20, width: 100, borderRadius: 10, alignItems: "center", backgroundColor: colors.card}}
                        onPress={() => playLocal("LOCAL_DOWNLOADS", navigation)}
                    >
                        <Text style={{color: colors.text, fontSize: 15, fontWeight: "700"}}>Play all</Text>
                    </Pressable>

                    : undefined
            }
        </ScrollView>
    );
}