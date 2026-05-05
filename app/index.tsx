import React, { useState, useMemo, useCallback } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  StatusBar,
  Modal,
  Pressable,
  Platform,
} from 'react-native';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { Feather } from '@expo/vector-icons';

import { useParking, SpotData } from '../hooks/useParking';
import { SpotCard } from '../components/SpotCard';
import { SummaryCard } from '../components/SummaryCard';
import { HistoryModal } from '../components/HistoryModal';
import { AppIcon } from '../components/AppIcon';

type Filter = 'todas' | 'livres' | 'ocupadas';

function BellIcon() {
  return <Feather name="bell" size={20} color="#fff" />;
}

function SearchIcon() {
  return <Feather name="search" size={20} color="#fff" />;
}

export default function HomeScreen() {
  const insets = useSafeAreaInsets();
  const { spots, loading, error, errorDetail } = useParking();
  const [filter, setFilter] = useState<Filter>('todas');
  const [selectedSensor, setSelectedSensor] = useState<string | null>(null);
  const [showErrorDetail, setShowErrorDetail] = useState(false);

  const livres = useMemo(() => spots.filter((s) => s.status === 'livre').length, [spots]);
  const ocupadas = useMemo(() => spots.filter((s) => s.status === 'ocupado').length, [spots]);

  const handleSpotPress = useCallback((s: SpotData) => setSelectedSensor(s.sensor_id), []);

  const filteredSpots = useMemo<SpotData[]>(() => {
    if (filter === 'livres') return spots.filter((s) => s.status === 'livre');
    if (filter === 'ocupadas') return spots.filter((s) => s.status === 'ocupado');
    return spots;
  }, [spots, filter]);

  return (
    <View style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor="#1D54D3" />

      {/* ── HEADER ── */}
      <View style={[styles.headerSafeArea, { paddingTop: insets.top }]}>
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <AppIcon size={44} />
            <View style={styles.headerTitles}>
              <Text style={styles.appName}>ParkControl</Text>
              <Text style={styles.appSub}>UCL</Text>
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
      </View>

      {/* ── BODY (ScrollView starts behind header's bottom padding) ── */}
      <ScrollView
        style={styles.scroll}
        contentContainerStyle={{ paddingBottom: insets.bottom + 40 }}
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
            <View style={styles.errorRow}>
              <Text style={styles.errorText}>{error}</Text>
              <TouchableOpacity
                style={styles.infoBtn}
                activeOpacity={0.7}
                onPress={() => setShowErrorDetail(true)}
              >
                <Feather name="info" size={16} color="#EF4444" />
              </TouchableOpacity>
            </View>
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
                onPress={handleSpotPress}
              />
            ))}
          </View>
        )}
      </ScrollView>

      {/* Error detail modal */}
      <Modal
        visible={showErrorDetail}
        transparent
        animationType="fade"
        onRequestClose={() => setShowErrorDetail(false)}
      >
        <Pressable style={styles.modalBackdrop} onPress={() => setShowErrorDetail(false)}>
          <Pressable style={styles.modalCard} onPress={() => {}}>
            <View style={styles.modalHeader}>
              <Feather name="alert-circle" size={18} color="#EF4444" />
              <Text style={styles.modalTitle}>Detalhes do Erro</Text>
              <TouchableOpacity onPress={() => setShowErrorDetail(false)}>
                <Feather name="x" size={18} color="#94A3B8" />
              </TouchableOpacity>
            </View>
            <ScrollView style={styles.modalBody} showsVerticalScrollIndicator={false}>
              <Text style={styles.modalLabel}>Mensagem</Text>
              <Text style={styles.modalMono}>{errorDetail?.message ?? error}</Text>
              {errorDetail?.stack ? (
                <>
                  <Text style={[styles.modalLabel, { marginTop: 16 }]}>Stack Trace</Text>
                  <Text style={styles.modalMono}>{errorDetail.stack}</Text>
                </>
              ) : null}
              <Text style={[styles.modalLabel, { marginTop: 16 }]}>Plataforma</Text>
              <Text style={styles.modalMono}>{Platform.OS} {Platform.Version}</Text>
            </ScrollView>
          </Pressable>
        </Pressable>
      </Modal>

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
  errorRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    gap: 8,
    paddingHorizontal: 32,
  },
  errorText: {
    flex: 1,
    color: '#EF4444',
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 22,
  },
  infoBtn: {
    marginTop: 3,
    padding: 4,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: 24,
  },
  modalCard: {
    backgroundColor: '#1E293B',
    borderRadius: 16,
    width: '100%',
    maxHeight: '80%',
    overflow: 'hidden',
  },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#334155',
  },
  modalTitle: {
    flex: 1,
    color: '#F1F5F9',
    fontSize: 15,
    fontWeight: '600',
  },
  modalBody: {
    padding: 16,
  },
  modalLabel: {
    color: '#94A3B8',
    fontSize: 11,
    fontWeight: '600',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
    marginBottom: 6,
  },
  modalMono: {
    color: '#E2E8F0',
    fontSize: 12,
    fontFamily: Platform.OS === 'ios' ? 'Menlo' : 'monospace',
    lineHeight: 18,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 14,
  },
});
