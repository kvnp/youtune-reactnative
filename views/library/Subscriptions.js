import React from "react";
import {
    ScrollView,
    Text,
} from "react-native";

export default ({ navigation }) => {
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            global.setLibraryNavigator(4);
        });

        return () => unsubscribe();
    });

    return (
        <ScrollView>
            <Text>Abos</Text>
        </ScrollView>
    );
}