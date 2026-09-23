import Image from "next/image";

export function FoodSharingIllustration() {
  return (
    <div className="relative w-full overflow-hidden rounded-[2rem] border border-brand-100 bg-white shadow-card">
      <Image
        src="/assets/visual-halaman-login-register.png"
        alt="Ilustrasi mahasiswa menemukan makanan"
        fill
        sizes="(max-width: 768px) 100vw, 50vw"
        className="object-cover opacity-90"
        priority
      />
    </div>
  );
}
