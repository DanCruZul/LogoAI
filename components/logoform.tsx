"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { generateLogo } from "@/actions/logogen";
import { Loader2, Edit2, Image as ImageIcon } from "lucide-react";
import ImageEditor from "@/components/ui/image-editor";
import { useToast } from "@/hooks/use-toast";
import { Logo } from "@/db/schema";

interface LogoGeneratorFormProps {
  onImageGenerated: (imageUrl: string) => void;
  onViewGallery: () => void;
  onLogoSaved: () => void;
  editingLogo: Logo | null;
}

export default function LogoGeneratorForm({
  onImageGenerated,
  onViewGallery,
  onLogoSaved,
  editingLogo,
}: LogoGeneratorFormProps) {
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("default");
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [errorMessage, setErrorMessage] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [name, setName] = useState("");
  const [isEditing, setIsEditing] = useState(false);
  const { toast } = useToast();

  useEffect(() => {
    if (editingLogo) {
      setPrompt(editingLogo.prompt);
      setImageUrl(editingLogo.url);
    }
  }, [editingLogo]);

  const handleGenerate = async () => {
    setErrorMessage("");
    setIsLoading(true);
    try {
      const response = await generateLogo(prompt, name);
      if (response.status === "success") {
        setImageUrl(response.data.url);
        onImageGenerated(response.data.url);
        onLogoSaved();

        toast({
          title: "Logo generated and saved",
          description: "Your logo has been generated and saved to the gallery.",
        });
      } else {
        setErrorMessage(response.message);
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred");
      console.error("Error generating logo:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const renderPreview = () => {
    if (imageUrl) {
      return (
        <div style={getPreviewStyle()}>
          <Image
            src={imageUrl}
            alt="Generated Logo"
            width={300}
            height={300}
            className="w-full h-full object-contain"
          />
          <Button
            onClick={() => setIsEditing(true)}
            className="absolute top-2 right-2"
            size="sm"
          >
            <Edit2 className="mr-2 h-4 w-4" /> Edit
          </Button>
        </div>
      );
    }
    return (
      <div className="w-full h-full flex items-center justify-center text-muted-foreground">
        Your logo preview will appear here
      </div>
    );
  };

  const getPreviewStyle = () => {
    switch (context) {
      case "businessCard":
        return {
          maxWidth: "350px",
          padding: "20px",
          backgroundColor: "#fff",
          boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
        };
      case "socialMedia":
        return {
          maxWidth: "300px",
          borderRadius: "50%",
          overflow: "hidden",
        };
      default:
        return {};
    }
  };

  const handleSaveEdit = (editedImageUrl: string) => {
    setImageUrl(editedImageUrl);
    onImageGenerated(editedImageUrl);
    setIsEditing(false);
  };

  return (
    <div className="bg-background p-4 md:p-6 rounded-lg shadow-lg mb-12 border-2 border-border">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="flex flex-col gap-4">
          <div>
            <Label htmlFor="prompt">Logo Prompt</Label>
            <Input
              id="prompt"
              placeholder="Describe your logo idea..."
              value={prompt}
              onChange={(e) => setPrompt(e.target.value)}
            />
            <p className="text-sm text-muted-foreground mt-1">
              Tip: Include specific details about style, colors, and symbolism
              for better results.
            </p>
          </div>
          <div>
            <Label htmlFor="name">Name for Logo</Label>
            <Input
              id="name"
              placeholder="Enter name (optional)"
              value={name}
              onChange={(e) => setName(e.target.value)}
            />
          </div>
          <Button
            onClick={handleGenerate}
            className="w-full mt-4"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              "Generate Logo"
            )}
          </Button>
          <Button onClick={onViewGallery} variant="outline" className="w-full">
            <ImageIcon className="mr-2 h-4 w-4" />
            View Gallery
          </Button>
          {errorMessage && (
            <div className="mt-2 p-2 bg-red-100 border border-red-400 text-red-700 rounded">
              <p className="font-bold">Error:</p>
              <p>{errorMessage}</p>
            </div>
          )}
        </div>
        <div className="space-y-4">
          <div>
            <Label htmlFor="context">Preview Context</Label>
            <Select value={context} onValueChange={setContext}>
              <SelectTrigger id="context">
                <SelectValue placeholder="Select preview context" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="default">Default</SelectItem>
                <SelectItem value="businessCard">Business Card</SelectItem>
                <SelectItem value="socialMedia">Social Media</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div
            className="bg-card/45 border-2 border-border rounded-lg p-4 flex items-center
              justify-center aspect-video relative"
          >
            {isLoading ? (
              <div className="col-span-2 flex flex-col items-center justify-center">
                <Loader2 className="h-8 w-8 animate-spin text-primary" />
                <p className="mt-2 text-sm text-muted-foreground">
                  Generating logo...
                </p>
              </div>
            ) : (
              renderPreview()
            )}
          </div>
        </div>
      </div>
      {isEditing && imageUrl && (
        <ImageEditor
          imageUrl={imageUrl}
          onClose={() => setIsEditing(false)}
          onSave={handleSaveEdit}
        />
      )}
    </div>
  );
}
