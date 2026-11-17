export const OFFICE_COORDINATES = {
  latitude: 14.435987,
  longitude: 79.991139,
};

export function getDistanceFromOfficeMeters(latitude: number, longitude: number): number {
  const earthRadiusMeters = 6_371_000;
  const toRadians = (degrees: number) => (degrees * Math.PI) / 180;
  const latitudeDifference = toRadians(latitude - OFFICE_COORDINATES.latitude);
  const longitudeDifference = toRadians(longitude - OFFICE_COORDINATES.longitude);
  const officeLatitude = toRadians(OFFICE_COORDINATES.latitude);
  const employeeLatitude = toRadians(latitude);
  const haversine =
    Math.sin(latitudeDifference / 2) ** 2
    + Math.cos(officeLatitude) * Math.cos(employeeLatitude) * Math.sin(longitudeDifference / 2) ** 2;

  return earthRadiusMeters * 2 * Math.atan2(Math.sqrt(haversine), Math.sqrt(1 - haversine));
}

export function formatDistance(meters: number): string {
  return meters >= 1000
    ? `${(meters / 1000).toFixed(2)} km`
    : `${Math.round(meters)} m`;
}
