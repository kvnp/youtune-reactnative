import React from "react";
import {
    ScrollView,
    Text,
} from "react-native";

export default function Songs({ navigation }) {
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            global.setLibraryNavigator(2);
        });

        return () => unsubscribe();
    });

    return (
        <ScrollView>
            <Text>Songs</Text>
        </ScrollView>
    );
}