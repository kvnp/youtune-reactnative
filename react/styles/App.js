import { StyleSheet, Platform } from 'react-native';

const colorStyle = {
    darkgray: {color: "darkgray"},
    white: {color: "white"},
};

export const appColor = {
    background: {
        //backgroundColor: '#694fad'
        backgroundColor: 'darkslategray'
    }
};

export const headerStyle = StyleSheet.create({
    headerPicture: {
        width: '100%',
        height: "20%"
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
        color: colorStyle.white.color
    },

    placeholder: {
        color: colorStyle.darkgray.color
    }
});

export const navOptionsOld = Platform.OS == "android" 
    ? {
        optimizationsEnabled: true,
        lazy: false,

        indicatorStyle: {
            color: colorStyle.white.color,
            backgroundColor: colorStyle.white.color,
            position: "absolute",
            bottom: 0,
            height: 3
        },

        activeTintColor: colorStyle.white.color,
        inactiveTintColor: colorStyle.darkgray.color,

        keyboardHidesTabBar: true,

        pressColor: colorStyle.darkgray.color,
        pressOpacity: colorStyle.darkgray.color,

        showIcon: true,
        showLabel: false
    }

    : {
        optimizationsEnabled: true,
        lazy: true,

        indicatorStyle: {
            color: colorStyle.white.color,
            backgroundColor: colorStyle.white.color,
            position: "absolute",
            bottom: 0,
            height: 3
        },

        activeTintColor: colorStyle.white.color,
        inactiveTintColor: colorStyle.darkgray.color,

        keyboardHidesTabBar: true,

        showIcon: true,
        showLabel: false
    };

export const navOptions = Platform.OS == "android" 
    ? {
        optimizationsEnabled: true,
        lazy: false,

        keyboardHidesTabBar: true,

        showIcon: true,
        showLabel: false
    }

    : {
        optimizationsEnabled: true,
        lazy: true,

        keyboardHidesTabBar: true,

        showIcon: true,
        showLabel: false
    };