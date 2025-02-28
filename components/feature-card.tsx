import Image from "next/image";
import Link from "next/link";
import type { FeatureCardProps } from "../types/index";



export function FeatureCard({
  title,
  image,
  imageAlt,
  href,
  type,
  openModal,
}: FeatureCardProps) {
  if (type === "modal") {
    return (
      <div
        className="block transition-all border rounded-xl hover:shadow-lg hover:-translate-y-1 bg-sidebar overflow-hidden cursor-pointer"
        onClick={() => openModal?.(href)}
      >
        <div className="aspect-square relative">
          <Image src={image} alt={imageAlt || title} layout="fill" objectFit="cover" />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-center">{title}</h3>
        </div>
      </div>
    );
  }

  if (type === "page") {
    return (
      <Link
        href={href}
        className="block transition-all border rounded-xl hover:shadow-lg hover:-translate-y-1 bg-sidebar overflow-hidden cursor-pointer"
      >
        <div className="aspect-square relative">
          <Image src={image} alt={imageAlt || title} layout="fill" objectFit="cover" />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-center">{title}</h3>
        </div>
      </Link>
    );
  }

  if (type === "cosmetic") {
    return (
      <div
        className="block transition-all border rounded-xl hover:shadow-lg hover:-translate-y-1 bg-sidebar overflow-hidden"
      >
        <div className="aspect-square relative">
          <Image src={image} alt={imageAlt || title} layout="fill" objectFit="cover" />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-center">{title}</h3>
        </div>
      </div>
    );
  }

  return (
      <a
        href={href}
        target="_blank"
        rel="noopener noreferrer"
        className="block transition-all border rounded-xl hover:shadow-lg hover:-translate-y-1 bg-sidebar overflow-hidden"
      >
        <div className="aspect-square relative">
          <Image src={image} alt={imageAlt || title} layout="fill" objectFit="cover" />
        </div>
        <div className="p-4">
          <h3 className="text-sm font-medium text-center">{title}</h3>
        </div>
      </a>
  );  
}
