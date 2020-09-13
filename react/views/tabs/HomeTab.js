import React, { PureComponent } from 'react';

import {
    Text,
    Pressable,
    FlatList,
    View,
    ActivityIndicator,
    Platform
} from 'react-native';

import { fetchHome } from "../../modules/remote/API";

import Shelf from '../../components/shared/Shelf';
import MiniPlayer from '../../components/player/MiniPlayer';

import { appColor } from '../../styles/App';
import { shelvesStyle } from '../../styles/Shelves';
import { refreshStyle, preResultHomeStyle } from '../../styles/Home';

export default class HomeTab extends PureComponent {
    constructor(props) {
        super(props);
        this.state = {
            modalVisible: false,
            shelves: [],
            loading: false,
        }
    }

    setModalVisible = (boolean) => {
        this.setState({modalVisible: boolean});
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            global.setHeader({title: "Home"});
        });

        this.startRefresh();
    }
    
    componentWillUnmount() {
        this._unsubscribe();
    }

    startRefresh = async() => {
        this.setState({loading: true});
        let result = await fetchHome();

        if (result.background != undefined)
            global.setHeader({image: result.background});

        this.setState({
            shelves: result.shelves,
            loading: false
        });
    }

    render() {
        return (
            <>
            <FlatList
                style={shelvesStyle.scrollView}
                contentContainerStyle={shelvesStyle.scrollContainer}

                ListEmptyComponent={
                    this.state.loading
                    ?   <View style={[shelvesStyle.scrollView, shelvesStyle.scrollContainer]}>
                            <ActivityIndicator size="large"/>
                        </View>

                    :   <Pressable onPress={Platform.OS == "web" ?this.startRefresh :null}>
                            <Text style={[preResultHomeStyle.preHomeBottomText, preResultHomeStyle.preHomeTopText]}>🏠</Text>
                            <Text style={preResultHomeStyle.preHomeBottomText}>{Platform.OS =="web" ?"Press the home icon to load" :"Pull down to load"}</Text>
                        </Pressable>
                }

                ListFooterComponent={
                    <Pressable onPress={() => this.startRefresh()} style={refreshStyle.button}>
                        <Text style={refreshStyle.buttonText}>Aktualisieren</Text>
                    </Pressable>
                }

                progressViewOffset={0}

                renderItem={({item}) => <Shelf shelf={item} navigation={this.props.navigation}/>}

                refreshing={this.state.loading}
                onRefresh={this.startRefresh}

                ListFooterComponentStyle={
                    this.state.shelves.length == 0 
                    ? {display: "none"}
                    : {paddingBottom: 20}
                }

                data={this.state.shelves}
                keyExtractor={item => item.title}
            />
            <MiniPlayer navigation={this.props.navigation} style={appColor.background}/>
            </>
        );
    }
};