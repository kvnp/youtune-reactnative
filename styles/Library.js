import { StyleSheet } from 'react-native';
import { appColor } from './App';

export const navigatorStyle = StyleSheet.create({
    container: {
        alignSelf: 'center',
        width: '100%',
        height: 50,
        position: 'absolute',
        bottom: -5,
        backgroundColor: appColor.background.backgroundColor
    },

    focus: {
        height: 50,
        paddingRight: 15,
        paddingLeft: 15,
        alignItems: 'center',
        justifyContent: 'center'
    },

    focusText: {
        fontWeight: 'bold',
        borderBottomWidth: 3,
        borderBottomColor: 'white',
        color: 'white'
    },

    entry: {
        height: 50,
        paddingRight: 15,
        paddingLeft: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },

    entryText: {
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
        color: 'white'
    }
});