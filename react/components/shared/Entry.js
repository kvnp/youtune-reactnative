import React from 'react';

import {
    View,
    Image,
    Pressable,
    Text
} from "react-native";

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { resultStyle } from '../../styles/Search';
import { handleMedia } from '../../modules/event/mediaNavigator';
import { rippleConfig } from '../../styles/Ripple';
import { useTheme } from '@react-navigation/native';

const handle = (obj, navigation, index) => handleMedia(obj, navigation, index);

export default Entry = ({ entry, navigation, index, playPlaylist }) => {
    let { title, subtitle, secondTitle, secondSubtitle, thumbnail } = entry;
    let { videoId, browseId, playlistId } = entry;

    let view = {
        title: title,
        subtitle: subtitle,
        thumbnail: thumbnail,
        videoId: videoId,
        browseId: browseId,
        playlistId: playlistId,
    };

    const { colors } = useTheme();

    return (
        <Pressable
            onPress={
                () => {
                    if (playPlaylist != undefined)
                        playPlaylist();
                    else
                        handle(view, navigation, 0);
                }
            }

            onLongPress={() => global.showModal(view)}
            style={resultStyle.resultView}
        >
            {
                index != undefined
                    ? <Text style={[{width: 30, textAlign: "left"}, {color: colors.text}]}>
                        {index}
                    </Text>

                    : null
            }

            <Pressable
                android_ripple={rippleConfig}
                onPress={
                    () => {
                        if (playPlaylist != undefined)
                            playPlaylist(view);
                        else
                            handle(view, navigation, index);
                    }
            }>
                <Image style={resultStyle.resultCover} source={{uri: thumbnail}}/>
            </Pressable>

            <View style={resultStyle.resultColumnOne}>
                <Text numberOfLines={1} style={[resultStyle.resultText, {color: colors.text}]}>{title}</Text>
                <Text numberOfLines={1} style={[resultStyle.resultText, {color: colors.text}]}>{subtitle}</Text>
            </View>

            <View style={resultStyle.resultColumnTwo}>
                <Text numberOfLines={1} style={[resultStyle.resultText, {color: colors.text}]}>{secondTitle}</Text>
                <Text numberOfLines={1} style={[resultStyle.resultText, {color: colors.text}]}>{secondSubtitle}</Text>
            </View>

            <Pressable onPress={() => global.showModal(view)}>
                <MaterialIcons name="more-vert" color="black" size={24}/>
            </Pressable>
        </Pressable>
    );
}