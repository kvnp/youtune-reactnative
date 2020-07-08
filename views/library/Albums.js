import React from "react";
import {
    ScrollView,
    Text,
} from "react-native";

export default ({ navigation }) => {
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            global.setLibraryNavigator(1);
        });

        return () => unsubscribe();
    });

    return (
        <ScrollView>
            <Text>Alben</Text>
        </ScrollView>
    );
}