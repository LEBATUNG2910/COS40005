// src/services/authService.js
const BASE_URL = `${import.meta.env.VITE_API_URL ?? 'http://localhost:3001/api'}/auth`;

export const authService = {

  // ─── Đăng ký ─────────────────────────────────────────────────
  async register(formData) {
    const res = await fetch(`${BASE_URL}/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        fullName: formData.fullName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        password: formData.password,
        gender: formData.gender,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Registration failed');
    return data;
  },

  // ─── Đăng nhập ───────────────────────────────────────────────
  async login(formData) {
    const res = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        emailOrPhone: formData.emailOrPhone,
        password: formData.password,
        rememberMe: formData.rememberMe,
      }),
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.message || 'Login failed');
    return data;
  },

  // ─── Lưu token sau login/register ────────────────────────────
  saveToken(accessToken, refreshToken, rememberMe = false) {
    if (rememberMe) {
      localStorage.setItem('accessToken', accessToken);
      localStorage.setItem('refreshToken', refreshToken);
    } else {
      sessionStorage.setItem('accessToken', accessToken);
      sessionStorage.setItem('refreshToken', refreshToken);
    }
  },

  // ─── Lấy access token ────────────────────────────────────────
  getToken() {
    return localStorage.getItem('accessToken')
      || sessionStorage.getItem('accessToken');
  },

  // ─── Lấy refresh token ───────────────────────────────────────
  getRefreshToken() {
    return localStorage.getItem('refreshToken')
      || sessionStorage.getItem('refreshToken');
  },

  // ─── Tự động refresh access token khi hết hạn ────────────────
  async refreshAccessToken() {
    const refreshToken = this.getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token');

    const res = await fetch(`${BASE_URL}/refresh`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ refreshToken }),
    });

    if (!res.ok) {
      this.logout();
      window.location.href = '/auth';
      throw new Error('Session expired');
    }

    const data = await res.json();

    // Lưu token mới, giữ nguyên storage type
    const inLocal = !!localStorage.getItem('accessToken');
    if (inLocal) {
      localStorage.setItem('accessToken', data.accessToken);
      localStorage.setItem('refreshToken', data.refreshToken);
    } else {
      sessionStorage.setItem('accessToken', data.accessToken);
      sessionStorage.setItem('refreshToken', data.refreshToken);
    }

    return data.accessToken;
  },

  // ─── Fetch với auto-refresh khi 401 ──────────────────────────
  async fetchWithAuth(url, options = {}) {
    const token = this.getToken();
    const res = await fetch(url, {
      ...options,
      headers: { ...options.headers, Authorization: `Bearer ${token}` },
    });

    if (res.status === 401) {
      try {
        const newToken = await this.refreshAccessToken();
        return fetch(url, {
          ...options,
          headers: { ...options.headers, Authorization: `Bearer ${newToken}` },
        });
      } catch {
        throw new Error('Session expired. Please login again.');
      }
    }

    return res;
  },

  // ─── Đăng xuất ───────────────────────────────────────────────
  logout() {
    const refreshToken = this.getRefreshToken();
    if (refreshToken) {
      fetch(`${BASE_URL}/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ refreshToken }),
      }).catch(() => {});
    }
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    sessionStorage.removeItem('accessToken');
    sessionStorage.removeItem('refreshToken');
  },

  // ─── Kiểm tra đã đăng nhập chưa ─────────────────────────────
  isAuthenticated() {
    return !!this.getToken();
  },
};