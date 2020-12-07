import { useTheme } from '@react-navigation/native';
import React, { useEffect } from 'react';

import {
    ScrollView,
    Text,
    View,
    Pressable
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import Entry from "../../components/shared/Entry";
import { localIDs } from "../../modules/storage/SongStorage";
import { rippleConfig } from "../../styles/Ripple";

export default Downloads = ({ navigation }) => {
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
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
        <ScrollView contentContainerStyle={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            {
                localIDs != null
                    ? localIDs.length > 0
                        ? localIDs.map((id, index) => {
                            return <Entry entry={{title: id}} navigation={navigation} index={index}/>
                        })

                        : emptyFiller
                    : emptyFiller
            }
        </ScrollView>
    );
}