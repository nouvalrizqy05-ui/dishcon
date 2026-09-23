/**
 * Utilitas lokasi DishCon.
 *
 * Berbeda dari versi donasi sebelumnya (estimateDistanceKm berbasis tebakan
 * nama wilayah Jabodetabek), modul ini memakai koordinat GPS asli (lat/lng)
 * dan rumus haversine, sesuai kebutuhan hiperlokal di laporan RCA:
 * "Perhitungan jarak asli (rumus haversine) dari koordinat GPS mitra dan
 * pembeli, ditampilkan dalam meter untuk radius hiperlokal."
 */

const EARTH_RADIUS_METERS = 6371000;

function toRadians(deg: number) {
  return (deg * Math.PI) / 180;
}

/** Jarak garis lurus antara dua titik koordinat, dalam meter. */
export function haversineDistanceMeters(lat1: number, lng1: number, lat2: number, lng2: number): number {
  if (![lat1, lng1, lat2, lng2].every((value) => Number.isFinite(value))) return Infinity;
  const dLat = toRadians(lat2 - lat1);
  const dLng = toRadians(lng2 - lng1);
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(toRadians(lat1)) * Math.cos(toRadians(lat2)) * Math.sin(dLng / 2) ** 2;
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
  return EARTH_RADIUS_METERS * c;
}

/** Format jarak untuk ditampilkan ke pengguna: "180 m" atau "2.4 km". */
export function formatDistanceMeters(meters: number): string {
  if (!Number.isFinite(meters)) return "lokasi belum lengkap";
  if (meters < 1000) return `${Math.round(meters)} m`;
  return `${(meters / 1000).toFixed(1)} km`;
}

export type GeoPoint = { lat: number; lng: number };

/** Ambil lokasi GPS pengguna saat ini lewat browser Geolocation API. */
export function getCurrentPosition(options?: PositionOptions): Promise<GeoPoint> {
  return new Promise((resolve, reject) => {
    if (typeof navigator === "undefined" || !navigator.geolocation) {
      reject(new Error("Geolocation tidak didukung di perangkat ini."));
      return;
    }
    navigator.geolocation.getCurrentPosition(
      (position) => resolve({ lat: position.coords.latitude, lng: position.coords.longitude }),
      (error) => reject(new Error(error.message || "Gagal mengambil lokasi GPS.")),
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 60000, ...options }
    );
  });
}

export function buildMapsSearchUrl(query: string) {
  return `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;
}

export function buildMapsPointUrl(lat: number, lng: number) {
  return `https://www.google.com/maps/search/?api=1&query=${lat},${lng}`;
}

export function buildMapsDirectionsUrl(origin: GeoPoint | undefined, destination: GeoPoint) {
  const params = new URLSearchParams({
    api: "1",
    destination: `${destination.lat},${destination.lng}`,
    travelmode: "walking"
  });
  if (origin) params.set("origin", `${origin.lat},${origin.lng}`);
  return `https://www.google.com/maps/dir/?${params.toString()}`;
}

export function buildMapsEmbedUrl(lat: number, lng: number) {
  return `https://www.google.com/maps?q=${lat},${lng}&output=embed`;
}
