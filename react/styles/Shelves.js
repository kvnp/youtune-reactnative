import { StyleSheet, Platform } from 'react-native';

export const shelvesStyle = StyleSheet.create({
    scrollView: {
        display: Platform.OS == "web"
            ? "block"
            : "flex"
    },

    scrollContainer: {
        flexGrow: 1,
        justifyContent: "center",
        paddingBottom: 20,
    },
});