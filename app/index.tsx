import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
  Platform,
} from 'react-native';
import Svg, { Path, Circle, Rect } from 'react-native-svg';

import { useParking, SpotData } from '../hooks/useParking';
import { SpotCard } from '../components/SpotCard';
import { SummaryCard } from '../components/SummaryCard';
import { HistoryModal } from '../components/HistoryModal';
import { AppIcon } from '../components/AppIcon';

type Filter = 'todas' | 'livres' | 'ocupadas';

// Bell icon (inline to avoid @expo/vector-icons dep)
function BellIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
      <Path d="M13.73 21a2 2 0 0 1-3.46 0" />
    </Svg>
  );
}

// Search icon (inline)
function SearchIcon() {
  return (
    <Svg width={20} height={20} viewBox="0 0 24 24" fill="none" stroke="#fff" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round">
      <Circle cx="11" cy="11" r="8" />
      <Path d="m21 21-4.35-4.35" />
    </Svg>
  );
}

export default function HomeScreen() {
  const { spots, loading, error } = useParking();
  const [filter, setFilter] = useState<Filter>('todas');
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);

  const livres = useMemo(() => spots.filter((s) => s.status === 'livre').length, [spots]);
  const ocupadas = useMemo(() => spots.filter((s) => s.status === 'ocupado').length, [spots]);

  const filteredSpots = useMemo<SpotData[]>(() => {
    if (filter === 'livres') return spots.filter((s) => s.status === 'livre');
    if (filter === 'ocupadas') return spots.filter((s) => s.status === 'ocupado');
    return spots;
  }, [spots, filter]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1D54D3" />

      {/* ── HEADER ── */}
      <SafeAreaView style={styles.headerSafeArea}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <AppIcon size={44} />
            <View style={styles.headerTitles}>
              <Text style={styles.appName}>ParkSpot</Text>
              <Text style={styles.appSub}>Estacionamento Central</Text>
            </View>
          </View>
          <View style={styles.headerActions}>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
              <SearchIcon />
            </TouchableOpacity>
            <TouchableOpacity style={styles.iconBtn} activeOpacity={0.7}>
              <BellIcon />
              <View style={styles.notifDot} />
            </TouchableOpacity>
          </View>
        </View>
      </SafeAreaView>

      {/* ── BODY (ScrollView starts behind header's bottom padding) ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Summary card overlaps the blue header */}
        <SummaryCard total={spots.length} livres={livres} ocupadas={ocupadas} />

        {/* Filters */}
        <View style={styles.filters}>
          {(['todas', 'livres', 'ocupadas'] as Filter[]).map((f) => (
            <TouchableOpacity
              key={f}
              onPress={() => setFilter(f)}
              style={[styles.filterBtn, filter === f && styles.filterBtnActive]}
              activeOpacity={0.75}
            >
              <Text style={[styles.filterText, filter === f && styles.filterTextActive]}>
                {f.charAt(0).toUpperCase() + f.slice(1)}
              </Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* List header */}
        <View style={styles.listHeader}>
          <Text style={styles.listTitle}>Lista de Vagas</Text>
          <Text style={styles.listCount}>{filteredSpots.length} vagas</Text>
        </View>

        {/* States: loading / error / list */}
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#1D54D3" />
            <Text style={styles.loadingText}>Conectando aos sensores…</Text>
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : filteredSpots.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Nenhuma vaga encontrada.</Text>
          </View>
        ) : (
          <View style={styles.list}>
            {filteredSpots.map((spot) => (
              <SpotCard
                key={spot.sensor_id}
                spot={spot}
                onPress={(s) => setSelectedSensor(s.sensor_id)}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* History modal */}
      <HistoryModal
        sensorId={selectedSensor}
        onClose={() => setSelectedSensor(null)}
      />
    </View>
  );
}

const HEADER_BOTTOM_PADDING = 72;
const CARD_OVERLAP = 56;

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  headerSafeArea: {
    backgroundColor: '#1D54D3',
  },
  header: {
    backgroundColor: '#1D54D3',
    paddingHorizontal: 24,
    paddingTop: 16,
    paddingBottom: HEADER_BOTTOM_PADDING,
    borderBottomLeftRadius: 32,
    borderBottomRightRadius: 32,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  headerTitles: {
    gap: 2,
  },
  appName: {
    color: '#fff',
    fontSize: 28,
    fontWeight: '700',
    letterSpacing: -0.5,
    lineHeight: 32,
  },
  appSub: {
    color: 'rgba(219,234,254,0.9)',
    fontSize: 13,
    fontWeight: '500',
  },
  headerActions: {
    flexDirection: 'row',
    gap: 8,
  },
  iconBtn: {
    backgroundColor: 'rgba(255,255,255,0.12)',
    borderRadius: 999,
    padding: 10,
  },
  notifDot: {
    position: 'absolute',
    top: 10,
    right: 10,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#F87171',
    borderWidth: 1.5,
    borderColor: '#1D54D3',
  },
  scroll: {
    flex: 1,
    marginTop: -CARD_OVERLAP,
  },
  scrollContent: {
    paddingBottom: 40,
  },
  filters: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    marginTop: 24,
    marginBottom: 8,
  },
  filterBtn: {
    paddingHorizontal: 20,
    paddingVertical: 9,
    borderRadius: 999,
    backgroundColor: '#F1F5F9',
  },
  filterBtnActive: {
    backgroundColor: '#1D54D3',
    shadowColor: '#1D54D3',
    shadowOpacity: 0.25,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 3,
  },
  filterText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#94A3B8',
  },
  filterTextActive: {
    color: '#fff',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginTop: 24,
    marginBottom: 16,
  },
  listTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  listCount: {
    fontSize: 14,
    fontWeight: '500',
    color: '#94A3B8',
  },
  list: {
    paddingHorizontal: 20,
    gap: 12,
  },
  centered: {
    paddingTop: 60,
    alignItems: 'center',
    gap: 12,
  },
  loadingText: {
    color: '#94A3B8',
    fontSize: 14,
  },
  errorText: {
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    paddingHorizontal: 32,
    lineHeight: 22,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
  },
});
