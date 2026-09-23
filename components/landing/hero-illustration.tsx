import Image from "next/image";

export function HeroIllustration() {
  return (
    <div className="relative mx-auto w-full max-w-[640px] overflow-hidden rounded-[2.25rem] border border-brand-100 bg-white shadow-soft">
      <Image
        src="/assets/visual-halaman-beranda.png"
        alt="Ilustrasi DishCon food sharing berbasis lokasi dan AI"
        width={640}
        height={533}
        className="aspect-[6/5] h-full w-full object-cover"
        priority
      />
    </div>
  );
}
