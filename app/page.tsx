import { Suspense } from "react";
import HeroSection from "@/components/home/hero-section";
import CategoriesSection from "@/components/home/categories-section";
import FeaturedProducts from "@/components/home/featured-products";
// import TestimonialsSection from "@/components/home/testimonials-section"
// import InstagramFeed from "@/components/home/instagram-feed"
// import NewsletterSection from "@/components/home/newsletter-section"
import WhatsAppFloat from "@/components/ui/whatsapp-float";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      <HeroSection />
      <CategoriesSection />
      <Suspense fallback={<div className="h-96 animate-pulse bg-gray-100" />}>
        <FeaturedProducts />
      </Suspense>
      {/* <TestimonialsSection /> */}
      {/* <InstagramFeed /> */}
      {/* <NewsletterSection /> */}
      <WhatsAppFloat />
    </main>
  );
}
