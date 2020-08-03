import React, { PureComponent } from 'react';

import {
    Text,
    Pressable,
    FlatList,
    View,
    ActivityIndicator
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
            shelves: [],
            loading: false,
        }
    }

    componentDidMount() {
        this._unsubscribe = this.props.navigation.addListener('focus', () => {
            global.setHeader({title: "Home"});
        });
    }
    
    componentWillUnmount() {
        this._unsubscribe();
    }

    startRefresh = () => {
        this.setState({loading: true})
        fetchHome().then((result) => {
            if (result.background != undefined)
                this.setImage(result.background);

            this.setState({
                shelves: result.shelves,
                loading: false
            });
        });
    }

    setImage = (source) => {
        global.setHeader({image: source});
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

                    :   <>
                        <Text style={[preResultHomeStyle.preHomeBottomText, preResultHomeStyle.preHomeTopText]}>🏠</Text>
                        <Text style={preResultHomeStyle.preHomeBottomText}>Pull down to load</Text>
                        </>
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