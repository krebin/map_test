import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Mapbox from '@mapbox/react-native-mapbox-gl';
import { FormLabel, FormInput, FormValidationMessage } from 'react-native-elements'

import { NativeModules, NativeEventEmitter } from 'react-native';
import CreateOfflineRegion from './CreateOfflineRegion.js'

Mapbox.setAccessToken('pk.eyJ1Ijoia3JlYmluIiwiYSI6ImNqOXRyN2NpNjAxbDUyeG9lcnVxNXV3aHYifQ.Co5xDA25ehe16YgaFk0t2w');

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
    static navigationOptions = {
        title: 'Map',
    };

    render() {
        const { navigate } = this.props.navigation;
        return (
            <View style={{ flex: 1 }}>
                <Button
                    onPress={() => navigate('Form')}
                    title="Download Pack"
                />
                <CreateOfflineRegion/>
            </View>
        );
    }
}

class FormScreen extends React.Component {
    static navigationOptions = {
        title: 'Form',
    };

    render() {
        return (
            <View>
                <FormLabel>Pack Name</FormLabel>
                <FormInput/>
                <FormValidationMessage>This field is required</FormValidationMessage>
                <FormLabel>Longitude</FormLabel>
                <FormInput/>
                <FormValidationMessage>This field is required</FormValidationMessage>
                <FormLabel>Latitude</FormLabel>
                <FormInput/>
                <FormValidationMessage>This field is required</FormValidationMessage>
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
    Form: { screen: FormScreen }
});


