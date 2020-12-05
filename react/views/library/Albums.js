import { useTheme } from "@react-navigation/native";
import React, { useEffect } from "react";
import {
    ScrollView,
    Text,
    View,
    Pressable
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { rippleConfig } from "../../styles/Ripple";

export default Albums = ({ navigation }) => {
    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
        });

        return () => unsubscribe();
    }, []);

    const {dark, colors} = useTheme();

    return (
        <ScrollView style={{}} contentContainerStyle={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <View style={{height: 300, justifyContent: "space-evenly", alignItems: "center"}}>
                <MaterialIcons name="album" color={colors.text} size={50}/>
                <Text style={{fontSize: 20, color: colors.text}}>Liked albums are displayed here</Text>
                
                <View style={{borderRadius: 20, backgroundColor: dark ? colors.card : colors.primary}}>
                    <Pressable
                        style={{paddingHorizontal: 20, paddingVertical: 10,}}
                        onPress={() => navigation.navigate("Search")} android_ripple={rippleConfig}
                    >
                        <Text style={{color: colors.text, fontWeight: "bold"}}>Look for music</Text>
                    </Pressable>
                </View>
            </View>
        </ScrollView>
    );
}