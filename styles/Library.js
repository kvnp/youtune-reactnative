import { StyleSheet } from 'react-native';
import { appColor } from './App';

export const navigatorStyle = StyleSheet.create({
    navigator: {
        backgroundColor: appColor.background.backgroundColor,
        flexGrow: 0,
        paddingBottom: 6,
        paddingTop: 6,
    },

    container: {
        justifyContent: "center",
        flexGrow: 1
    },

    focus: {
        marginRight: 15,
        marginLeft: 15,
    },

    focusText: {
        fontWeight: 'bold',
        borderBottomWidth: 3,
        borderBottomColor: 'white',
        color: 'white'
    },

    entry: {
        marginRight: 15,
        marginLeft: 15,
        alignItems: 'center',
        justifyContent: 'center',
    },

    entryText: {
        borderBottomWidth: 3,
        borderBottomColor: 'transparent',
        color: 'white'
    }
});