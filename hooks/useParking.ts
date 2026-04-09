import { useState, useEffect, useRef } from 'react';
import { api, SensorStatus } from '../services/api';

export type SpotData = SensorStatus & { ready: boolean };

export function useParking() {
  const [spots, setSpots] = useState<SpotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAll = () => {
    api
      .getAllStatus()
      .then((statuses) => {
        setSpots(statuses.map((s) => ({ ...s, ready: true })));
        setLoading(false);
      })
      .catch((err: unknown) => {
        const message = err instanceof Error ? err.message : String(err);
        console.error('[useParking] getAllStatus falhou:', message);
        setError(`Erro ao conectar à API:\n${message}`);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAll();
    intervalRef.current = setInterval(fetchAll, 5000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { spots, loading, error };
}
