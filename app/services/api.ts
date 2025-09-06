// app/services/api.ts
import { Env } from "../src/config/env";
// 최소 동작용 타입(원하면 분리하여 import 하세요)
export type Facility = {
  id: string;
  name: string;
  feeRange?: string;
  rating?: number;
  address?: string;
};

export type FacilityListResponse = {
  items: Facility[];
  total?: number;
  page?: number;
  pageSize?: number;
};

export async function getFacilities(params: {
  q?: string;
  type?: "시설급여" | "재가급여";
  page?: number;
  pageSize?: number;
  lat?: number;
  lng?: number;
}): Promise<FacilityListResponse> {
  // ✅ Object.fromEntries 대신 안전하게 수동으로 채움
  const sp = new URLSearchParams();
  (Object.entries(params) as [string, unknown][])
    .forEach(([k, v]) => {
      if (v !== undefined && v !== null) sp.append(k, String(v));
    });

  const qs = sp.toString();
  const res = await fetch(`${Env.API_URL}/facilities?${qs}`);
  if (!res.ok) throw new Error(`API 요청 실패: ${res.status}`);
  return res.json();
}
