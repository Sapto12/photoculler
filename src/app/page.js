"use client";


import { useState } from "react";
import {Upload, Sparkles, CheckCircle, HelpCircle, XCircle, Image as ImageIcon} from "lucide-react";
import {Button} from "@/components/ui/button";
import {Card} from "@/components/ui/card";
import {Tabs, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Badge} from "@/components/ui/badge";
import { Main } from "next/document";


export default function Home(){
  const [photo, setPhotos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isProcessing, setIsProcessing] = useState(false);


  const handleFileUpload = (e) => {
    const file = Array.from(e.target.files);
    const newPhotos = files.map((file, index) => ({
      id: Date.now() + index,
      file, 
      url: URL.createObjectURL(file),
      name: file.name,
      category: "pending",
      score: null,
    }));
    setPhotos((prev) => [...prev, ...newPhotos]);
  };


  const filteredPhotos = Photos.filter((photo) => {
    if (filter === "all") return true;
    return photo.category === filter;

  });

  const getCount = (cat) => photos.filter((p) => p.category === cat).length;
  return(
    <main className="max-w-7xl mx-auto px-4 py-8">
      <header className="flex flex-col "
    </main>
  );
}