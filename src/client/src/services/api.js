// AEROVIGIL - API Communication Service

const API_BASE = '/api';

async function fetchJson(url, options = {}) {
  try {
    const res = await fetch(`${API_BASE}${url}`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('aerovigil_token') || ''}`,
        ...options.headers
      },
      ...options
    });

    if (!res.ok) {
      throw new Error(`HTTP Error ${res.status}`);
    }

    return await res.json();
  } catch (err) {
    console.warn(`[AEROVIGIL API] Request to ${url} failed or offline. Using local fallback mode:`, err.message);
    return null;
  }
}

export const api = {
  // Dashboard & Fleet Overview
  getDashboard: () => fetchJson('/dashboard'),
  
  // Assets
  getAssets: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/assets?${query}`);
  },
  getAssetById: (id) => fetchJson(`/assets/${id}`),
  getAssetHealth: (id) => fetchJson(`/assets/${id}/health`),

  // Maintenance Queue
  getMaintenance: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/maintenance?${query}`);
  },

  // Inventory & Spare Parts
  getInventory: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/inventory?${query}`);
  },

  // Suppliers & Risk
  getSuppliers: (params = {}) => {
    const query = new URLSearchParams(params).toString();
    return fetchJson(`/suppliers?${query}`);
  },

  // Supply Chain Node Graph
  getSupplyChain: () => fetchJson('/supply-chain'),

  // Alert Center
  getAlerts: (severity = 'ALL') => fetchJson(`/alerts?severity=${severity}`),

  // Intelligence & Case Studies
  getNews: () => fetchJson('/intelligence/news'),
  getChallenges: () => fetchJson('/intelligence/challenges'),

  // Resilience What-If Simulator
  runSimulation: (params) => fetchJson('/simulation', {
    method: 'POST',
    body: JSON.stringify(params)
  }),

  // AI Reasoning & Assistant
  analyzeAsset: (assetId) => fetchJson('/ai/analyze', {
    method: 'POST',
    body: JSON.stringify({ assetId })
  }),
  chatWithAi: (query) => fetchJson('/ai/chat', {
    method: 'POST',
    body: JSON.stringify({ query })
  }),

  // Auth
  login: (credentials) => fetchJson('/auth/login', {
    method: 'POST',
    body: JSON.stringify(credentials)
  }),
  getCurrentUser: () => fetchJson('/auth/me')
};
