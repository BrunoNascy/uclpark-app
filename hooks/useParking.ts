import { useState, useEffect, useRef } from 'react';
import { api, SensorStatus } from '../services/api';

export type SpotData = SensorStatus & { ready: boolean };

export function useParking() {
  const [spots, setSpots] = useState<SpotData[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [errorDetail, setErrorDetail] = useState<Error | null>(null);
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const fetchAll = () => {
    api
      .getAllStatus()
      .then((statuses) => {
        setSpots((prev) => {
          const prevMap = new Map(prev.map((s) => [s.sensor_id, s]));
          let changed = prev.length !== statuses.length;
          const next = statuses.map((s) => {
            const existing = prevMap.get(s.sensor_id);
            if (existing && existing.status === s.status && existing.data === s.data) {
              return existing; // mesma referência → sem re-render
            }
            changed = true;
            return { ...s, ready: true };
          });
          return changed ? next : prev;
        });
        setLoading(false);
      })
      .catch((err: unknown) => {
        const errObj = err instanceof Error ? err : new Error(String(err));
        console.error('[useParking] getAllStatus falhou:', errObj.message);
        setError(`Erro ao conectar à API:\n${errObj.message}`);
        setErrorDetail(errObj);
        setLoading(false);
      });
  };

  useEffect(() => {
    fetchAll();
    intervalRef.current = setInterval(fetchAll, 500);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, []);

  return { spots, loading, error, errorDetail };
}
