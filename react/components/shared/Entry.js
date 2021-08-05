import React from 'react';

import {
    View,
    Image,
    Text
} from "react-native";

import { Button } from 'react-native-paper';

import MaterialIcons from "react-native-vector-icons/MaterialIcons";

import { resultStyle } from '../../styles/Search';
import { handleMedia } from '../../modules/event/mediaNavigator';
import { useTheme } from '@react-navigation/native';
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

    return (
        <Button
            onPress={() => handleMedia(view, navigation)}
            onLongPress={() => showModal(view)}

            style={{
                marginHorizontal: 5,
                marginTop: 10,
                borderRadius: 5
            }}

            labelStyle={{
                display: "flex",
                flex: 1,
                letterSpacing: 0,
                textTransform: "none",
                fontSize: 14
            }}
            
            contentStyle={[
                {backgroundColor: colors.card},
                resultStyle.resultView
            ]}
        >
            {
                index != undefined
                    ? <Text style={[{width: 30, textAlign: "left"}, {color: colors.text}]}>
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

            <Button
                onPress={() => showModal(view)}
                labelStyle={{marginHorizontal: 0}}
                style={{justifyContent: "center", borderRadius: 25, alignItems: "center", padding: 0, margin: 0, minWidth: 0}}
                contentStyle={{alignItems: "center", width: 50, height: 50, minWidth: 0}}
            >
                <MaterialIcons name="more-vert" color={colors.text} size={24}/>
            </Button>
        </Button>
    );
}