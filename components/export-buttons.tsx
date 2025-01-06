"use client";

import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";

export default function ExportButtons({
  imageUrl,
  handleExport,
}: {
  imageUrl: string;
  handleExport: (format: "PNG" | "SVG") => void;
}) {
  return (
    <div className="flex sm:flex-row justify-center gap-4 mb-12">
      <a
        href={imageUrl}
        download="generated_logo.png"
        onClick={(e) => {
          e.preventDefault();
          handleExport("PNG");
        }}
      >
        <Button>
          <Download className="mr-2 h-4 w-4" /> Export as PNG
        </Button>
      </a>
    </div>
  );
}
