// src/config.js
export const API = import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'
export const BACKEND_URL = import.meta.env.VITE_API_URL?.replace('/api', '') ?? 'http://localhost:3001'