import React from "react";
import {
    ScrollView,
    Text,
} from "react-native";

export default ({ navigation }) => {
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
        });

        return () => unsubscribe();
    });

    return (
        <ScrollView>
            <Text>Songs</Text>
        </ScrollView>
    );
}