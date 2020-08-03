import { appColor } from './App';

export const tabOptions = {
    scrollEnabled: true,
    style: {
        backgroundColor: appColor.background.backgroundColor
    },
    indicatorStyle: {
        color: "white",
        backgroundColor: "white",
        position: "absolute",
        top: 0,
        height: 5
    },
    labelStyle: {
        color: "white",
        fontWeight: "bold",
    },
    tabStyle: {
        width: "auto",
        paddingRight: 14,
        paddingLeft: 14
    },
    bounces: true
}