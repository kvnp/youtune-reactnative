import React from "react";
import {
    View,
    ScrollView,
    Text,
    ImageBackground,
    TouchableOpacity
} from "react-native";

import Shelf from "../../components/shared/Shelf";
import LinearGradient from "react-native-linear-gradient";
import { bottomBarStyle, artistGradient } from "../../styles/BottomBar";
import { resultHomeStyle } from "../../styles/Home";

export default function ArtistView({route, navigation}) {
    const { shelves } = route.params;
    const { title, subscriptions, thumbnail } = route.params.header;

    return (
        <>
            <ScrollView>
                <Text style={resultHomeStyle.homeText}>{title}</Text>
                {
                    shelves.map(
                        (shelf) => {
                            return <Shelf navigation={navigation} shelf={shelf}/>
                        }
                    )
                }
            </ScrollView>
            <ImageBackground style={bottomBarStyle.container} source={{uri: thumbnail}}>
                <LinearGradient style={bottomBarStyle.artistGradientStyle} colors={artistGradient}>
                    <View style={bottomBarStyle.centerContainer}>
                        <View style={bottomBarStyle.topRow}>
                            <View style={bottomBarStyle.topLeftPadding}/>
                            <View style={bottomBarStyle.artistColumn}>
                                <Text style={bottomBarStyle.artistName}>{title}</Text>
                                <TouchableOpacity>
                                    <Text style={bottomBarStyle.subscribeArtist}>ABONNIEREN {subscriptions}</Text>
                                </TouchableOpacity>
                            </View>
                            <TouchableOpacity style={bottomBarStyle.closeButton}
                                            onPress={() => {navigation.pop()}}>
                                <Text style={[bottomBarStyle.buttonText, bottomBarStyle.closeButtonText]}>X</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={bottomBarStyle.buttonView}>
                            <TouchableOpacity style={bottomBarStyle.button}>
                                <Text style={bottomBarStyle.buttonText}>WIEDERGEBEN</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={bottomBarStyle.button}>
                                <Text style={bottomBarStyle.buttonText}>ZUR MEDIATHEK</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={bottomBarStyle.button}>
                                <Text style={bottomBarStyle.buttonText}>TEILEN</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </LinearGradient>
            </ImageBackground>
        </>
    )
}