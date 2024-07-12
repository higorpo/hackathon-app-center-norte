import { StyleSheet } from 'react-native';

import { ThemedText } from '@/components/ThemedText';
import { ThemedView } from '@/components/ThemedView';
import * as Location from 'expo-location';
import { useEffect, useState } from 'react';
import MapView, { UrlTile } from 'react-native-maps';

export default function Page() {
  const [location, setLocation] = useState<Location.LocationObject | null>(null);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  useEffect(() => {
    (async () => {
      let { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setErrorMsg('Permission to access location was denied');
        return;
      }

      let location = await Location.getCurrentPositionAsync({});
      setLocation(location);

      Location.watchPositionAsync(
        {
          accuracy: Location.Accuracy.BestForNavigation,
          timeInterval: 5000,
          distanceInterval: 0,
        },
        (newLocation) => {
          setLocation(newLocation);
        }
      );
    })();
  }, []);

  if (!location) {
    return <ThemedView style={styles.mainContainer}><ThemedText>Loading...</ThemedText></ThemedView>;
  }

  return (
    <ThemedView style={styles.mainContainer}>
      <ThemedView style={styles.titleContainer}>
        <ThemedText type="title">Demonstração de coleta geolocalização</ThemedText>
        <ThemedText type="default">Esse app demonstra a captura da localização do usuário para o hackathon Viva Center Norte.</ThemedText>
        <ThemedText style={{ marginTop: 10 }}>
          X: {location.coords.latitude} Y: {location.coords.longitude}
        </ThemedText>
      </ThemedView>
      <MapView
        style={styles.map}
        initialRegion={{
          latitude: location.coords.latitude,
          longitude: location.coords.longitude,
          latitudeDelta: 0.0001,
          longitudeDelta: 0.0001,
        }}
        showsUserLocation={true}
      >
        <UrlTile
          urlTemplate="http://c.tile.openstreetmap.org/{z}/{x}/{y}.png"
          maximumZ={19}
        />
      </MapView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 60,
  },
  titleContainer: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  map: {
    flex: 1,
  }
});
