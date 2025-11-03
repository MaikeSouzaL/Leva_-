import { reverseGeocodeAsync, LocationObjectCoords } from "expo-location";
import { LocationAddress } from "./AddresLocation";

export async function getAddressLocationReverse({
  latitude,
  longitude,
}: LocationObjectCoords): Promise<LocationAddress | null> {
  try {
    const addressResponse = await reverseGeocodeAsync({ latitude, longitude });
    return addressResponse[0] || null;
  } catch (error) {
    console.error(error);
    return null;
  }
}
