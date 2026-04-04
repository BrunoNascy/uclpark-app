import { useState, useEffect, useRef } from 'react';
import { api, SensorStatus } from '../services/api';

export type SpotData = SensorStatus & { ready: boolean };

export function useParking() {
  const [sensorIds, setSensorIds] = useState<string[]>([]);
  const [spots, setSpots] = useState<Record<string, SpotData>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // 1. Busca a lista de sensores uma única vez ao montar
  useEffect(() => {
    api
      .getSensors()
      .then((ids) => {
        setSensorIds(ids);
        const initial: Record<string, SpotData> = {};
        ids.forEach((id) => {
          initial[id] = { sensor_id: id, status: 'livre', data: '', ready: false };
        });
        setSpots(initial);
        setLoading(false);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        const stack = err instanceof Error ? err.stack : undefined;
        console.error('[useParking] getSensors falhou');
        console.error('  message:', message);
        console.error('  stack:', stack);
        console.error('  raw:', err);
        setError(`Erro ao conectar à API:\n${message}`);
        setLoading(false);
      });
  }, []);

  // 2. Polling de 1 s para cada sensor assim que a lista estiver disponível
  useEffect(() => {
    if (sensorIds.length === 0) return;

    const pollAll = () => {
      sensorIds.forEach((id) => {
        api
          .getSensorStatus(id)
          .then((status) => {
            setSpots((prev) => ({
              ...prev,
              [id]: { ...status, ready: true },
            }));
          })
          .catch((err: unknown) => {
            const message = err instanceof Error ? err.message : String(err);
            console.error(`[useParking] poll sensor ${id} falhou:`, message);
          });
      });
    };

    pollAll(); // primeira chamada imediata
    intervalRef.current = setInterval(pollAll, 1000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [sensorIds]);

  const sortedSpots = sensorIds
    .map((id) => spots[id])
    .filter(Boolean);

  return { spots: sortedSpots, loading, error };
}
