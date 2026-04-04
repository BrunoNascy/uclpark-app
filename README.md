# ParkSpot — UCL Park App

App mobile de monitoramento de estacionamento em tempo real. Exibe o status de cada vaga via sensores ultrassônicos (Arduino) conectados a uma API REST local.

---

## Funcionalidades

- **Status em tempo real** — polling a cada 1 segundo por sensor
- **Resumo animado** — card com barra de progresso mostrando % de vagas livres
- **Filtros** — visualizar todas, somente livres ou somente ocupadas
- **Histórico por vaga** — modal com log completo de mudanças de status

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Expo ~54 / Expo Router ~6 |
| Runtime | React Native 0.81.5 / React 19 |
| Ícones | react-native-svg (sem dependência de @expo/vector-icons) |
| Linguagem | TypeScript 5.9 |
| Arquitetura nova | New Architecture habilitada (`newArchEnabled: true`) |

---

## Estrutura do projeto

```
uclpark-app/
├── app/
│   ├── _layout.tsx          # Root layout (Expo Router)
│   └── index.tsx            # Tela principal
├── components/
│   ├── AppIcon.tsx          # Ícone do app (SVG)
│   ├── SideCarIcon.tsx      # Ícone de carro lateral (SVG)
│   ├── SpotCard.tsx         # Card de vaga individual
│   ├── SummaryCard.tsx      # Card de resumo com barra animada
│   └── HistoryModal.tsx     # Modal de histórico por sensor
├── hooks/
│   └── useParking.ts        # Hook: busca sensores + polling de status
├── services/
│   └── api.ts               # Cliente fetch centralizado (BASE_URL)
└── app.json                 # Configuração Expo (bundle ID, ícones, splash)
```

---

## Configuração da API

Edite `services/api.ts` e ajuste `BASE_URL` conforme o ambiente:

```ts
// Android Emulator
const BASE_URL = 'http://10.0.2.2:3000';

// iOS Simulator
const BASE_URL = 'http://localhost:3000';

// Dispositivo físico (use o IP real da máquina)
const BASE_URL = 'http://192.168.x.x:3000';
```

A API deve estar rodando em Node.js na porta 3000 com as seguintes rotas:

| Método | Rota | Descrição |
|---|---|---|
| GET | `/api/vagas/sensores` | Lista todos os IDs de sensor |
| GET | `/api/vagas/:id/status` | Status atual de um sensor |
| GET | `/api/vagas/:id/historico` | Histórico de eventos de um sensor |

---

## Como rodar

```bash
# Instalar dependências
npm install

# Iniciar o servidor de desenvolvimento
npm start

# Rodar no Android
npm run android

# Rodar no iOS
npm run ios
```

> Requisito: [Expo CLI](https://docs.expo.dev/get-started/installation/) e, para builds nativas, Android Studio ou Xcode.

---

## Arquitetura de dados

```
Arduino (sensor ultrassônico)
        │
        ▼
  UCL Park API  (Node.js / MySQL — porta 3000)
        │
        ▼
  useParking.ts  (polling 1 s/sensor via setInterval)
        │
        ▼
  SpotCard / SummaryCard / HistoryModal
```

O hook `useParking` faz duas fases:
1. Busca a lista de sensores uma única vez ao montar o componente.
2. Inicia um `setInterval` de 1 segundo que consulta o status de cada sensor em paralelo.

---

## Configuração Android

O app usa `usesCleartextTraffic: true` (necessário para conectar a APIs HTTP locais) e `edgeToEdgeEnabled: true` para layout de borda a borda.

Bundle ID: `com.uclpark.app`
