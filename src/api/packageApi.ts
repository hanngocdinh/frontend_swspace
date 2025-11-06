// frontend/src/api/packageApi.ts
const BASE = (import.meta as any).env?.VITE_API_BASE_URL ?? 'http://localhost:5000';

export type UIPackageType =
  | 'Hot Desk' | 'Fixed Desk'
  | 'Meeting Room' | 'Private Office' | 'Networking Space';

export type UIUnit =
  'Day' | 'Week' | 'Month' | 'Year' | 'Hour' |
  '1 Hour' | '3 Hours' | '5 Hours' | '3 Months' | '6 Months' | '1 Year';

export type UIStatus = 'Active' | 'Paused';

export interface ServicePackageUI {
  id: string;
  name: string;
  packageType: UIPackageType;
  price: number;
  unit: UIUnit;
  status: UIStatus;
  users: number;
  features: string[];
  description: string;
  accessDays?: number | null;
  bundleHours?: number | null; // 👈 dùng để hiện 1/3/5 hours
}

type ServicePackageAPI = {
  id: number;
  name: string;
  description: string | null;
  price: number;
  access_days: number | null;
  features: string[] | null;
  status: 'active' | 'paused';
  service_code: 'hot_desk' | 'fixed_desk' | 'meeting_room' | 'private_office' | 'networking';
  unit_code: 'day' | 'week' | 'month' | 'hour' | 'year';
  bundle_hours: number | null; // 👈 giữ 1/3/5 giờ
};

function toUIPackageType(code: ServicePackageAPI['service_code']): UIPackageType {
  switch (code) {
    case 'hot_desk': return 'Hot Desk';
    case 'fixed_desk': return 'Fixed Desk';
    case 'meeting_room': return 'Meeting Room';
    case 'private_office': return 'Private Office';
    case 'networking': return 'Networking Space';
  }
}

function toUIUnit(unit: ServicePackageAPI['unit_code']): UIUnit {
  if (unit === 'hour') return 'Hour';
  if (unit === 'day')  return 'Day';
  if (unit === 'week') return 'Week';
  if (unit === 'year') return 'Year';
  return 'Month';
}

function toUIStatus(st: ServicePackageAPI['status']): UIStatus {
  return st === 'active' ? 'Active' : 'Paused';
}

// Convert API -> UI
function fromAPI(row: ServicePackageAPI): ServicePackageUI {
  const accessDays = row.access_days ?? null;

  // Giữ nguyên unit_code (Hour/Day/Week/Month/Year)
  const uiUnit: UIUnit = toUIUnit(row.unit_code);

  return {
    id: String(row.id),
    name: row.name,
    description: row.description ?? '',
    price: Number(row.price ?? 0),
    packageType: toUIPackageType(row.service_code),
    unit: uiUnit,
    status: toUIStatus(row.status),
    users: 0,
    features: row.features ?? [],
    accessDays,
    bundleHours: row.bundle_hours ?? null,
  };
}

// ---------- PUBLIC API ----------
export async function fetchPackages(): Promise<ServicePackageUI[]> {
  const res = await fetch(`${BASE}/api/packages`);
  if (!res.ok) throw new Error(await res.text());
  return (await res.json() as ServicePackageAPI[]).map(fromAPI);
}

export type UpsertPayload = {
  serviceCode: 'hot_desk' | 'fixed_desk' | 'meeting_room' | 'private_office' | 'networking';
  unitCode: 'day' | 'week' | 'month' | 'hour' | 'year';
  name: string;
  price: number;
  description?: string | null;
  accessDays?: number | null;   // dùng cho 3/6 months
  bundleHours?: number | null;  // dùng cho 1/3/5 hours
  features?: string[] | null;
  status: 'active' | 'paused';
};

export type ServiceCode = UpsertPayload['serviceCode'];
export type UnitCode    = UpsertPayload['unitCode'];

export async function createPackage(payload: UpsertPayload): Promise<ServicePackageUI> {
  const res = await fetch(`${BASE}/api/packages`, {
    method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return fromAPI(await res.json() as ServicePackageAPI);
}

export async function updatePackage(id: number, payload: UpsertPayload): Promise<ServicePackageUI> {
  const res = await fetch(`${BASE}/api/packages/${id}`, {
    method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload),
  });
  if (!res.ok) throw new Error(await res.text());
  return fromAPI(await res.json() as ServicePackageAPI);
}

export async function deletePackage(id: number): Promise<void> {
  const res = await fetch(`${BASE}/api/packages/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error(await res.text());
}
