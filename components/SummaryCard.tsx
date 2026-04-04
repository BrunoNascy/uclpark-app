import React, { useEffect, useRef } from 'react';
import { View, Text, StyleSheet, Animated } from 'react-native';

type Props = {
  total: number;
  livres: number;
  ocupadas: number;
};

export function SummaryCard({ total, livres, ocupadas }: Props) {
  const percentage = total > 0 ? Math.round((livres / total) * 100) : 0;
  const animatedWidth = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    Animated.timing(animatedWidth, {
      toValue: percentage,
      duration: 600,
      useNativeDriver: false,
    }).start();
  }, [percentage]);

  const widthInterpolated = animatedWidth.interpolate({
    inputRange: [0, 100],
    outputRange: ['0%', '100%'],
  });

  return (
    <View style={styles.card}>
      {/* Header row */}
      <View style={styles.headerRow}>
        <Text style={styles.title}>Resumo de Vagas</Text>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Atualizado agora</Text>
        </View>
      </View>

      {/* Progress bar */}
      <View style={styles.progressTrack}>
        <Animated.View style={[styles.progressFill, { width: widthInterpolated }]} />
      </View>

      {/* Counts + Percentage */}
      <View style={styles.bottomRow}>
        <View style={styles.counts}>
          <View style={styles.countItem}>
            <View style={[styles.dot, styles.dotFree]} />
            <Text style={styles.countNumber}>{livres}</Text>
            <Text style={styles.countLabel}>Livres</Text>
          </View>
          <View style={styles.countItem}>
            <View style={[styles.dot, styles.dotOccupied]} />
            <Text style={styles.countNumber}>{ocupadas}</Text>
            <Text style={styles.countLabel}>Ocupadas</Text>
          </View>
        </View>
        <View style={styles.percentageBlock}>
          <Text style={styles.percentageValue}>{percentage}%</Text>
          <Text style={styles.percentageLabel}>disponível</Text>
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    marginHorizontal: 20,
    backgroundColor: '#fff',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#000',
    shadowOpacity: 0.07,
    shadowRadius: 20,
    shadowOffset: { width: 0, height: 8 },
    elevation: 4,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  title: {
    fontSize: 15,
    fontWeight: '600',
    color: '#475569',
  },
  badge: {
    backgroundColor: '#EFF6FF',
    borderRadius: 999,
    paddingHorizontal: 12,
    paddingVertical: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#2563EB',
  },
  progressTrack: {
    backgroundColor: '#F1F5F9',
    borderRadius: 999,
    height: 10,
    overflow: 'hidden',
    marginBottom: 16,
  },
  progressFill: {
    backgroundColor: '#10B981',
    height: '100%',
    borderRadius: 999,
  },
  bottomRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
  },
  counts: {
    flexDirection: 'row',
    gap: 20,
  },
  countItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  dot: {
    width: 12,
    height: 12,
    borderRadius: 6,
  },
  dotFree: { backgroundColor: '#10B981' },
  dotOccupied: { backgroundColor: '#EF4444' },
  countNumber: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  countLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  percentageBlock: {
    alignItems: 'flex-end',
  },
  percentageValue: {
    fontSize: 24,
    fontWeight: '700',
    color: '#1D54D3',
    lineHeight: 28,
  },
  percentageLabel: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '500',
  },
});
