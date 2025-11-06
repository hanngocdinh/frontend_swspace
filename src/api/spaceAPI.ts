// FE/src/services/spaceAPI.ts
const API_BASE_URL = 'http://localhost:5000/api';

interface Floor {
  id: number;
  code: string;
  name: string;
}

interface Zone {
  id: number;
  floor_id: number;
  service_id: number;
  name: string;
  capacity: number;
  layout_image_url: string | null;
  service_code: string;
  service_name: string;
  floor_code: string;
  floor_name: string;
}

interface Seat {
  id: number;
  zone_id: number;
  seat_code: string;
  status: 'available' | 'occupied' | 'reserved' | 'disabled';
  pos_x: number | null;
  pos_y: number | null;
  zone_name: string;
  service_code: string;
}

interface Room {
  id: number;
  zone_id: number;
  room_code: string;
  capacity: number;
  status: 'available' | 'occupied' | 'reserved' | 'disabled';
  pos_x: number | null;
  pos_y: number | null;
  zone_name: string;
  service_code: string;
}

interface Camera {
  id: string;
  floor_id: number | null;
  zone_id: number | null;
  name: string;
  floor_code: string | null;
  floor_name: string | null;
  zone_name: string | null;
}

interface OccupancyEvent {
  id: number;
  camera_id: string | null;
  floor_id: number | null;
  zone_id: number | null;
  people_count: number;
  detected_at: string;
  model_version: string | null;
  camera_name: string | null;
}

interface Booking {
  id: number;
  user_id: number;
  category_id: number;
  service_id: number;
  package_id: number | null;
  zone_id: number | null;
  seat_id: number | null;
  room_id: number | null;
  start_time: string;
  end_time: string;
  quantity: number;
  price_total: number;
  status: string;
  notes: string | null;
  created_at: string;
  user_name: string | null;
  user_email: string | null;
  package_name: string | null;
}

// Helper function
async function fetchAPI<T>(endpoint: string, options?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
  if (!response.ok) {
    throw new Error(`API Error: ${response.statusText}`);
  }
  return response.json();
}

export const spaceAPI = {
  // ==================== FLOORS ====================
  async getFloors(): Promise<Floor[]> {
    return fetchAPI<Floor[]>('/space/floors');
  },

  async getFloorById(id: number): Promise<Floor> {
    return fetchAPI<Floor>(`/space/floors/${id}`);
  },

  // ==================== ZONES ====================
  async getZones(): Promise<Zone[]> {
    return fetchAPI<Zone[]>('/space/zones');
  },

  async getZoneById(id: number): Promise<Zone> {
    return fetchAPI<Zone>(`/space/zones/${id}`);
  },

  async getZonesByFloor(floorId: number): Promise<Zone[]> {
    return fetchAPI<Zone[]>(`/space/floors/${floorId}/zones`);
  },

  // ==================== SEATS ====================
  async getSeats(zoneId?: number): Promise<Seat[]> {
    const query = zoneId ? `?zone_id=${zoneId}` : '';
    return fetchAPI<Seat[]>(`/space/seats${query}`);
  },

  async getSeatById(id: number): Promise<Seat> {
    return fetchAPI<Seat>(`/space/seats/${id}`);
  },

  async updateSeatStatus(id: number, status: string): Promise<Seat> {
    return fetchAPI<Seat>(`/space/seats/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  },

  // ==================== ROOMS ====================
  async getRooms(zoneId?: number): Promise<Room[]> {
    const query = zoneId ? `?zone_id=${zoneId}` : '';
    return fetchAPI<Room[]>(`/space/rooms${query}`);
  },

  async getRoomById(id: number): Promise<Room> {
    return fetchAPI<Room>(`/space/rooms/${id}`);
  },

  async updateRoomStatus(id: number, status: string): Promise<Room> {
    return fetchAPI<Room>(`/space/rooms/${id}/status`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status })
    });
  },

  // ==================== CAMERAS ====================
  async getCameras(floorId?: number, zoneId?: number): Promise<Camera[]> {
    const params = new URLSearchParams();
    if (floorId) params.append('floor_id', floorId.toString());
    if (zoneId) params.append('zone_id', zoneId.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchAPI<Camera[]>(`/space/cameras${query}`);
  },

  // ==================== OCCUPANCY ====================
  async getOccupancyEvents(floorId?: number, limit?: number): Promise<OccupancyEvent[]> {
    const params = new URLSearchParams();
    if (floorId) params.append('floor_id', floorId.toString());
    if (limit) params.append('limit', limit.toString());
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchAPI<OccupancyEvent[]>(`/space/occupancy/events${query}`);
  },

  async getLatestOccupancy(): Promise<OccupancyEvent[]> {
    return fetchAPI<OccupancyEvent[]>('/space/occupancy/latest');
  },

  // ==================== BOOKINGS ====================
  async getBookings(seatId?: number, roomId?: number, status?: string): Promise<Booking[]> {
    const params = new URLSearchParams();
    if (seatId) params.append('seat_id', seatId.toString());
    if (roomId) params.append('room_id', roomId.toString());
    if (status) params.append('status', status);
    const query = params.toString() ? `?${params.toString()}` : '';
    return fetchAPI<Booking[]>(`/space/bookings${query}`);
  }
};

export type { Floor, Zone, Seat, Room, Camera, OccupancyEvent, Booking };

