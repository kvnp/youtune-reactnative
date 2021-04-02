import React from "react";
import {
    Image,
    View,
    Text,
    StyleSheet,
    Pressable,
    FlatList,
    Dimensions
} from "react-native";
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import BottomSheet from 'reanimated-bottom-sheet';

import { skipTo } from "../../service";
import { rippleConfig } from "../../styles/Ripple";

export default SwipePlaylist = ({playlist, track, backgroundColor, textColor, minimumHeight}) => {
    const { height } = Dimensions.get("window");
    const sheetRef = React.useRef(null);

    const renderHeader = () => <Pressable 
        android_ripple={rippleConfig}
        style={[styles.panelHeader, {backgroundColor: backgroundColor}]}
        onPress={() => sheetRef.current.snapTo(1)}
    >
        <View style={[stylesRest.smallBar, {backgroundColor: textColor}]}/>
        <Text style={{color: textColor}}>PLAYLIST</Text>
    </Pressable>

    const renderContent = () => <View style={{height: height - 200, backgroundColor: backgroundColor}}>
        <FlatList
            contentContainerStyle={[stylesRest.playlistContainer, {backgroundColor: backgroundColor}]}

            data={playlist}

            keyExtractor={item => item.id}
            renderItem={({item, index}) =>
                <Pressable android_ripple={rippleConfig}
                            style={{
                                height: minimumHeight,
                                flexDirection: "row",
                                alignItems: "center",
                                marginVertical: 5
                            }}

                            onPress={() => skipTo({id: item.id})}
                >
                    {
                        track != null
                            ? track.id == item.id
                                ? <MaterialIcons style={{width: 30, textAlign: "center", textAlignVertical: "center"}} name="play-arrow" color={textColor} size={20}/>
                                : <Text style={{width: 30, textAlign: "center", fontSize: 15, color: textColor}}>{index + 1}</Text>

                            : <Text style={{width: 30, textAlign: "center", fontSize: 15, color: textColor}}>{index + 1}</Text>
                    }

                    <Image style={{height: 50, width: 50, marginRight: 10}} source={{uri: item.artwork}}/>

                    <View style={{width: 0, flexGrow: 1, flex: 1}}>
                        <Text style={{color: textColor}} numberOfLines={2}>{item.title}</Text>
                        <Text style={{color: textColor}} numberOfLines={1}>{item.artist}</Text>
                    </View>
                </Pressable>
            }
        />
    </View>;

    return <BottomSheet
        ref={sheetRef}
        snapPoints={[minimumHeight, height - 150]}
        renderContent={renderContent}
        renderHeader={renderHeader}
    />
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: "stretch",
        justifyContent: "center"
    },

    panel: {
        flex: 1,
        backgroundColor: "transparent",
        position: "relative",
        alignSelf: "center",
        width: "100%",
        maxWidth: 800
    },

    panelHeader: {
        alignItems: "center",
        justifyContent: "center",
        height: 50,
        borderTopLeftRadius: 25,
        borderTopRightRadius: 25,
        paddingBottom: 10
    },

    textHeader: {
        fontSize: 28,
        color: "#FFF"
    }
});

const stylesRest = StyleSheet.create({
    playlistContainer: {
        width: "100%",
        paddingHorizontal: 10
    },

    topAlign: {
        alignSelf: "center",
        marginBottom: 10
    },

    smallBar: {
        height: 4,
        width: 30,
        borderRadius: 2,
        alignSelf: "center",
        marginTop: 10,
        marginBottom: 10
    }
});