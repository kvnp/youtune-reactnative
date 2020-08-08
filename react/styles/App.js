import { StyleSheet } from 'react-native';

export const appColor = StyleSheet.create({
    background: {
        backgroundColor: '#694fad'
    }
});

export const gradientColors = ['rgba(255, 255, 255, 0.2)', 'rgba(255, 255, 255, 0.5)'];

export const headerStyle = StyleSheet.create({
    headerPicture: {
        width: '100%'
    },

    headerHeight: {
        height: "20%"
    },

    image: {
        backgroundColor: appColor.background.backgroundColor
    },

    imageFound: {
        backgroundColor: "transparent"
    },

    imageStyle: {},

    container: {
        alignItems: 'center',
        justifyContent: 'center',
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

export const navOptions = {
    optimizationsEnabled: true,
    lazy: true,

    style: {
        backgroundColor: appColor.background.backgroundColor
    },

    indicatorStyle: {
        color: "white",
        backgroundColor: "white",
        position: "absolute",
        bottom: 0,
        height: 3
    },

    activeTintColor: "white",
    inactiveTintColor: "darkgray",

    keyboardHidesTabBar: true,

    pressColor: "darkgray",
    pressOpacity: "darkgray",

    showIcon: true,
    showLabel: false
}