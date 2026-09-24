"use client";

import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import { supabase } from "@/lib/supabase";
import { useAuth } from "@/lib/auth-context";
import { LOCAL_DB_EVENT, LOCAL_DB_KEY, readLocalDatabase, readLocalProfiles, writeLocalDatabase } from "@/lib/local-db";
import { isListingExpired } from "@/lib/listings";
import type {
  Complaint,
  KosShare,
  Notification,
  Preferences,
  Profile,
  Reservation,
  RoleScopedData,
  SurplusListing,
  UserRole
} from "@/lib/types";

const KOMISI_PERSEN = 0.10;

const DEFAULT_PREFS: Preferences = {
  halal: true,
  maxRadiusMeter: 1500,
  preferredCategories: ["Makanan Berat", "Jajanan"],
  notificationEmail: true,
  notificationPush: true
};

function emptyData(): RoleScopedData {
  return {
    profiles: [],
    listings: [],
    reservations: [],
    kosShares: [],
    notifications: [],
    complaints: [],
    preferences: DEFAULT_PREFS
  };
}

function createId(prefix: string) {
  if (typeof crypto !== "undefined" && "randomUUID" in crypto) return crypto.randomUUID();
  return `${prefix}-${Date.now()}-${Math.random().toString(16).slice(2)}`;
}

function createPickupCode() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function safeSelect<T>(query: PromiseLike<{ data: T[] | null; error: unknown }>) {
  try {
    const { data } = await query;
    return data || [];
  } catch {
    return [];
  }
}

/** Kantong tersedia = jumlah_kantong dikurangi reservasi yang masih aktif ("reserved" atau "completed"). */
function withAvailability(listings: SurplusListing[], reservations: Reservation[]): SurplusListing[] {
  return listings.map((listing) => {
    const terpakai = reservations
      .filter((reservation) => reservation.listing_id === listing.id && reservation.status !== "dibatalkan" && reservation.status !== "kedaluwarsa")
      .reduce((sum, reservation) => sum + reservation.jumlah, 0);
    const status = listing.status === "active" && isListingExpired(listing) ? "kedaluwarsa" : listing.status;
    return { ...listing, status, jumlah_tersedia: Math.max(0, listing.jumlah_kantong - terpakai) };
  });
}

function makeNotification(userId: string, payload: Omit<Notification, "id" | "user_id" | "is_read" | "created_at">): Notification {
  return {
    id: createId("notif"),
    user_id: userId,
    title: payload.title,
    message: payload.message,
    type: payload.type,
    link: payload.link,
    is_read: false,
    created_at: new Date().toISOString()
  };
}

function useDishconDataState() {
  const { user } = useAuth();
  const [data, setData] = useState<RoleScopedData>(emptyData());
  const [loading, setLoading] = useState(true);
  const realtimeChannelRef = useRef<any>(null);

  const refresh = useCallback(async () => {
    if (!user) {
      setData(emptyData());
      setLoading(false);
      return;
    }

    setLoading(true);
    if (supabase) {
      const listingQuery = user.role === "admin"
        ? supabase.from("surplus_listings").select("*").order("created_at", { ascending: false })
        : user.role === "mitra"
          ? supabase.from("surplus_listings").select("*").eq("mitra_id", user.id).order("created_at", { ascending: false })
          : supabase.from("surplus_listings").select("*").eq("status", "active").order("created_at", { ascending: false });

      const reservationQuery = user.role === "admin"
        ? supabase.from("reservations").select("*").order("created_at", { ascending: false })
        : supabase.from("reservations").select("*").eq(user.role === "mitra" ? "mitra_id" : "mahasiswa_id", user.id).order("created_at", { ascending: false });

      const kosShareQuery = user.role === "mahasiswa"
        ? supabase.from("kos_shares").select("*").order("created_at", { ascending: false })
        : user.role === "admin"
          ? supabase.from("kos_shares").select("*").order("created_at", { ascending: false })
          : supabase.from("kos_shares").select("*").eq("poster_id", "__none__");

      const profilesQuery = user.role === "admin"
        ? supabase.from("profiles").select("*").order("created_at", { ascending: false })
        : supabase.from("profiles").select("*").eq("id", user.id);

      const complaintsQuery = user.role === "admin"
        ? supabase.from("complaints").select("*").order("created_at", { ascending: false })
        : supabase.from("complaints").select("*").eq("user_id", user.id).order("created_at", { ascending: false });

      const [profiles, listings, reservations, kosShares, notifications, complaints, prefsRows] = await Promise.all([
        safeSelect<Profile>(profilesQuery as any),
        safeSelect<SurplusListing>(listingQuery as any),
        safeSelect<Reservation>(reservationQuery as any),
        safeSelect<KosShare>(kosShareQuery as any),
        safeSelect<Notification>(supabase.from("notifications").select("*").eq("user_id", user.id).order("created_at", { ascending: false }) as any),
        safeSelect<Complaint>(complaintsQuery as any),
        safeSelect<{ settings: Preferences }>(supabase.from("user_preferences").select("settings").eq("user_id", user.id) as any)
      ]);

      setData({
        profiles,
        listings: withAvailability(listings, reservations),
        reservations,
        kosShares,
        notifications,
        complaints,
        preferences: prefsRows[0]?.settings || DEFAULT_PREFS
      });
    } else {
      const db = readLocalDatabase();
      const allProfiles = readLocalProfiles();
      const listings = user.role === "admin"
        ? db.listings
        : user.role === "mitra"
          ? db.listings.filter((item) => item.mitra_id === user.id)
          : db.listings.filter((item) => item.status === "active");
      const reservations = user.role === "admin"
        ? db.reservations
        : user.role === "mitra"
          ? db.reservations.filter((item) => item.mitra_id === user.id)
          : db.reservations.filter((item) => item.mahasiswa_id === user.id);
      const kosShares = user.role === "mitra" ? [] : db.kosShares;
      const complaints = user.role === "admin"
        ? db.complaints
        : db.complaints.filter((item) => item.user_id === user.id);

      setData({
        profiles: user.role === "admin" ? allProfiles : allProfiles.filter((item) => item.id === user.id),
        listings: withAvailability([...listings].sort((a, b) => b.created_at.localeCompare(a.created_at)), db.reservations),
        reservations: [...reservations].sort((a, b) => b.created_at.localeCompare(a.created_at)),
        kosShares: [...kosShares].sort((a, b) => b.created_at.localeCompare(a.created_at)),
        notifications: db.notifications.filter((item) => item.user_id === user.id).sort((a, b) => b.created_at.localeCompare(a.created_at)),
        complaints: [...complaints].sort((a, b) => b.created_at.localeCompare(a.created_at)),
        preferences: db.preferences[user.id] || DEFAULT_PREFS
      });
    }
    setLoading(false);
  }, [user]);

  useEffect(() => { refresh(); }, [refresh]);

  useEffect(() => {
    if (supabase || typeof window === "undefined") return;
    const onChange = () => refresh();
    const onStorage = (event: StorageEvent) => {
      if (!event.key || event.key === LOCAL_DB_KEY || event.key === "dishcon_local_accounts") refresh();
    };
    window.addEventListener(LOCAL_DB_EVENT, onChange);
    window.addEventListener("storage", onStorage);
    return () => {
      window.removeEventListener(LOCAL_DB_EVENT, onChange);
      window.removeEventListener("storage", onStorage);
    };
  }, [refresh]);

  useEffect(() => {
    const sb = supabase;
    if (!sb || !user?.id || !user?.role) return;

    const channelName = `dishcon-live-${user.id}-${user.role}`;

    if (realtimeChannelRef.current) {
      void sb.removeChannel(realtimeChannelRef.current);
      realtimeChannelRef.current = null;
    }

    sb
      .getChannels()
      .filter((channel) => channel.topic === `realtime:${channelName}`)
      .forEach((channel) => {
        void sb.removeChannel(channel);
      });

    const channel = sb.channel(channelName);

    channel.on("postgres_changes", { event: "*", schema: "public", table: "reservations" }, () => refresh());
    channel.on("postgres_changes", { event: "*", schema: "public", table: "surplus_listings" }, () => refresh());
    channel.on("postgres_changes", { event: "*", schema: "public", table: "kos_shares" }, () => refresh());
    channel.on("postgres_changes", { event: "*", schema: "public", table: "notifications" }, () => refresh());
    channel.on("postgres_changes", { event: "*", schema: "public", table: "complaints" }, () => refresh());

    channel.subscribe((status) => {
      if (status === "CHANNEL_ERROR") {
        console.warn("DishCon realtime channel error. Data will refresh manually.");
      }
    });

    realtimeChannelRef.current = channel;

    return () => {
      if (realtimeChannelRef.current) {
        void sb.removeChannel(realtimeChannelRef.current);
        realtimeChannelRef.current = null;
      }
    };
  }, [refresh, user?.id, user?.role]);

  const addNotification = useCallback(async (payload: Omit<Notification, "id" | "user_id" | "is_read" | "created_at"> & { user_id?: string }) => {
    if (!user) return;
    const notification = makeNotification(payload.user_id || user.id, payload);
    if (supabase) {
      await supabase.from("notifications").insert(notification);
      await refresh();
      return notification;
    }
    const db = readLocalDatabase();
    writeLocalDatabase({ ...db, notifications: [notification, ...db.notifications] });
    return notification;
  }, [refresh, user]);

  /** Mitra memposting "kantong surplus" baru. Verifikasi hanya sekali di awal. */
  const createListing = useCallback(async (payload: Omit<SurplusListing, "id" | "mitra_id" | "status" | "created_at" | "jumlah_tersedia">) => {
    if (!user || user.role !== "mitra") return undefined;
    if (user.verification_status === "ditangguhkan") throw new Error("Akun mitra sedang ditangguhkan dan belum dapat membuat listing.");
    const sudahTerverifikasi = user.verification_status === "terverifikasi";
    const listing: SurplusListing = {
      ...payload,
      id: createId("listing"),
      mitra_id: user.id,
      status: sudahTerverifikasi ? "active" : "pending_verification",
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data: inserted, error } = await supabase.from("surplus_listings").insert(listing).select().single();
      if (error) throw new Error(error.message);
      await addNotification(
        sudahTerverifikasi
          ? { title: "Kantong surplus tayang", message: `${listing.nama_makanan} sudah tampil untuk mahasiswa di sekitar Anda.`, type: "success", link: "/mitra/history" }
          : { title: "Menunggu verifikasi pertama", message: `${listing.nama_makanan} akan tayang otomatis setelah admin memverifikasi akun Anda (hanya sekali).`, type: "info", link: "/mitra/history" }
      );
      await refresh();
      return (inserted || listing) as SurplusListing;
    }

    const db = readLocalDatabase();
    const admins = readLocalProfiles().filter((profile) => profile.role === "admin");
    const ownNotification = makeNotification(user.id, sudahTerverifikasi
      ? { title: "Kantong surplus tayang", message: `${listing.nama_makanan} sudah tampil untuk mahasiswa di sekitar Anda.`, type: "success", link: "/mitra/history" }
      : { title: "Menunggu verifikasi pertama", message: `${listing.nama_makanan} akan tayang otomatis setelah admin memverifikasi akun Anda (hanya sekali).`, type: "info", link: "/mitra/history" });
    const adminNotifications = sudahTerverifikasi ? [] : admins.map((admin) => makeNotification(admin.id, {
      title: "Mitra baru perlu diverifikasi",
      message: `${user.name} (${listing.nama_makanan}) menunggu verifikasi pertama sebagai mitra.`,
      type: "warning",
      link: "/admin/mitra"
    }));
    writeLocalDatabase({
      ...db,
      listings: [listing, ...db.listings],
      notifications: [ownNotification, ...adminNotifications, ...db.notifications]
    });
    return listing;
  }, [addNotification, refresh, user]);

  /**
   * Mahasiswa memesan kantong surplus secara instan — TANPA approval berlapis.
   * Ini padanan reserve_surplus_listing() di database: penguncian stok atomik
   * terjadi di RPC Supabase; jalur local-db mensimulasikan pengecekan yang sama.
   */
  const reserveListing = useCallback(async (listingId: string, jumlah: number) => {
    if (!user || user.role !== "mahasiswa") throw new Error("Hanya mahasiswa yang dapat memesan kantong surplus.");
    if (jumlah <= 0) throw new Error("Jumlah pesanan minimal 1 kantong.");

    if (supabase) {
      const { data: reservationId, error } = await supabase.rpc("reserve_surplus_listing", {
        p_listing_id: listingId,
        p_jumlah: jumlah
      });
      if (error) throw new Error(error.message);
      await refresh();
      return reservationId as string;
    }

    const db = readLocalDatabase();
    const listing = db.listings.find((item) => item.id === listingId);
    if (!listing) throw new Error("Kantong surplus tidak ditemukan.");
    if (listing.status !== "active") throw new Error("Kantong surplus ini sudah tidak tersedia.");
    if (new Date(listing.batas_waktu).getTime() < Date.now()) throw new Error("Batas waktu pengambilan sudah lewat.");
    const [availableListing] = withAvailability([listing], db.reservations);
    const tersedia = availableListing.jumlah_tersedia ?? 0;
    if (tersedia < jumlah) throw new Error(`Stok tidak cukup. Sisa ${tersedia} kantong.`);

    const reservation: Reservation = {
      id: createId("resv"),
      listing_id: listing.id,
      mahasiswa_id: user.id,
      mitra_id: listing.mitra_id,
      jumlah,
      harga_satuan: listing.harga_diskon,
      total_harga: listing.harga_diskon * jumlah,
      komisi_platform: Math.round(listing.harga_diskon * jumlah * KOMISI_PERSEN),
      kode_pengambilan: createPickupCode(),
      status: "reserved",
      created_at: new Date().toISOString()
    };

    const habisSekarang = tersedia - jumlah <= 0;
    const notifications = [
      makeNotification(user.id, {
        title: "Reservasi berhasil",
        message: `${listing.nama_makanan} x${jumlah} berhasil dipesan. Kode pengambilan: ${reservation.kode_pengambilan}.`,
        type: "success",
        link: "/mahasiswa/history"
      }),
      makeNotification(listing.mitra_id, {
        title: "Kantong surplus dipesan",
        message: `${listing.nama_makanan} x${jumlah} baru saja dipesan mahasiswa.`,
        type: "info",
        link: "/mitra/dashboard"
      })
    ];

    writeLocalDatabase({
      ...db,
      listings: db.listings.map((item) => item.id === listing.id && habisSekarang ? { ...item, status: "habis" as const } : item),
      reservations: [reservation, ...db.reservations],
      notifications: [...notifications, ...db.notifications]
    });
    return reservation.id;
  }, [refresh, user]);

  /** Mahasiswa atau mitra membatalkan reservasi yang belum diambil. */
  const cancelReservation = useCallback(async (reservationId: string) => {
    if (!user) return;
    if (supabase) {
      const { error } = await supabase.rpc("cancel_reservation", { p_reservation_id: reservationId });
      if (error) throw new Error(error.message);
      await refresh();
      return;
    }

    const db = readLocalDatabase();
    const reservation = db.reservations.find((item) => item.id === reservationId);
    if (!reservation || reservation.status !== "reserved") return;
    const listing = db.listings.find((item) => item.id === reservation.listing_id);
    const notifications = [
      makeNotification(reservation.mahasiswa_id, {
        title: "Reservasi dibatalkan",
        message: `Reservasi ${listing?.nama_makanan ?? ""} telah dibatalkan.`,
        type: "info",
        link: "/mahasiswa/history"
      }),
      makeNotification(reservation.mitra_id, {
        title: "Reservasi dibatalkan",
        message: `Reservasi ${listing?.nama_makanan ?? ""} oleh mahasiswa telah dibatalkan. Stok kembali tersedia.`,
        type: "info",
        link: "/mitra/dashboard"
      })
    ];
    writeLocalDatabase({
      ...db,
      reservations: db.reservations.map((item) => item.id === reservationId ? { ...item, status: "dibatalkan" as const } : item),
      listings: db.listings.map((item) => item.id === reservation.listing_id && item.status === "habis" && new Date(item.batas_waktu).getTime() > Date.now()
        ? { ...item, status: "active" as const }
        : item),
      notifications: [...notifications, ...db.notifications]
    });
  }, [refresh, user]);

  /** Mitra menandai pengambilan selesai dengan memasukkan kode pengambilan mahasiswa. */
  const completeReservation = useCallback(async (reservationId: string, kodePengambilan: string) => {
    if (!user || user.role !== "mitra") throw new Error("Hanya mitra yang dapat menyelesaikan pengambilan.");

    if (supabase) {
      const { error } = await supabase.rpc("complete_reservation", { p_reservation_id: reservationId, p_kode: kodePengambilan });
      if (error) throw new Error(error.message);
      await refresh();
      return;
    }

    const db = readLocalDatabase();
    const reservation = db.reservations.find((item) => item.id === reservationId);
    if (!reservation) throw new Error("Reservasi tidak ditemukan.");
    if (reservation.mitra_id !== user.id) throw new Error("Reservasi ini bukan milik usaha Anda.");
    if (reservation.kode_pengambilan !== kodePengambilan.trim()) throw new Error("Kode pengambilan tidak cocok.");
    const listing = db.listings.find((item) => item.id === reservation.listing_id);
    writeLocalDatabase({
      ...db,
      reservations: db.reservations.map((item) => item.id === reservationId ? { ...item, status: "completed" as const, completed_at: new Date().toISOString() } : item),
      notifications: [
        makeNotification(reservation.mahasiswa_id, {
          title: "Pengambilan selesai",
          message: `${listing?.nama_makanan ?? "Pesanan"} sudah dikonfirmasi diambil. Terima kasih sudah ikut mengurangi sisa makanan!`,
          type: "success",
          link: "/mahasiswa/history"
        }),
        ...db.notifications
      ]
    });
  }, [refresh, user]);

  /** Admin memverifikasi mitra SEKALI — listing berikutnya otomatis tayang. */
  const verifyMitra = useCallback(async (mitraId: string, status: "terverifikasi" | "ditangguhkan") => {
    if (!user || user.role !== "admin") return;
    if (supabase) {
      const { error } = await supabase.rpc("verify_mitra", { p_mitra_id: mitraId, p_status: status });
      if (error) throw new Error(error.message);
      await refresh();
      return;
    }
    // Jalur local-db: profil mitra disimpan di local accounts, bukan di RoleScopedData.
    const accountsRaw = localStorage.getItem("dishcon_local_accounts");
    const accounts = accountsRaw ? JSON.parse(accountsRaw) : [];
    const updated = accounts.map((account: Profile) => account.id === mitraId
      ? { ...account, verification_status: status, verified_at: status === "terverifikasi" ? new Date().toISOString() : account.verified_at }
      : account);
    localStorage.setItem("dishcon_local_accounts", JSON.stringify(updated));
    const db = readLocalDatabase();
    writeLocalDatabase({
      ...db,
      listings: status === "terverifikasi"
        ? db.listings.map((item) => item.mitra_id === mitraId && item.status === "pending_verification" ? { ...item, status: "active" as const } : item)
        : db.listings,
      notifications: [
        makeNotification(mitraId, {
          title: status === "terverifikasi" ? "Akun mitra terverifikasi" : "Akun mitra ditangguhkan",
          message: status === "terverifikasi"
            ? "Akun Anda sudah terverifikasi. Semua listing berikutnya akan tayang otomatis."
            : "Akun Anda ditangguhkan sementara oleh admin.",
          type: status === "terverifikasi" ? "success" : "warning",
          link: "/mitra/dashboard"
        }),
        ...db.notifications
      ]
    });
    window.dispatchEvent(new CustomEvent("dishcon-data-changed"));
  }, [refresh, user]);

  /** Fitur retensi P2P: berbagi bahan makanan gratis/murah antar penghuni kos. */
  const createKosShare = useCallback(async (payload: Omit<KosShare, "id" | "poster_id" | "status" | "created_at">) => {
    if (!user || user.role !== "mahasiswa") return undefined;
    const kosShare: KosShare = {
      ...payload,
      id: createId("kos"),
      poster_id: user.id,
      status: "tersedia",
      created_at: new Date().toISOString()
    };

    if (supabase) {
      const { data: inserted, error } = await supabase.from("kos_shares").insert(kosShare).select().single();
      if (error) throw new Error(error.message);
      await refresh();
      return (inserted || kosShare) as KosShare;
    }

    const db = readLocalDatabase();
    writeLocalDatabase({ ...db, kosShares: [kosShare, ...db.kosShares] });
    return kosShare;
  }, [refresh, user]);

  const updateKosShareStatus = useCallback(async (id: string, status: KosShare["status"]) => {
    if (!user) return;
    if (supabase) {
      await supabase.from("kos_shares").update({ status }).eq("id", id);
      await refresh();
      return;
    }
    const db = readLocalDatabase();
    writeLocalDatabase({ ...db, kosShares: db.kosShares.map((item) => item.id === id ? { ...item, status } : item) });
  }, [refresh, user]);

  const createComplaint = useCallback(async (subject: string, message: string) => {
    if (!user) return undefined;
    const currentUser = user;
    const complaint: Complaint = {
      id: createId("cmp"),
      user_id: currentUser.id,
      role: currentUser.role,
      subject,
      message,
      status: "open",
      created_at: new Date().toISOString()
    };

    async function sendComplaintEmail() {
      try {
        await fetch("/api/complaints/email", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ subject, message, role: currentUser.role, userName: currentUser.name, userEmail: currentUser.email })
        });
      } catch {
        // Email pengaduan bersifat tambahan. Data utama tetap tersimpan di database.
      }
    }

    if (supabase) {
      const { error } = await supabase.from("complaints").insert(complaint);
      if (error) throw new Error(error.message);
      await sendComplaintEmail();
      await addNotification({
        title: "Pengaduan diterima",
        message: "Tim DishCon akan meninjau laporan Anda.",
        type: "info",
        link: `/${currentUser.role === "admin" ? "admin/complaints" : currentUser.role === "mitra" ? "mitra/complaint" : "mahasiswa/complaint"}?complaint=${complaint.id}`
      });
      await refresh();
      return complaint;
    }

    const db = readLocalDatabase();
    const admins = readLocalProfiles().filter((profile) => profile.role === "admin");
    const notifications = [
      makeNotification(currentUser.id, {
        title: "Pengaduan diterima",
        message: "Tim DishCon akan meninjau laporan Anda.",
        type: "info",
        link: `/${currentUser.role === "admin" ? "admin/complaints" : currentUser.role === "mitra" ? "mitra/complaint" : "mahasiswa/complaint"}?complaint=${complaint.id}`
      }),
      ...admins.filter((admin) => admin.id !== currentUser.id).map((admin) => makeNotification(admin.id, {
        title: "Pengaduan baru",
        message: `${currentUser.name}: ${subject}`,
        type: "warning",
        link: `/admin/complaints?complaint=${complaint.id}`
      }))
    ];
    writeLocalDatabase({ ...db, complaints: [complaint, ...db.complaints], notifications: [...notifications, ...db.notifications] });
    await sendComplaintEmail();
    return complaint;
  }, [addNotification, refresh, user]);

  const updateComplaintStatus = useCallback(async (id: string, status: Complaint["status"]) => {
    if (!user || user.role !== "admin") return;
    const complaint = data.complaints.find((item) => item.id === id);
    if (!complaint) return;

    if (supabase) {
      const { error } = await supabase.from("complaints").update({ status }).eq("id", id);
      if (error) throw new Error(error.message);
      await addNotification({
        user_id: complaint.user_id,
        title: "Status pengaduan diperbarui",
        message: `${complaint.subject} kini berstatus ${status}.`,
        type: status === "resolved" ? "success" : "info",
        link: `${complaint.role === "mitra" ? "/mitra/complaint" : complaint.role === "mahasiswa" ? "/mahasiswa/complaint" : "/admin/complaints"}?complaint=${complaint.id}`
      });
      await refresh();
      return;
    }

    const db = readLocalDatabase();
    const notification = makeNotification(complaint.user_id, {
      title: "Status pengaduan diperbarui",
      message: `${complaint.subject} kini berstatus ${status}.`,
      type: status === "resolved" ? "success" : "info",
      link: complaint.role === "mitra" ? "/mitra/complaint" : complaint.role === "mahasiswa" ? "/mahasiswa/complaint" : "/admin/complaints"
    });
    writeLocalDatabase({
      ...db,
      complaints: db.complaints.map((item) => item.id === id ? { ...item, status } : item),
      notifications: [notification, ...db.notifications]
    });
  }, [addNotification, data.complaints, refresh, user]);

  const markNotificationRead = useCallback(async (id: string) => {
    if (!user) return;
    if (supabase) {
      await supabase.from("notifications").update({ is_read: true }).eq("id", id).eq("user_id", user.id);
      await refresh();
      return;
    }
    const db = readLocalDatabase();
    writeLocalDatabase({ ...db, notifications: db.notifications.map((item) => item.id === id && item.user_id === user.id ? { ...item, is_read: true } : item) });
  }, [refresh, user]);

  const updatePreferences = useCallback(async (preferences: Preferences) => {
    if (!user) return;
    if (supabase) {
      await supabase.from("user_preferences").upsert({ user_id: user.id, settings: preferences, updated_at: new Date().toISOString() });
      await refresh();
      return;
    }
    const db = readLocalDatabase();
    writeLocalDatabase({ ...db, preferences: { ...db.preferences, [user.id]: preferences } });
  }, [refresh, user]);

  /** Admin dapat menarik/menolak listing di luar alur verifikasi mitra (mis. pelanggaran kelayakan pangan berulang). */
  const updateListingStatus = useCallback(async (id: string, status: SurplusListing["status"]) => {
    if (!user || user.role !== "admin") return;
    const listing = data.listings.find((item) => item.id === id);
    if (!listing) return;

    if (supabase) {
      const { error } = await supabase.from("surplus_listings").update({ status }).eq("id", id);
      if (error) throw new Error(error.message);
      await addNotification({
        user_id: listing.mitra_id,
        title: "Status listing diperbarui oleh admin",
        message: `${listing.nama_makanan} kini berstatus ${status}.`,
        type: status === "active" ? "success" : "warning",
        link: "/mitra/history"
      });
      await refresh();
      return;
    }

    const db = readLocalDatabase();
    const notification = makeNotification(listing.mitra_id, {
      title: "Status listing diperbarui oleh admin",
      message: `${listing.nama_makanan} kini berstatus ${status}.`,
      type: status === "active" ? "success" : "warning",
      link: "/mitra/history"
    });
    writeLocalDatabase({
      ...db,
      listings: db.listings.map((item) => item.id === id ? { ...item, status } : item),
      notifications: [notification, ...db.notifications]
    });
  }, [addNotification, data.listings, refresh, user]);

  /** Mitra UMKM dapat membatalkan atau menandai habis listing miliknya sendiri. */
  const mitraUpdateListingStatus = useCallback(async (id: string, status: "habis" | "ditarik") => {
    if (!user || user.role !== "mitra") return;
    const listing = data.listings.find((item) => item.id === id && item.mitra_id === user.id);
    if (!listing) return;

    if (supabase) {
      await supabase.from("surplus_listings").update({ status }).eq("id", id);
      await refresh();
      return;
    }

    const db = readLocalDatabase();
    writeLocalDatabase({
      ...db,
      listings: db.listings.map((item) => item.id === id ? { ...item, status } : item)
    });
  }, [data.listings, refresh, user]);

  return useMemo(() => ({
    ...data,
    loading,
    refresh,
    createListing,
    reserveListing,
    cancelReservation,
    completeReservation,
    verifyMitra,
    createKosShare,
    updateKosShareStatus,
    createComplaint,
    updateComplaintStatus,
    markNotificationRead,
    updatePreferences,
    updateListingStatus,
    mitraUpdateListingStatus
  }), [cancelReservation, completeReservation, createComplaint, createKosShare, createListing, data, loading, markNotificationRead, refresh, reserveListing, updateComplaintStatus, updateKosShareStatus, updateListingStatus, updatePreferences, verifyMitra, mitraUpdateListingStatus]);
}

const DishconDataContext = createContext<ReturnType<typeof useDishconDataState> | null>(null);

export function DishconDataProvider({ children }: { children: React.ReactNode }) {
  const value = useDishconDataState();
  return <DishconDataContext.Provider value={value}>{children}</DishconDataContext.Provider>;
}

export function useDishconData() {
  const value = useContext(DishconDataContext);
  if (!value) throw new Error("useDishconData must be used inside DishconDataProvider");
  return value;
}

export function readableRole(role: UserRole) {
  if (role === "mitra") return "Mitra UMKM";
  if (role === "mahasiswa") return "Mahasiswa";
  return "Admin";
}
