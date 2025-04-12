import * as Location from 'expo-location';
import { Dispatch, SetStateAction } from 'react';

export const setCurrentLocationIfAvailable = async (
  setLocation: Dispatch<SetStateAction<Location.LocationObjectCoords>>,
  setIsLocationUnavailable: Dispatch<SetStateAction<boolean>>
) => {
  let { status } = await Location.requestForegroundPermissionsAsync();
  if (status !== 'granted') {
    setIsLocationUnavailable(true);
    return;
  }

  try {
    const currentLocation = await Location.getCurrentPositionAsync({});
    setLocation(currentLocation.coords);
  } catch (_e) {
    setIsLocationUnavailable(true);
  }
};
