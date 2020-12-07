import React, { useState } from 'react';

import {
    ImageBackground,
    Text,
    Pressable,
} from "react-native";

import { useTheme } from '@react-navigation/native';
import LinearGradient from 'react-native-linear-gradient';
import { headerStyle } from '../../styles/App';

export var setHeader = null;

export default Header = ({style, onPress}) => {
    setHeader = ({title, image}) => {
        let state = {};
        if (image != undefined)         state.source = {uri: image};
        else if (header.source != null) state.source = header.source;

        if (title != undefined)         state.title = title;
        else if (header.title == null)  state.title = 'Home';
        else                            state.title = header.title;

        setState(state);
    }

    const [header, setState] = useState({
        title: "Home",
        source: null
    });

    const { dark, colors } = useTheme();

    return (
        <ImageBackground style={[headerStyle.container, style]}
                         imageStyle={{height: "100%", position: "absolute"}}
                         source={header.source}>
            <LinearGradient style={[headerStyle.gradient, header.source == null ? {backgroundColor: colors.card} :headerStyle.imageFound]}
                            colors={
                                dark ? gradientColorsDark
                                     : gradientColors
                            }>
                <Pressable onPress={onPress}>
                    <Text style={[headerStyle.text, {color: colors.text}]}>
                        {header.title}
                    </Text>
                </Pressable>
            </LinearGradient>
        </ImageBackground>
    )
}

const gradientColors = ['rgba(242, 242, 242, 0.2)', 'rgba(242, 242, 242, 0.5)', 'rgba(242, 242, 242, 0.8)', 'rgba(242, 242, 242, 1)'];
const gradientColorsDark = ['rgba(0, 0, 0, 0.2)', 'rgba(0, 0, 0, 0.5)', 'rgba(0, 0, 0, 0.8)', 'rgba(0, 0, 0, 1)'];