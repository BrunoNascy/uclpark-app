import React, { memo } from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { SideCarIcon } from './SideCarIcon';
import { SpotData } from '../hooks/useParking';

type Props = {
  spot: SpotData;
  onPress: (spot: SpotData) => void;
};

function formatTime(iso: string): string {
  if (!iso) return '';
  const d = new Date(iso);
  const h = d.getHours().toString().padStart(2, '0');
  const m = d.getMinutes().toString().padStart(2, '0');
  return `${h}:${m}`;
}

export const SpotCard = memo(function SpotCard({ spot, onPress }: Props) {
  const isFree = spot.status === 'livre';

  return (
    <TouchableOpacity
      style={styles.card}
      onPress={() => onPress(spot)}
      activeOpacity={0.75}
    >
      {/* Icon container */}
      <View style={[styles.iconWrapper, isFree ? styles.iconWrapperFree : styles.iconWrapperOccupied]}>
        <SideCarIcon
          size={28}
          color={isFree ? '#10B981' : '#EF4444'}
        />
      </View>

      {/* Info */}
      <View style={styles.info}>
        <View style={styles.titleRow}>
          <Text style={styles.spotId}>Vaga {spot.sensor_id}</Text>
          <Text style={styles.location}>Sensor</Text>
        </View>
        <View style={styles.badgeRow}>
          <View style={[styles.badge, isFree ? styles.badgeFree : styles.badgeOccupied]}>
            <Text style={[styles.badgeText, isFree ? styles.badgeTextFree : styles.badgeTextOccupied]}>
              {isFree ? 'LIVRE' : 'OCUPADA'}
            </Text>
          </View>
          {!isFree && spot.data ? (
            <Text style={styles.since}>desde {formatTime(spot.data)}</Text>
          ) : null}
        </View>
      </View>

      {/* Status dot */}
      <View style={[styles.dot, isFree ? styles.dotFree : styles.dotOccupied]} />
    </TouchableOpacity>
  );
});

const styles = StyleSheet.create({
  card: {
    backgroundColor: '#fff',
    borderRadius: 20,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#F1F5F9',
    shadowColor: '#000',
    shadowOpacity: 0.03,
    shadowRadius: 6,
    shadowOffset: { width: 0, height: 2 },
    elevation: 1,
  },
  iconWrapper: {
    padding: 14,
    borderRadius: 14,
    marginRight: 16,
  },
  iconWrapperFree: {
    backgroundColor: '#ECFDF5',
  },
  iconWrapperOccupied: {
    backgroundColor: '#FEF2F2',
  },
  info: {
    flex: 1,
  },
  titleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  spotId: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
  },
  location: {
    fontSize: 13,
    color: '#94A3B8',
    fontWeight: '500',
  },
  badgeRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
    gap: 8,
  },
  badge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  badgeFree: {
    backgroundColor: '#D1FAE5',
  },
  badgeOccupied: {
    backgroundColor: '#FEE2E2',
  },
  badgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  badgeTextFree: {
    color: '#059669',
  },
  badgeTextOccupied: {
    color: '#EF4444',
  },
  since: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
  dot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    marginLeft: 8,
  },
  dotFree: {
    backgroundColor: '#10B981',
  },
  dotOccupied: {
    backgroundColor: '#EF4444',
  },
});
