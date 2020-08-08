import { appColor } from './App';

export const tabOptions = {
    scrollEnabled: true,
    optimizationsEnabled: true,
    lazy: true,

    style: {
        backgroundColor: appColor.background.backgroundColor,
    },

    indicatorStyle: {
        color: "white",
        backgroundColor: "white",
        position: "absolute",
        top: 0,
        height: 5
    },

    labelStyle: {
        fontWeight: "bold",
    },

    activeTintColor: "white",
    inactiveTintColor: "darkgray",

    tabStyle: {
        width: "auto",
        paddingRight: 14,
        paddingLeft: 14
    },

    bounces: true,
    pressColor: "darkgray",
    pressOpacity: "darkgray",
}