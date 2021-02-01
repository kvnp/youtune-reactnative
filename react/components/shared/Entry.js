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
import { showModal } from './MoreModal';

export default Entry = ({ entry, navigation, index }) => {
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
            onPress={() => handleMedia(view, navigation)}
            onLongPress={() => showModal(view)}
            style={[resultStyle.resultView, {backgroundColor: colors.card}]}
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
                onPress={() => handleMedia(view, navigation)}
            >
                <Image style={resultStyle.resultCover} source={{uri: thumbnail}}/>
            </Pressable>

            <View style={resultStyle.resultColumnTwo}>
                <Text numberOfLines={1} style={[resultStyle.resultText, {color: colors.text}]}>{secondTitle}</Text>
                <Text numberOfLines={1} style={[resultStyle.resultText, {color: colors.text}]}>{secondSubtitle}</Text>
            </View>
            
            <View style={resultStyle.resultColumnOne}>
                <Text numberOfLines={1} style={[resultStyle.resultText, {color: colors.text}]}>{title}</Text>
                <Text numberOfLines={1} style={[resultStyle.resultText, {color: colors.text}]}>{subtitle}</Text>
            </View>


            <Pressable onPress={() => showModal(view)}>
                <MaterialIcons name="more-vert" color={colors.text} size={24}/>
            </Pressable>
        </Pressable>
    );
}