import { StyleSheet } from 'react-native';

export const appColor = StyleSheet.create({
    background: {
        backgroundColor: '#694fad'
    }
});

export const gradientColors = ['rgba(255, 255, 255, 0.5)', 'rgba(255, 255, 255, 0.1)'];

export const headerStyle = StyleSheet.create({
    headerPicture: {
        width: '100%',
        height: '20%'
    },

    image: {
        borderBottomLeftRadius: 25,
        borderBottomRightRadius: 25,
        //backgroundColor: appColor.background.backgroundColor,
        backgroundColor: 'transparent',
    },

    container: {
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: 'transparent',
        marginBottom: -25,
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