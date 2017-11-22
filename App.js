import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { isUndefined, isFunction } from './javascript/utils'

import { NativeModules, NativeEventEmitter } from 'react-native';
import createOfflineRegion from './CreateOfflineRegion.js'
import offlineManager from './javascript/modules/offline/offlineManager.js'
const MapboxGL = NativeModules.MGLModule;

//MapboxGL.offlineManager.setTileCountLimit(10000);
Mapbox.setAccessToken('pk.eyJ1Ijoia3JlYmluIiwiYSI6ImNqOXRyN2NpNjAxbDUyeG9lcnVxNXV3aHYifQ.Co5xDA25ehe16YgaFk0t2w');

class HomeScreen extends React.Component {
    static navigationOptions = {
        title: 'Welcome'
    };
    render() {
        <offlineManager/>
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
    static navigationOptions = {
        title: 'Map',
    };


    render() {
        return (
            <View style={styles.container}>
                <Button
                    onPress={async () =>
                    {
                        const progressListener = (offlineRegion, status) => console.log(offlineRegion, status);
                        const errorListener = (offlineRegion, err) => console.log(offlineRegion, err);

                        const n = Math.random().toString();
                        alert('button pressed' + n)

                        let myObj = {
                            name: n,
                            styleURL: 'mapbox://...',
                            minZoom: 0,
                            maxZoom: 20,
                            bounds: [[20, 20], [20, 20]]
                        };
                        //myObj[name] = Math.random().toString();
                        await offlineManager.createPack( myObj, progressListener, errorListener)}}
                    title={"Download Map"}
                    style={{borderWidth: 1, borderColor: 'blue'}}
                />
                <Button
                    onPress={async () =>
                    {
                        alert('offline map pack')
                        const offlinePack = await MapboxGL.offlineManager.getPack('offlinePack')

                    }}
                    title={"Get offline pack"}
                    style={{borderWidth: 1, borderColor: 'blue'}}
                />
                <Mapbox.MapView
                    styleURL={Mapbox.StyleURL.Basic}
                    zoomLevel={15}
                    centerCoordinate={[11.256, 43.770]}
                    style={styles.container}>
                </Mapbox.MapView>
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