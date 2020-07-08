import React, { PureComponent } from 'react';

import {
    Text,
    TouchableOpacity,
    FlatList,
    View
} from 'react-native';

import { refreshStyle, preResultHomeStyle } from '../../styles/Home';
import { fetchHome } from "../../modules/API";
import { shelvesStyle } from '../../styles/Shelves';
import Shelf from '../../components/shared/Shelf';

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
            if (result.background != undefined) {
                this.setImage(result.background);
                this.setState({shelves: result.shelves});
            }

            this.setState({loading: false});
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
                        <View>
                            <Text style={[preResultHomeStyle.preHomeBottomText, preResultHomeStyle.preHomeTopText]}>🏠</Text>
                            <Text style={preResultHomeStyle.preHomeBottomText}>Pull down to load</Text>
                        </View>
                    }

                    ListFooterComponent={
                        <TouchableOpacity onPress={() => this.startRefresh()} style={refreshStyle.button}>
                            <Text style={refreshStyle.buttonText}>Aktualisieren</Text>
                        </TouchableOpacity>
                    }

                    progressViewOffset={20}

                    renderItem={
                        ({item}) => <Shelf shelf={item} navigation={this.props.navigation}/>
                    }

                    refreshing={this.state.loading}
                    onRefresh={() => {
                        this.startRefresh();
                    }}

                    ListFooterComponentStyle={
                        this.state.shelves.length == 0 ? {
                            display: "none"
                        }: {
                            paddingBottom: 20
                        }
                    }

                    data={this.state.shelves}
                    keyExtractor={item => item.title}
                />
            </>
        );
    }
};