import Image from "next/image";

export function SafetyPosterVisual() {
  return (
    <div className="relative h-64 overflow-hidden bg-brand-50">
      <Image
        src="/assets/visual-poster-kampanye-01.png"
        alt="Poster kampanye makanan aman dan dampak nyata"
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
      />
    </div>
  );
}

export function ImpactPosterVisual() {
  return (
    <div className="relative h-64 overflow-hidden bg-orange-50">
      <Image
        src="/assets/visual-poster-kampanye-02.png"
        alt="Poster kampanye satu porsi tidak terbuang"
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
      />
    </div>
  );
}

export function DistributionFlowVisual() {
  return (
    <div className="relative h-64 overflow-hidden bg-brand-50">
      <Image
        src="/assets/visual-alur-distribusi.png"
        alt="Visual alur distribusi DishCon"
        fill
        sizes="(max-width: 768px) 100vw, 33vw"
        className="object-cover"
      />
    </div>
  );
}
