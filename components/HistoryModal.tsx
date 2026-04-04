import React, { useEffect, useState } from 'react';
import {
  Modal,
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  ActivityIndicator,
  SafeAreaView,
} from 'react-native';
import { api, HistoryEntry } from '../services/api';

type Props = {
  sensorId: string | null;
  onClose: () => void;
};

function formatDateTime(iso: string): string {
  const d = new Date(iso);
  const date = d.toLocaleDateString('pt-BR', { day: '2-digit', month: '2-digit', year: 'numeric' });
  const time = d.toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit', second: '2-digit' });
  return `${date} ${time}`;
}

export function HistoryModal({ sensorId, onClose }: Props) {
  const [history, setHistory] = useState<HistoryEntry[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!sensorId) return;
    setLoading(true);
    setError(null);
    api
      .getSensorHistory(sensorId)
      .then((data) => setHistory(data))
      .catch(() => setError('Erro ao carregar histórico.'))
      .finally(() => setLoading(false));
  }, [sensorId]);

  return (
    <Modal visible={!!sensorId} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <SafeAreaView style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.headerTitle}>Histórico</Text>
            <Text style={styles.headerSub}>Sensor {sensorId}</Text>
          </View>
          <TouchableOpacity style={styles.closeBtn} onPress={onClose} activeOpacity={0.7}>
            <Text style={styles.closeBtnText}>Fechar</Text>
          </TouchableOpacity>
        </View>

        {/* Content */}
        {loading ? (
          <View style={styles.centered}>
            <ActivityIndicator size="large" color="#1D54D3" />
          </View>
        ) : error ? (
          <View style={styles.centered}>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : history.length === 0 ? (
          <View style={styles.centered}>
            <Text style={styles.emptyText}>Nenhum registro encontrado.</Text>
          </View>
        ) : (
          <FlatList
            data={history}
            keyExtractor={(item) => String(item.id)}
            contentContainerStyle={styles.listContent}
            ItemSeparatorComponent={() => <View style={styles.separator} />}
            renderItem={({ item }) => {
              const isFree = item.status === 'livre';
              return (
                <View style={styles.item}>
                  <View style={[styles.itemDot, isFree ? styles.itemDotFree : styles.itemDotOccupied]} />
                  <View style={styles.itemInfo}>
                    <View style={[styles.itemBadge, isFree ? styles.itemBadgeFree : styles.itemBadgeOccupied]}>
                      <Text style={[styles.itemBadgeText, isFree ? styles.itemBadgeTextFree : styles.itemBadgeTextOccupied]}>
                        {isFree ? 'LIVRE' : 'OCUPADA'}
                      </Text>
                    </View>
                    <Text style={styles.itemDate}>{formatDateTime(item.data)}</Text>
                  </View>
                  <Text style={styles.itemId}>#{item.id}</Text>
                </View>
              );
            }}
          />
        )}
      </SafeAreaView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
    backgroundColor: '#fff',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerSub: {
    fontSize: 13,
    color: '#94A3B8',
    marginTop: 2,
  },
  closeBtn: {
    backgroundColor: '#F1F5F9',
    borderRadius: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  closeBtnText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#64748B',
  },
  centered: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  errorText: {
    color: '#EF4444',
    fontSize: 15,
    textAlign: 'center',
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 15,
  },
  listContent: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#F1F5F9',
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    gap: 14,
  },
  itemDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    flexShrink: 0,
  },
  itemDotFree: { backgroundColor: '#10B981' },
  itemDotOccupied: { backgroundColor: '#EF4444' },
  itemInfo: {
    flex: 1,
    gap: 4,
  },
  itemBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 6,
  },
  itemBadgeFree: { backgroundColor: '#D1FAE5' },
  itemBadgeOccupied: { backgroundColor: '#FEE2E2' },
  itemBadgeText: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 0.5,
  },
  itemBadgeTextFree: { color: '#059669' },
  itemBadgeTextOccupied: { color: '#EF4444' },
  itemDate: {
    fontSize: 13,
    color: '#64748B',
  },
  itemId: {
    fontSize: 12,
    color: '#CBD5E1',
    fontWeight: '500',
  },
});
