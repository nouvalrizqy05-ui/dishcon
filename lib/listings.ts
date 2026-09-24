import type { SurplusListing } from "@/lib/types";

export function isListingExpired(listing: Pick<SurplusListing, "batas_waktu">, now = Date.now()) {
  const deadline = new Date(listing.batas_waktu).getTime();
  return Number.isFinite(deadline) && deadline <= now;
}

export function isListingOrderable(listing: SurplusListing, now = Date.now()) {
  return listing.status === "active" && !isListingExpired(listing, now) && (listing.jumlah_tersedia ?? listing.jumlah_kantong) > 0;
}
