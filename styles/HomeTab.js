import { StyleSheet } from 'react-native';
import { appColor } from './App';

export const refreshStyle = StyleSheet.create({
    button: {
        position: 'absolute',
        bottom: 5,
        paddingRight: 15,
        paddingLeft: 15,
        paddingBottom: 5,
        paddingTop: 5,
        borderRadius: 20,
        alignSelf: 'center',
        justifyContent: 'center',
        backgroundColor: appColor.background.backgroundColor,
    },

    buttonText: {
        color: 'white'
    }
});

export const mainStyle = StyleSheet.create({
    homeView: {
        flexGrow: 1,
        width: '100%'
    },
});