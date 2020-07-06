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

export const resultHomeStyle = StyleSheet.create({
    preHome: {
        fontSize: 70,
    },

    homeText: {
        fontWeight: 'bold',
        alignSelf: 'flex-start',
        paddingLeft: 20,
        paddingTop: 20,
        fontSize: 25
    }
});

export const albumStyle = StyleSheet.create({
    albumCollection: {
        paddingTop: 10,
        paddingLeft: 20,
        paddingBottom: 5,
        marginBottom: 35
    },

    album: {
        marginRight: 20
    },

    albumCover: {
        height: 100,
        width: 100,
        backgroundColor: 'gray'
    }
});

export const mainStyle = StyleSheet.create({
    homeView: {
        flexGrow: 1,
        width: '100%'
    },
});