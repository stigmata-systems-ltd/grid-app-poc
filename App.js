import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polygon } from 'react-native-maps';
import gridData from "./gridData";
import * as Location from 'expo-location';
import { MaterialIcons } from '@expo/vector-icons';

export default class App extends React.Component {
  constructor() {
    super()
    this.state = {
      initialRegion: {},
      currLoc: null,
      gridData: [],
    }
  }
  componentDidMount = async () => {
    Location.requestPermissionsAsync();
    let { status } = await Location.requestPermissionsAsync();
    if (status !== 'granted') {
      setErrorMsg('Permission to access location was denied');
    }
    let initialLoc = await Location.getCurrentPositionAsync({})
    console.log("init", initialLoc);
    this.setState({ gridData: gridData(initialLoc.coords.latitude, initialLoc.coords.longitude) });
    this.setState({
      initialRegion: this.getDeltas(initialLoc.coords.latitude, initialLoc.coords.longitude)
    });
    let location = await Location.watchPositionAsync(
      {
        accuracy: Location.Accuracy.Highest,
        distanceInterval: 1,
        timeInterval: 200
      },
      (loc) => {
        this.setState({ currLoc: loc });
      });
  }

  getDeltas = (lat, lng, distance=5) => {
    const oneDegreeOfLatitudeInMeters = 111.32 * 1000;

    const latitudeDelta = distance / oneDegreeOfLatitudeInMeters;
    const longitudeDelta = distance / (oneDegreeOfLatitudeInMeters * Math.cos(lat * (Math.PI / 180)));

    return {
      latitude: lat,
      longitude: lng,
      latitudeDelta,
      longitudeDelta,
    }
  }
  componentWillUnmount = () => {

  }
  render() {
    return (
      <>
        <StatusBar style="auto" />
        {/* Adding Provider prop for IOS support */}
        <MapView
          region={this.state.initialRegion}
          style={styles.mapView}
          provider={PROVIDER_GOOGLE}
        >
          {this.state.currLoc !== null &&
            <Marker
              key={"test"}
              coordinate={{
                latitude: this.state.currLoc.coords.latitude,
                longitude: this.state.currLoc.coords.longitude
              }}
              title={"My Location"}
              description={"Location Test"}
            >
              <MaterialIcons name="my-location" size={30} color="green" />
            </Marker>
          }
          {this.state.gridData.length > 0 && this.state.gridData.map(marker => {
            return (
              <>
                <Polygon
                  key={"grid" + marker.lng}
                  coordinates={marker.rectCords}
                />
                <Marker
                  key={"marker" + marker.lat}
                  coordinate={{
                    latitude: marker.lat,
                    longitude: marker.lng
                  }}
                  title={marker.title}
                  description={marker.description}
                />
              </>
            )
          })}
        </MapView>
        {this.state.currLoc !== null &&
          <Text>Location: {this.state.currLoc.coords.latitude}, {this.state.currLoc.coords.longitude}</Text>
        }
      </>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapView: {
    height: "95%"
  }
});
