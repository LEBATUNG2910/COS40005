// src/services/authService.js
const BASE_URL = 'http://localhost:3001/api/auth';

export const authService = {

  // Đăng ký
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

  // Đăng nhập
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

  // Lưu token sau khi login/register
  saveToken(token, rememberMe = false) {
    // rememberMe → localStorage (tồn tại lâu dài)
    // không → sessionStorage (mất khi đóng tab)
    if (rememberMe) {
      localStorage.setItem('accessToken', token);
    } else {
      sessionStorage.setItem('accessToken', token);
    }
  },

  // Lấy token
  getToken() {
    return localStorage.getItem('accessToken') 
        || sessionStorage.getItem('accessToken');
  },

  // Đăng xuất
  logout() {
    localStorage.removeItem('accessToken');
    sessionStorage.removeItem('accessToken');
  },

  // Kiểm tra đã đăng nhập chưa
  isAuthenticated() {
    return !!this.getToken();
  },
};