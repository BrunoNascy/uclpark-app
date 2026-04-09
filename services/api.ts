/**
 * Base URL da API UCL Park.
 * Configure via EXPO_PUBLIC_API_URL no arquivo .env:
 *
 * - Android Emulator  → http://10.0.2.2:3000
 * - iOS Simulator     → http://localhost:3000
 * - Dispositivo físico → http://<IP_DA_MAQUINA>:3000
 */
const BASE_URL = process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000';

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

  getAllStatus: (): Promise<SensorStatus[]> =>
    request<SensorStatus[]>('/api/vagas/status'),

  getSensorStatus: (sensorId: string): Promise<SensorStatus> =>
    request<SensorStatus>(`/api/vagas/${sensorId}/status`),

  getSensorHistory: (sensorId: string): Promise<HistoryEntry[]> =>
    request<HistoryEntry[]>(`/api/vagas/${sensorId}/historico`),
};
