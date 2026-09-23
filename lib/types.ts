export type UserRole = "mitra" | "mahasiswa" | "admin";
export type PublicUserRole = Exclude<UserRole, "admin">;

export type JenisUsaha = "warmindo" | "angkringan" | "katering_rumahan" | "toko_kue" | "lainnya";
export type MitraVerificationStatus = "belum_verifikasi" | "terverifikasi" | "ditangguhkan";

export type Profile = {
  id: string;
  email: string;
  name: string;
  phone?: string;
  role: UserRole;
  roles?: UserRole[];
  active_role?: UserRole;
  avatar_url?: string;
  address?: string;
  lat?: number | null;
  lng?: number | null;
  // Mitra UMKM only
  nama_usaha?: string;
  jenis_usaha?: JenisUsaha;
  verification_status?: MitraVerificationStatus;
  verified_at?: string | null;
  // Mahasiswa only
  nama_kos?: string;
  oauth_role_set_at?: string | null;
  created_at?: string;
};

export type NutritionEstimate = {
  calories_estimate?: string | number;
  calories?: string | number;
  protein?: string | number;
  carbohydrate?: string | number;
  carbs?: string | number;
  fat?: string | number;
  fiber?: string | number;
  sodium?: string | number;
  ingredients_detected?: string[];
  seasonings_detected?: string[];
  allergens?: string[];
  nutrition_note?: string;
  recommendation?: string;
  provider?: string;
  confidence?: number;
  assessed_at?: string;
  [key: string]: unknown;
};

export type ExpiryAssessment = {
  risk_level?: string;
  safe_hours?: number;
  recommended_consume_before?: string;
  storage_recommendation?: string;
  food_safety_warnings?: string[];
  expiry_reason?: string;
};

export type AiAssessment = {
  provider: string;
  nutrition: NutritionEstimate;
  allergens: string[];
  expiry_risk: string;
  recommendation: string;
  confidence?: number;
  assessed_at: string;
  expiry?: ExpiryAssessment;
};

/**
 * "pending_verification" hanya berlaku untuk mitra yang BELUM pernah
 * terverifikasi (listing pertama mereka). Setelah mitra terverifikasi,
 * listing berikutnya otomatis "active" tanpa approval berlapis.
 */
export type ListingStatus = "pending_verification" | "active" | "habis" | "kedaluwarsa" | "ditolak" | "ditarik";

export type SurplusListing = {
  id: string;
  mitra_id: string;
  nama_makanan: string;
  kategori: string;
  halal: boolean;
  deskripsi?: string;
  jumlah_kantong: number; // total kantong misteri yang diposting
  harga_normal: number;
  harga_diskon: number;
  lokasi: string;
  lat: number;
  lng: number;
  batas_waktu: string; // ISO deadline pengambilan
  waktu_produksi?: string;
  metode_penyimpanan?: string;
  status: ListingStatus;
  nutrition?: NutritionEstimate | null;
  expiry?: ExpiryAssessment | null;
  image_url?: string | null;
  created_at: string;
  // Terisi oleh app layer (jumlah_kantong dikurangi reservasi aktif), bukan kolom DB.
  jumlah_tersedia?: number;
};

export type ReservationStatus = "reserved" | "completed" | "dibatalkan" | "kedaluwarsa";

export type Reservation = {
  id: string;
  listing_id: string;
  mahasiswa_id: string;
  mitra_id: string;
  jumlah: number;
  harga_satuan: number;
  total_harga: number;
  komisi_platform: number; // 10% dari total_harga
  kode_pengambilan: string;
  status: ReservationStatus;
  created_at: string;
  completed_at?: string | null;
};

export type KosShareStatus = "tersedia" | "diambil" | "kedaluwarsa";

export type KosShare = {
  id: string;
  poster_id: string; // mahasiswa
  nama_item: string;
  deskripsi?: string;
  harga: number; // 0 = gratis
  lokasi_kos: string;
  status: KosShareStatus;
  image_url?: string | null;
  created_at: string;
};

export type Notification = {
  id: string;
  user_id: string;
  title: string;
  message: string;
  type: "info" | "success" | "warning" | "system";
  link?: string;
  is_read: boolean;
  created_at: string;
};

export type Complaint = {
  id: string;
  user_id: string;
  role: UserRole;
  subject: string;
  message: string;
  status: "open" | "in_review" | "resolved";
  created_at: string;
};

export type Preferences = {
  halal: boolean;
  maxRadiusMeter: number; // hiperlokal: radius dalam meter, bukan km
  preferredCategories: string[];
  notificationEmail: boolean;
  notificationPush: boolean;
};

export type RoleScopedData = {
  profiles: Profile[];
  listings: SurplusListing[];
  reservations: Reservation[];
  kosShares: KosShare[];
  notifications: Notification[];
  complaints: Complaint[];
  preferences: Preferences;
};
