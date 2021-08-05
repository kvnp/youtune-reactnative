import React from 'react';

import {
    View,
    Image,
    Text
} from "react-native";

import { useTheme } from '@react-navigation/native';
import { TouchableRipple } from 'react-native-paper';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { resultStyle } from '../../styles/Search';
import { handleMedia } from '../../modules/event/mediaNavigator';
import { showModal } from '../modals/MoreModal';

export default Entry = ({ entry, navigation, index, forcedPlaylistId }) => {
    const { title, subtitle, thumbnail } = entry;
    const { videoId, browseId, playlistId } = entry;

    const view = {
        title: title,
        subtitle: subtitle,
        thumbnail: thumbnail,
        videoId: videoId,
        browseId: browseId,
        playlistId: forcedPlaylistId
            ? forcedPlaylistId
            : playlistId,
    };

    const { colors } = useTheme();

    return <TouchableRipple
        borderless={true}
        rippleColor={colors.primary}
        onPress={() => handleMedia(view, navigation)}
        onLongPress={() => showModal(view)}

        style={{
            marginHorizontal: 5,
            marginBottom: 10,
            borderRadius: 5,
            height: 70,
            backgroundColor: colors.card,
            flexDirection: 'row',
        }}
    >
        <>
        {
            index != undefined
                ? <Text style={{
                    width: 30,
                    textAlign: "center",
                    alignSelf: "center",
                    color: colors.text
                }}>
                    {index}
                </Text>

                : null
        }

        <Image 
            style={resultStyle.resultCover}
            progressiveRenderingEnabled={true}
            source={{uri: thumbnail}}
        />

        <View style={resultStyle.resultColumnOne}>
            <Text numberOfLines={1} style={[resultStyle.resultText, {color: colors.text}]}>{title}</Text>
            <Text numberOfLines={1} style={[resultStyle.resultText, {color: colors.text}]}>{subtitle}</Text>
        </View>

        <TouchableRipple
            borderless={true}
            rippleColor={colors.primary}
            onPress={() => showModal(view)}
            style={{
                justifyContent: "center",
                borderRadius: 25,
                alignSelf: "center",
                alignItems: "center",
                width: 50,
                height: 50,
                margin: 0,
                padding: 0
            }}
        >
            <MaterialIcons name="more-vert" color={colors.text} size={24}/>
        </TouchableRipple>
        
        </>
    </TouchableRipple>;
}