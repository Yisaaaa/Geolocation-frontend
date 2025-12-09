export interface GeoData {
  ip: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string; // "lat,lng" format
  timezone?: string;
  org?: string;
}

export interface SearchHistoryItem {
  id: string;
  ipAddress: string;
  city?: string;
  region?: string;
  country?: string;
  loc?: string;
  timezone?: string;
  org?: string;
  createdAt: string;
}
