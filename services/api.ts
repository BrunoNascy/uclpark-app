/**
 * Base URL da API UCL Park.
 *
 * - Android Emulator  → 10.0.2.2  (localhost do host dentro do emulador)
 * - iOS Simulator     → localhost
 * - Dispositivo físico → IP real da máquina, ex: 192.168.1.100
 */
const BASE_URL = 'http://192.168.15.8:3000';

export type SensorStatus = {
  sensor_id: string;
  status: 'ocupado' | 'livre';
  data: string;
};

export type HistoryEntry = {
  id: number;
  sensor_id: string;
  status: 'ocupado' | 'livre';
  data: string;
};

async function request<T>(path: string): Promise<T> {
  const response = await fetch(`${BASE_URL}${path}`);
  if (!response.ok) {
    throw new Error(`HTTP ${response.status} – ${path}`);
  }
  return response.json() as Promise<T>;
}

export const api = {
  getSensors: (): Promise<string[]> =>
    request<string[]>('/api/vagas/sensores'),

  getSensorStatus: (sensorId: string): Promise<SensorStatus> =>
    request<SensorStatus>(`/api/vagas/${sensorId}/status`),

  getSensorHistory: (sensorId: string): Promise<HistoryEntry[]> =>
    request<HistoryEntry[]>(`/api/vagas/${sensorId}/historico`),
};
