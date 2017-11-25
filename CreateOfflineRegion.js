import React from 'react';
import { Text, View, TouchableOpacity, Dimensions, StyleSheet, Button } from 'react-native';
import MapboxGL from '@mapbox/react-native-mapbox-gl';
import geoViewport from '@mapbox/geo-viewport';

import BaseExamplePropTypes from './common/BaseExamplePropTypes';
import Page from './common/Page';
import Bubble from './common/Bubble';
import sheet from './styles/sheet';

const CENTER_COORD = [-73.970895, 40.723279];
const MAPBOX_VECTOR_TILE_SIZE = 512;

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
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

export default class CreateOfflineRegion extends React.Component {


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
        const bounds = geoViewport.bounds(CENTER_COORD, 12, [1, 1], MAPBOX_VECTOR_TILE_SIZE);

        const options = {
            name: this.state.name,
            styleURL: MapboxGL.StyleURL.Street,
            bounds: [[bounds[0], bounds[1]], [bounds[2], bounds[3]]],
            minZoom: 10,
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
            <View style={styles.container}>
                    onDidFinishLoadingMap={this.onDidFinishLoadingStyle}
                    {this.state.name !== null ? (
                        <Bubble>
                            <View style={{ flex : 1 }}>

                                <Text style={styles.percentageText}>
                                    Offline pack {this.state.name} is at {this._formatPercent()}
                                </Text>

                                <View style={styles.buttonCnt}>
                                    <TouchableOpacity onPress={this.onResume}>
                                        <View style={styles.button}>
                                            <Text style={styles.buttonTxt}>Resume</Text>
                                        </View>
                                    </TouchableOpacity>

                                    <TouchableOpacity onPress={this.onPause}>
                                        <View style={styles.button}>
                                            <Text style={styles.buttonTxt}>Pause</Text>
                                        </View>
                                    </TouchableOpacity>
                                </View>
                            </View>
                        </Bubble>
                    ) : null}
            </View>
        );
    }
}

//module.exports = CreateOfflineRegion;