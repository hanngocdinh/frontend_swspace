// Minimal user API client for admin/user management
const BASE: string = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:5000';

export type UserRole = 'admin' | 'user';
export type UserStatus = 'active' | 'inactive';

export interface UserDTO {
  id: number;
  email: string;
  phone: string | null;
  full_name: string | null;
  role: UserRole;
  status: UserStatus;
  avatar_url: string | null;
  created_at: string;
  updated_at: string;
  total_bookings?: number;
  total_payments?: number;
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {
  const res = await fetch(`${BASE}/api${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...init,
  });
  if (!res.ok) throw new Error(await res.text());
  return res.json() as Promise<T>;
}

export const usersApi = {
  async list(role?: UserRole): Promise<UserDTO[]> {
    const q = role ? `?role=${encodeURIComponent(role)}` : '';
    return request<UserDTO[]>(`/users${q}`);
  },

  async create(payload: Partial<UserDTO> & { email: string; password: string }): Promise<UserDTO> {
    return request<UserDTO>(`/users`, { method: 'POST', body: JSON.stringify(payload) });
  },

  async updateStatus(id: number, status: UserStatus): Promise<{ success: true }> {
    return request<{ success: true }>(`/users/${id}/status`, { method: 'PUT', body: JSON.stringify({ status }) });
  },

  async remove(id: number): Promise<{ success: true }> {
    return request<{ success: true }>(`/users/${id}`, { method: 'DELETE' });
  },
};


