import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { isUndefined, isFunction } from './javascript/utils'

import { NativeModules, NativeEventEmitter } from 'react-native';
import createOfflineRegion from './CreateOfflineRegion.js'
import offlineManager from './javascript/modules/offline/offlineManager.js'

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
                <Button
                    onPress={() => navigate('Map2')}
                    title="Map2"
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

class MapScreen2 extends React.Component {
    static navigationOptions = {
        title: 'Map2',
    };


    render() {
        return (
            <CreateOfflineRegion/>
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
    Map2: { screen: MapScreen2}
});























import {TouchableOpacity, Dimensions} from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import geoViewport from '@mapbox/geo-viewport';

import BaseExamplePropTypes from './common/BaseExamplePropTypes';
import Page from './common/Page';
import Bubble from './common/Bubble';
import sheet from './styles/sheet';

MapboxGL.offlineManager.setTileCountLimit(10000);
const CENTER_COORD = [-117.161087, 32.751736];
const CENTER_COORD_LONDON = [51.5074, 0.1278];
const MAPBOX_VECTOR_TILE_SIZE = 512;

const styless = StyleSheet.create({
    percentageText: {
        padding: 8,
        textAlign: 'center',
    },
    buttonCnt: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    button: {
        flex: 0.4,
        alignItems: 'center',
        justifyContent: 'center',
        borderRadius: 3,
        backgroundColor: 'blue',
        padding: 8,
    },
    buttonTxt: {
        color: 'white',
    },
});

class CreateOfflineRegion extends React.Component {
    static propTypes = {
        ...BaseExamplePropTypes,
    };

    constructor (props) {
        super(props);

        this.state = {
            name: `test-${Date.now()}`,
            percentage: 0,
            offlineRegion: null,
        };

        this.onDownloadProgress = this.onDownloadProgress.bind(this);
        this.onDidFinishLoadingStyle = this.onDidFinishLoadingStyle.bind(this);

        this.onResume = this.onResume.bind(this);
        this.onPause = this.onPause.bind(this);
    }

    componentWillUnmount () {
        // avoid setState warnings if we back out before we finishing downloading
        MapboxGL.offlineManager.deletePack(this.state.name);
        MapboxGL.offlineManager.unsubscribe('test');
    }


    async onDidFinishLoadingStyle () {
        const { width, height } = Dimensions.get('window');
        const bounds = geoViewport.bounds(CENTER_COORD_LONDON, 12, [width, height], MAPBOX_VECTOR_TILE_SIZE);

        const options = {
            name: this.state.name,
            styleURL: MapboxGL.StyleURL.Street,
            bounds: [[bounds[0], bounds[1]], [bounds[2], bounds[3]]],
            minZoom: 0,
            maxZoom: 20,
        };

        // start download
        MapboxGL.offlineManager.createPack(
            options,
            this.onDownloadProgress,
        );
    }

    onDownloadProgress (offlineRegion, downloadStatus) {
        // the iOS SDK will return 0 on the first event of a resume offline pack download
        if (this.state.percentage > downloadStatus.percentage) {
            return;
        }
        this.setState({
            name: offlineRegion.name,
            percentage: downloadStatus.percentage,
            offlineRegion: offlineRegion,
        });
    }

    onResume () {
        if (this.state.offlineRegion) {
            this.state.offlineRegion.resume();
        }
    }

    onPause () {
        if (this.state.offlineRegion) {
            this.state.offlineRegion.pause();
        }
    }

    _formatPercent () {
        if (!this.state.percentage) {
            return '0%';
        }
        return `${(''+this.state.percentage).split('.')[0]}%`;
    }

    render () {
        return (
            <Page {...this.props}>
                <MapboxGL.MapView
                    zoomLevel={10}
                    ref={(c) => this._map = c}
                    onPress={this.onPress}
                    onDidFinishLoadingMap={this.onDidFinishLoadingStyle}
                    centerCoordinate={CENTER_COORD_LONDON}
                    style={sheet.matchParent} />

                {this.state.name !== null ? (
                    <Bubble>
                        <View style={{ flex : 1 }}>

                            <Text style={styless.percentageText}>
                                Offline pack {this.state.name} is at {this._formatPercent()}
                            </Text>

                            <View style={styless.buttonCnt}>
                                <TouchableOpacity onPress={this.onResume}>
                                    <View style={styless.button}>
                                        <Text style={styless.buttonTxt}>Resume</Text>
                                    </View>
                                </TouchableOpacity>

                                <TouchableOpacity onPress={this.onPause}>
                                    <View style={styless.button}>
                                        <Text style={styless.buttonTxt}>Pause</Text>
                                    </View>
                                </TouchableOpacity>
                            </View>
                        </View>
                    </Bubble>
                ) : null}
            </Page>
        );
    }
}

