import { StatusBar } from 'expo-status-bar';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { PROVIDER_GOOGLE, Marker, Polygon } from 'react-native-maps';
import gridData from "./gridData";
import * as Location from 'expo-location';

export default function App() {
  const initialRegion = {
    latitude: 12.994112,
    longitude: 80.1686781,
    latitudeDelta: 0.0922,
    longitudeDelta: 0.0421,
  }

  return (
    <>
      <StatusBar style="auto" />
      {/* Adding Provider prop for IOS support */}
      <MapView
        region={initialRegion}
        style={styles.mapView}
        provider={PROVIDER_GOOGLE}
      >

        {gridData.map(marker => {
          return (
            <>
              <Polygon
                key={"1"}
                coordinates={marker.rectCords}
              />
              <Marker
                key={marker.lat}
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
    </>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
  mapView: {
    height: "100%"
  }
});
