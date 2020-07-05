import { StyleSheet } from 'react-native';

export const appColor = StyleSheet.create({
    background: {
        backgroundColor: '#694fad'
    }
});

export const gradientColors = ["#7f9f9f9f", "#ffffff00"];

export const headerStyle = StyleSheet.create({
    headerPicture: {
        width: '100%',
        height: '20%'
    },

    image: {
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        backgroundColor: 'transparent'
    },

    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        marginBottom: -20,
        zIndex: 1
    },

    gradient: {
        width: '100%',
        height: '100%',
        alignItems: 'center',
        justifyContent: 'center'
    },

    text: {
        fontSize: 45,
        fontWeight: 'bold'
    }
});

export const textStyle = StyleSheet.create({
    text: {
        color: 'white'
    },

    placeholder: {
        color: 'darkgray'
    }
});