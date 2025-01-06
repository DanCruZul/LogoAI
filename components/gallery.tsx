import React from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Heart, Edit2 } from "lucide-react";
import { Logo } from "@/db/schema";
import { getLogos } from "@/actions/logo-actions";

interface GalleryViewProps {
  onClose: () => void;
  onEdit: (logo: Logo) => void;
}

export default async function GalleryView({
  onClose,
  onEdit,
}: GalleryViewProps) {
  const logosResponse = await getLogos();
  const logosData =
    logosResponse.status === "success" ? logosResponse.data : [];

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center
        justify-center overflow-y-auto"
    >
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-6xl w-full m-4">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-semibold">Logo Gallery</h2>
          <Button variant="ghost" onClick={onClose}>
            Close
          </Button>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {logosData.map((logo) => (
            <div
              key={logo.id}
              className="group relative aspect-square bg-card rounded-lg overflow-hidden shadow-md
                transition-all duration-300 hover:shadow-lg"
            >
              <Image
                src={logo.url}
                alt={`Logo ${logo.id}`}
                layout="fill"
                objectFit="cover"
                className="transition-transform duration-300 group-hover:scale-105"
              />
              <div
                className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent opacity-0
                  group-hover:opacity-100 transition-opacity duration-300"
              >
                <div className="absolute top-2 right-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-white hover:text-primary"
                  >
                    <Heart className="h-5 w-5" />
                  </Button>
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4">
                  <p className="text-white text-sm font-medium truncate mb-1">
                    {logo.prompt}
                  </p>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="w-full"
                    onClick={() => onEdit(logo)}
                  >
                    <Edit2 className="mr-2 h-4 w-4" />
                    Customize
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
