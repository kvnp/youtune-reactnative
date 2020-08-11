import React from "react";
import {
    ScrollView,
    Text,
    Pressable,
    View
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import { appColor } from "../../styles/App";

export default ({ navigation }) => {
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
        });

        return () => unsubscribe();
    });

    return (
        <ScrollView style={{}} contentContainerStyle={{flex: 1, alignItems: "center", justifyContent: "center"}}>
            <View style={{height: 300, justifyContent: "space-evenly", alignItems: "center"}}>
                <MaterialIcons name="library-music" color="black" size={50}/>
                <Text style={{fontSize: 20}}>Liked songs are displayed here</Text>
                <Pressable onPress={() => navigation.navigate("Search")} style={{padding: 10, borderRadius: 20, backgroundColor: appColor.background.backgroundColor}}>
                    <Text style={{color: "white", fontWeight: "bold"}}>Look for music</Text>
                </Pressable>
            </View>
        </ScrollView>
    );
}