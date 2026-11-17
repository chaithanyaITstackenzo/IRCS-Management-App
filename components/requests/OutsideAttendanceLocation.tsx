import React from 'react';
import { Linking, Platform, Pressable, View } from 'react-native';
import * as Location from 'expo-location';
import { useQuery } from '@tanstack/react-query';
import Toast from 'react-native-toast-message';
import { ThemedText } from '@/components/ui/ThemedText';
import { useThemeColor } from '@/hooks/use-theme-color';
import { Spacing } from '@/constants/spacing';
import { formatDistance, getDistanceFromOfficeMeters } from '@/utils/location';
import { AttendanceRequest } from '@/types/request';

type RequestLocation = NonNullable<AttendanceRequest['location']>;

function getPlaceName(address: Location.LocationGeocodedAddress | undefined): string | null {
  if (!address) return null;
  const placeName = [
    address.name,
    address.street && [address.streetNumber, address.street].filter(Boolean).join(' '),
    address.district,
    address.city,
    address.region,
    address.country,
  ].filter((part): part is string => !!part?.trim());
  const uniquePlaceName = [...new Set(placeName)];
  return uniquePlaceName.length ? uniquePlaceName.join(', ') : address.formattedAddress;
}

export function OutsideAttendanceLocation({ location }: { location: RequestLocation | null | undefined }) {
  const warning = useThemeColor({}, 'warning');
  const primary = useThemeColor({}, 'primary');
  const hasCoordinates = !!location
    && Number.isFinite(location.latitude)
    && Number.isFinite(location.longitude);
  const latitude = location?.latitude;
  const longitude = location?.longitude;
  const placeQuery = useQuery({
    queryKey: ['reverse-geocoded-location', latitude, longitude],
    queryFn: async () => {
      if (latitude === undefined || longitude === undefined) return null;
      const addresses = await Location.reverseGeocodeAsync({ latitude, longitude });
      return getPlaceName(addresses[0]);
    },
    enabled: hasCoordinates && Platform.OS !== 'web',
    retry: false,
    staleTime: 1000 * 60 * 60 * 24,
  });
  const openMap = async () => {
    if (latitude === undefined || longitude === undefined) return;
    const url = `https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`;
    try {
      await Linking.openURL(url);
    } catch {
      Toast.show({ type: 'error', text1: 'Unable to open Google Maps', text2: 'Check that a browser or maps app is available.' });
    }
  };

  return (
    <View style={{ gap: Spacing.xs }}>
      <ThemedText variant="caption" muted>
        Location: {!hasCoordinates
          ? 'GPS coordinates unavailable'
          : placeQuery.isLoading
            ? 'Finding location…'
            : placeQuery.isError
              ? 'Place name lookup failed'
              : placeQuery.data ?? 'Place name unavailable'}
      </ThemedText>
      {hasCoordinates && latitude !== undefined && longitude !== undefined ? (
        <>
          <ThemedText variant="caption" muted>
            Coordinates: {latitude.toFixed(6)}, {longitude.toFixed(6)}
          </ThemedText>
          <ThemedText variant="caption" style={{ color: warning }}>
            Approx. distance from office: {formatDistance(getDistanceFromOfficeMeters(latitude, longitude))}
          </ThemedText>
          <Pressable onPress={openMap} accessibilityRole="link">
            <ThemedText variant="caption" style={{ color: primary }}>
              Open in Google Maps
            </ThemedText>
          </Pressable>
        </>
      ) : null}
    </View>
  );
}
