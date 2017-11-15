import React from 'react';
import { StyleSheet, Text, View, Button } from 'react-native';
import { StackNavigator } from 'react-navigation';
import Mapbox from '@mapbox/react-native-mapbox-gl';

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
        return (
            <View style={styles.container}>
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