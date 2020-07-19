import React from 'react';

import {
    Text,
    StyleSheet,
    Pressable
} from 'react-native';

export default ({ navigation }) => {
    React.useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => {
            global.setHeader({title: "Settings"});
        });
        
        return unsubscribe;
    }, [navigation]);

    return (
        <Pressable style={styles.middleView} onPress={() => navigation.navigate("Music")}>
            <Text style={styles.placeholder}>⚙️</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    headerPicture: {
        width: '100%',
        height: '20%'
    },

    middleView: {
        flexGrow: 1,
        alignItems: 'center',
        justifyContent: 'center',
        width: '100%'
    },

    placeholder: {
        fontSize: 70
    },
});