
import api from "@/lib/config";
import { type Banner } from "@/types/types";
import Image from "next/image";
import Link from "next/link";

const Banner = async () => {
  let banners: Banner[] = [];

  try {
    const { data } = await api.get("/banners");
    banners = data;
  } catch (error) {
    console.error("Failed to fetch banners:", error);
  }

  if (!banners?.length) return null;

  const imageOne = banners[0];
  const imageTwo = banners[1];

  return (
    <section className="grid grid-cols-1 md:grid-cols-4 gap-3">
      {/* Main Banner */}
      {imageOne?.image && (
        <div className="relative group overflow-hidden rounded-md md:col-span-3 h-[280px] sm:h-[350px] md:h-[420px]">
          <Image
            src={imageOne.image}
            alt={imageOne.name || "Main banner"}
            fill
            priority
            sizes="(max-width: 768px) 100vw, 75vw"
            className="object-cover group-hover:scale-105 hoverEffect"
          />

          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center gap-3 px-4 text-babyshopWhite">
            <p className="font-bold text-xs sm:text-sm">
              {imageOne.name}
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium max-w-xl text-center capitalize">
              {imageOne.title}
            </h2>

            <Link
              href="/shop"
              className="capitalize bg-babyshopWhite rounded-full font-medium text-babyshopBlack px-5 sm:px-6 py-2 text-sm sm:text-base hover:bg-babyshopSky/10 border border-transparent hover:border-babyshopWhite hoverEffect"
            >
              Shop Now
            </Link>
          </div>
        </div>
      )}

      {/* Secondary Banner */}
      {imageTwo?.image && (
        <div className="relative group overflow-hidden rounded-md h-[280px] sm:h-[350px] md:h-[420px]">
          <Image
            src={imageTwo.image}
            alt={imageTwo.name || "Secondary banner"}
            fill
            sizes="(max-width: 768px) 100vw, 25vw"
            className="object-cover group-hover:scale-105 hoverEffect"
          />

          <div className="absolute inset-0 bg-black/20 flex flex-col items-center justify-center gap-3 px-3 text-babyshopWhite">
            <p className="font-bold text-xs sm:text-sm">
              {imageTwo.name}
            </p>

            <h2 className="text-2xl sm:text-3xl md:text-4xl font-medium max-w-sm text-center capitalize">
              {imageTwo.title}
            </h2>

            <Link
              href="/shop"
              className="capitalize bg-babyshopWhite rounded-full font-medium text-babyshopBlack px-5 sm:px-6 py-2 text-sm sm:text-base hover:bg-babyshopPurple/10 border border-transparent hover:border-babyshopWhite hoverEffect"
            >
              Shop Now
            </Link>
          </div>
        </div>
      )}
    </section>
  );
};

export default Banner;
