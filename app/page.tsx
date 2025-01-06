"use client";

import React, { useState } from "react";
import Navigation from "@/components/nav";
import HeroSection from "@/components/hero";
import LogoGeneratorForm from "@/components/logoform";
import Footer from "@/components/footer";
import { Suspense } from "react";
import dynamic from "next/dynamic";
import { Logo } from "@/db/schema";

const DynamicGalleryView = dynamic(() => import("@/components/gallery"), {
  ssr: false,
});

export default function Home() {
  const [showGallery, setShowGallery] = useState(false);
  const [generatedImageUrl, setGeneratedImageUrl] = useState<string | null>(
    null,
  );
  const [editingLogo, setEditingLogo] = useState<Logo | null>(null);

  const handleImageGenerated = (imageUrl: string) => {
    setGeneratedImageUrl(imageUrl);
  };

  const handleViewGallery = () => {
    setShowGallery(true);
  };

  const handleLogoSaved = () => {
    // Refresh gallery or update state as needed
  };

  const handleCloseGallery = () => {
    setShowGallery(false);
  };

  const handleEditLogo = (logo: Logo) => {
    setEditingLogo(logo);
    setShowGallery(false);
  };

  return (
    <div className="relative h-full w-full bg-background min-h-screen">
      <div
        className="absolute inset-0
          bg-[linear-gradient(to_right,#4f4f4f2e_1px,transparent_1px),linear-gradient(to_bottom,#4f4f4f2e_1px,transparent_1px)]
          bg-[size:14px_24px]"
      ></div>
      <Navigation />
      <main className="container mx-auto px-4 py-8 flex-grow relative z-90">
        <HeroSection />
        <LogoGeneratorForm
          onImageGenerated={handleImageGenerated}
          onViewGallery={handleViewGallery}
          onLogoSaved={handleLogoSaved}
          editingLogo={editingLogo}
        />
        {showGallery && (
          <Suspense fallback={<div>Loading...</div>}>
            <DynamicGalleryView
              onClose={handleCloseGallery}
              onEdit={handleEditLogo}
            />
          </Suspense>
        )}
      </main>
      <Footer />
    </div>
  );
}
