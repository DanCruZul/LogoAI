import React, { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Label } from "@/components/ui/label";
import { Download, RefreshCw, X, Check } from "lucide-react";
import { HexColorPicker } from "react-colorful";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

interface ImageEditorProps {
  imageUrl: string;
  onClose: () => void;
  onSave: (editedImageUrl: string) => void;
}

export default function ImageEditor({
  imageUrl,
  onClose,
  onSave,
}: ImageEditorProps) {
  const [colors, setColors] = useState<string[]>([]);
  const [activeColorIndex, setActiveColorIndex] = useState<number | null>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const img = new Image();
    img.crossOrigin = "anonymous";
    img.src = imageUrl;
    img.onload = () => {
      canvas.width = img.width;
      canvas.height = img.height;
      ctx.drawImage(img, 0, 0);
      extractColors(ctx, img.width, img.height);
    };
  }, [imageUrl]);

  const extractColors = (
    ctx: CanvasRenderingContext2D,
    width: number,
    height: number,
  ) => {
    const imageData = ctx.getImageData(0, 0, width, height).data;
    const colorMap: { [key: string]: number } = {};

    for (let i = 0; i < imageData.length; i += 4) {
      const r = imageData[i];
      const g = imageData[i + 1];
      const b = imageData[i + 2];
      const hex = rgbToHex(r, g, b);
      colorMap[hex] = (colorMap[hex] || 0) + 1;
    }

    const sortedColors = Object.entries(colorMap)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 6)
      .map(([color]) => color);

    setColors(sortedColors);
  };

  const rgbToHex = (r: number, g: number, b: number) => {
    return (
      "#" +
      [r, g, b]
        .map((x) => {
          const hex = x.toString(16);
          return hex.length === 1 ? "0" + hex : hex;
        })
        .join("")
    );
  };

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const applyColorChange = (newColor: string, index: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext("2d");
    if (!canvas || !ctx) return;

    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const data = imageData.data;

    const oldColor = colors[index];
    const oldRgb = hexToRgb(oldColor);
    const newRgb = hexToRgb(newColor);

    if (!oldRgb || !newRgb) {
      console.error("Invalid color format");
      return;
    }

    for (let i = 0; i < data.length; i += 4) {
      if (
        Math.abs(data[i] - oldRgb.r) < 30 &&
        Math.abs(data[i + 1] - oldRgb.g) < 30 &&
        Math.abs(data[i + 2] - oldRgb.b) < 30
      ) {
        data[i] = newRgb.r;
        data[i + 1] = newRgb.g;
        data[i + 2] = newRgb.b;
      }
    }

    ctx.putImageData(imageData, 0, 0);
    setColors(colors.map((c, i) => (i === index ? newColor : c)));
  };

  const handleSave = () => {
    const canvas = canvasRef.current;
    if (canvas) {
      const editedImageUrl = canvas.toDataURL("image/png");
      onSave(editedImageUrl);
    }
  };

  const handleDownload = (format: "PNG" | "SVG") => {
    const canvas = canvasRef.current;
    if (canvas) {
      const link = document.createElement("a");
      link.download = `edited_logo.${format.toLowerCase()}`;
      link.href = canvas.toDataURL(`image/${format.toLowerCase()}`);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  return (
    <div
      className="fixed inset-0 bg-background/80 backdrop-blur-sm z-50 flex items-center
        justify-center overflow-y-auto"
    >
      <div className="bg-card p-6 rounded-lg shadow-lg max-w-4xl w-full m-4">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">Edit Logo</h2>
          <Button variant="ghost" size="icon" onClick={onClose}>
            <X className="h-4 w-4" />
            <span className="sr-only">Close</span>
          </Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <div
              className="aspect-square bg-card/45 border-2 border-border rounded-lg flex items-center
                justify-center overflow-hidden"
            >
              <canvas
                ref={canvasRef}
                className="max-w-full max-h-full object-contain"
              />
            </div>
          </div>
          <div>
            <Label className="text-lg font-semibold mb-2">Color Palette</Label>
            <div className="grid grid-cols-3 gap-4 mb-6">
              {colors.map((color, index) => (
                <Popover key={index}>
                  <PopoverTrigger asChild>
                    <Button
                      className="w-full h-16 rounded-md transition-transform hover:scale-105 focus:ring-2
                        focus:ring-offset-2 focus:ring-primary relative overflow-hidden group"
                      style={{ backgroundColor: color }}
                    >
                      <span className="sr-only">Edit color {index + 1}</span>
                      <div
                        className="absolute inset-0 flex items-center justify-center opacity-0
                          group-hover:opacity-100 transition-opacity bg-black/50"
                      >
                        <Check className="h-6 w-6 text-white" />
                      </div>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-64">
                    <div className="space-y-2">
                      <Label>Edit Color {index + 1}</Label>
                      <HexColorPicker
                        color={color}
                        onChange={(newColor) =>
                          applyColorChange(newColor, index)
                        }
                      />
                      <div className="flex justify-between items-center mt-2">
                        <Label>Hex:</Label>
                        <input
                          type="text"
                          value={color}
                          onChange={(e) =>
                            applyColorChange(e.target.value, index)
                          }
                          className="border rounded px-2 py-1 text-sm w-24"
                        />
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              ))}
            </div>
            <div className="flex flex-col space-y-2">
              <Button onClick={() => handleDownload("PNG")}>
                <Download className="mr-2 h-4 w-4" /> Download as PNG
              </Button>
              <Button onClick={() => handleDownload("SVG")}>
                <Download className="mr-2 h-4 w-4" /> Download as SVG
              </Button>
              <Button onClick={handleSave} variant="default">
                <RefreshCw className="mr-2 h-4 w-4" /> Apply Changes
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
