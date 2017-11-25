import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import t from 'tcomb-form-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import geoViewport from '@mapbox/geo-viewport';

import { NativeModules, NativeEventEmitter } from 'react-native';
import CreateOfflineRegion from './CreateOfflineRegion.js'

Mapbox.setAccessToken('pk.eyJ1Ijoia3JlYmluIiwiYSI6ImNqOXRyN2NpNjAxbDUyeG9lcnVxNXV3aHYifQ.Co5xDA25ehe16YgaFk0t2w');
MapboxGL.offlineManager.setTileCountLimit(100000);

const Form = t.form.Form;

const Pack = t.struct({
    packName: t.String,
    longitude: t.Number,
    latitude: t.Number
});

class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome'
    };
    render() {
        const { navigate } = this.props.navigation;
        return (
            <View>
                <Text>Hello, Navigation!</Text>
                <Button
                    onPress={() => navigate('Map')}
                    title="Map"
                />
            </View>
        );
    }
}

class MapScreen extends React.Component {
    constructor(props) {
        super(props);
        this.state = {filling: false};
    }

    static navigationOptions = {
        title: 'Map',
    };

    handleSubmit = () => {
        this.setState(previousState => {
            return { filling: !previousState.filling };
        })}

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>
                {this.state.filling !== true ? (
                    <View style = {{ flex:1 }}>
                        <Button
                            onPress={() =>
                                        {
                                            this.handleSubmit()
                                        }
                                    }
                            title = "Download Pack"
                        />
                        <Mapbox.MapView
                            styleURL={Mapbox.StyleURL.Street}
                            zoomLevel={15}
                            centerCoordinate={[11.256, 43.770]}
                            style={styles.container}>
                        </Mapbox.MapView>
                    </View>
                    ):(
                        <View style = {{ flex:1 }}>
                            <Form
                                ref = {c => this._form = c}
                                type = {Pack}
                            />
                            <Button
                                title = "Download"
                                onPress={() =>
                                            {
                                                this.handleSubmit()
                                                const input = this._form.getValue();
                                                const name = input.packName;
                                                const longitude = input.longitude;
                                                const latitude = input.latitude;
                                                this.refs.create.createPack(name, longitude, latitude);
                                            }
                                        }
                            />
                            <Button
                                title = "Cancel"
                                onPress={() => this.handleSubmit()}
                            />
                        </View>)}
                <View>
                    <CreateOfflineRegion ref = "create"/>
                </View>
            </View>

        );
    }
}

export default class App extends React.Component {
    render() {
        return <TestApp />;
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    }
});

export const TestApp = StackNavigator({
    Home: { screen: HomeScreen },
    Map: { screen: MapScreen },
});


