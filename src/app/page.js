"use client";

import { useState, useEffect, useCallback } from "react";
import { Upload, Sparkles, CheckCircle2, HelpCircle, XCircle, Image as ImageIcon, Loader2, ShieldCheck, Trash2, Download, Maximize2, X, ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { evaluatePhoto } from "@/lib/ai-culling";
import JSZip from "jszip";

export default function Home() {
  const [photos, setPhotos] = useState([]);
  const [filter, setFilter] = useState("all");
  const [isProcessing, setIsProcessing] = useState(false);
  const [isExporting, setIsExporting] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState(0);
  const [statusText, setStatusText] = useState("");
  
  // State untuk Lightbox Modal & Navigasi Indeks Aktif
  const [selectedPhotoIndex, setSelectedPhotoIndex] = useState(null);

  useEffect(() => {
    return () => {
      photos.forEach((p) => URL.revokeObjectURL(p.url));
    };
  }, []);

  const processFiles = (fileList) => {
    const files = Array.from(fileList);
    const validFiles = files.filter((file) => file.type.startsWith("image/"));

    if (validFiles.length !== files.length) {
      alert("Beberapa berkas dilewati karena bukan format gambar yang valid.");
    }

    if (validFiles.length === 0) return;

    const newPhotos = validFiles.map((file, index) => ({
      id: `${Date.now()}-${index}-${Math.random().toString(36).substring(2, 7)}`,
      file,
      url: URL.createObjectURL(file),
      name: file.name,
      category: "pending",
      score: null,
      details: null,
    }));

    setPhotos((prev) => [...prev, ...newPhotos]);
  };

  const handleFileUpload = (e) => {
    if (e.target.files) {
      processFiles(e.target.files);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const handleDrop = (e) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFiles(e.dataTransfer.files);
    }
  };

  const runAICulling = async () => {
    if (photos.length === 0) return;

    setIsProcessing(true);
    setProgress(0);
    setStatusText("Menganalisis Komposisi, Fokus & Exposure...");

    const total = photos.length;
    let updatedPhotos = [...photos];

    for (let i = 0; i < total; i++) {
      setStatusText(`Meneliti foto ${i + 1} dari ${total} (Standar Profesional)...`);
      
      const result = await evaluatePhoto(photos[i].url);

      updatedPhotos[i] = {
        ...updatedPhotos[i],
        category: result.category,
        score: result.score,
        details: result.details,
      };

      setPhotos([...updatedPhotos]);
      setProgress(Math.round(((i + 1) / total) * 100));
    }

    setStatusText("Analisis Fotografi Selesai!");
    setTimeout(() => {
      setIsProcessing(false);
      setStatusText("");
    }, 1500);
  };

  // Ubah Kategori berdasarkan ID foto
  const changeCategoryById = (id, newCategory) => {
    setPhotos((prev) =>
      prev.map((p) => (p.id === id ? { ...p, category: newCategory } : p))
    );
  };

  const removePhoto = (id) => {
    setPhotos((prev) => {
      const target = prev.find((p) => p.id === id);
      if (target) URL.revokeObjectURL(target.url);
      return prev.filter((p) => p.id !== id);
    });
    setSelectedPhotoIndex(null);
  };

  const exportToZip = async () => {
    if (photos.length === 0) return;

    setIsExporting(true);
    setStatusText("Mengemas arsip ZIP...");

    const zip = new JSZip();
    const goodFolder = zip.folder("Bagus_Pro");
    const uncertainFolder = zip.folder("Ragu_Review");
    const badFolder = zip.folder("Jelek_Discard");
    const pendingFolder = zip.folder("Belum_Disortir");

    for (const photo of photos) {
      const arrayBuffer = await photo.file.arrayBuffer();
      if (photo.category === "good") goodFolder.file(photo.name, arrayBuffer);
      else if (photo.category === "uncertain") uncertainFolder.file(photo.name, arrayBuffer);
      else if (photo.category === "bad") badFolder.file(photo.name, arrayBuffer);
      else pendingFolder.file(photo.name, arrayBuffer);
    }

    try {
      const content = await zip.generateAsync({ type: "blob" });
      const url = URL.createObjectURL(content);
      const a = document.createElement("a");
      a.href = url;
      a.download = "Hasil-Culling-Profesional.zip";
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Gagal mengunduh ZIP:", err);
      alert("Gagal mengunduh arsip ZIP.");
    } finally {
      setIsExporting(false);
      setStatusText("");
    }
  };

  const filteredPhotos = photos.filter((photo) => {
    if (filter === "all") return true;
    return photo.category === filter;
  });

  const getCount = (cat) => photos.filter((p) => p.category === cat).length;

  // Navigasi Lightbox via Tombol Keyboard
  const activePhoto = selectedPhotoIndex !== null ? filteredPhotos[selectedPhotoIndex] : null;

  const handleKeyDown = useCallback((e) => {
    if (selectedPhotoIndex === null || !activePhoto) return;

    if (e.key === "ArrowRight") {
      if (selectedPhotoIndex < filteredPhotos.length - 1) {
        setSelectedPhotoIndex(selectedPhotoIndex + 1);
      }
    } else if (e.key === "ArrowLeft") {
      if (selectedPhotoIndex > 0) {
        setSelectedPhotoIndex(selectedPhotoIndex - 1);
      }
    } else if (e.key === "1") {
      changeCategoryById(activePhoto.id, "good");
    } else if (e.key === "2") {
      changeCategoryById(activePhoto.id, "uncertain");
    } else if (e.key === "3") {
      changeCategoryById(activePhoto.id, "bad");
    } else if (e.key === "Escape") {
      setSelectedPhotoIndex(null);
    }
  }, [selectedPhotoIndex, filteredPhotos, activePhoto]);

  useEffect(() => {
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleKeyDown]);

  return (
    <main className="max-w-7xl mx-auto px-4 py-8 relative">
      {/* Navbar / Header */}
      <header className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 pb-6 border-b border-slate-800">
        <div>
          <div className="flex items-center gap-2">
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight bg-gradient-to-r from-blue-400 to-emerald-400 bg-clip-text text-transparent">
              AI Photo Culling
            </h1>
            <Badge variant="outline" className="border-emerald-500/30 text-emerald-400 bg-emerald-950/30 gap-1 text-xs">
              <ShieldCheck className="w-3 h-3" /> 100% Aman & Lokal
            </Badge>
          </div>
          <p className="text-sm text-slate-400 mt-1">
            Sortir otomatis dengan sekali klik hampir sesuai dengan standar fotografer.
          </p>
        </div>

        {photos.length > 0 && (
          <div className="flex items-center gap-3">
            <Button 
              onClick={runAICulling}
              disabled={isProcessing || isExporting}
              className="bg-emerald-600 hover:bg-emerald-500 text-white font-medium gap-2 shadow-lg shadow-emerald-900/20"
            >
              {isProcessing ? <Loader2 className="w-4 h-4 animate-spin" /> : <Sparkles className="w-4 h-4" />}
              {isProcessing ? "Menganalisis Pro..." : "Mulai Sortir Pro"}
            </Button>

            <Button 
              onClick={exportToZip}
              disabled={isProcessing || isExporting}
              variant="outline"
              className="border-slate-700 text-slate-200 hover:bg-slate-800 gap-2"
            >
              {isExporting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Download className="w-4 h-4" />}
              {isExporting ? "Membuat ZIP..." : "Download ZIP"}
            </Button>
          </div>
        )}
      </header>

      {/* Progress Bar */}
      {(isProcessing || isExporting) && (
        <Card className="bg-slate-900 border-slate-800 p-4 mb-8 space-y-2">
          <div className="flex justify-between text-xs text-slate-300">
            <span>{statusText}</span>
            <span className="font-semibold">{progress}%</span>
          </div>
          <Progress value={progress} className="h-2 bg-slate-800" />
        </Card>
      )}

      {/* Upload Dropzone */}
      <Card 
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        className={`border-2 border-dashed transition-all cursor-pointer p-8 text-center mb-8 rounded-2xl ${
          isDragging 
            ? "border-emerald-500 bg-emerald-950/20 scale-[1.01]" 
            : "border-slate-800 bg-slate-900/50 hover:bg-slate-900 hover:border-slate-700"
        }`}
      >
        <input
          type="file"
          multiple
          accept="image/*"
          onChange={handleFileUpload}
          className="hidden"
          id="photo-upload"
        />
        <label htmlFor="photo-upload" className="cursor-pointer flex flex-col items-center justify-center">
          <div className={`w-14 h-14 rounded-full flex items-center justify-center mb-4 transition ${isDragging ? "bg-emerald-500/20 text-emerald-400" : "bg-slate-800 text-slate-300"}`}>
            <Upload className="w-6 h-6" />
          </div>
          <h3 className="text-lg font-semibold text-slate-200">
            {isDragging ? "Lepaskan foto di sini..." : "Pilih atau Tarik Ratusan Foto ke Sini"}
          </h3>
          <p className="text-sm text-slate-400 mt-1">Gunakan panah Keyboard (← / →) dan angka (1, 2, 3) dalam mode preview</p>
          <Button variant="outline" className="mt-4 border-slate-700 text-slate-300 hover:bg-slate-800 pointer-events-none">
            Pilih Berkas Foto
          </Button>
        </label>
      </Card>

      {/* Control Bar & Filter Tabs */}
      {photos.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
            <Tabs defaultValue="all" onValueChange={setFilter} className="w-full sm:w-auto">
              <TabsList className="bg-slate-900 border border-slate-800 p-1">
                <TabsTrigger value="all" className="data-[state=active]:bg-slate-800 text-slate-300">
                  Semua ({photos.length})
                </TabsTrigger>
                <TabsTrigger value="good" className="data-[state=active]:bg-emerald-950 data-[state=active]:text-emerald-400 text-slate-300">
                  Bagus ({getCount("good")})
                </TabsTrigger>
                <TabsTrigger value="uncertain" className="data-[state=active]:bg-amber-950 data-[state=active]:text-amber-400 text-slate-300">
                  Ragu-ragu ({getCount("uncertain")})
                </TabsTrigger>
                <TabsTrigger value="bad" className="data-[state=active]:bg-rose-950 data-[state=active]:text-rose-400 text-slate-300">
                  Jelek ({getCount("bad")})
                </TabsTrigger>
              </TabsList>
            </Tabs>
          </div>

          {/* Grid Preview Foto */}
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
            {filteredPhotos.map((photo, index) => (
              <div 
                key={photo.id} 
                className="group relative bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-sm hover:border-slate-700 transition"
              >
                <div 
                  onClick={() => setSelectedPhotoIndex(index)}
                  className="aspect-square relative overflow-hidden bg-slate-950 cursor-pointer"
                  title="Klik untuk memperbesar foto"
                >
                  <img
                    src={photo.url}
                    alt={photo.name}
                    className="object-cover w-full h-full group-hover:scale-105 transition duration-300"
                  />
                  
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition flex items-center justify-center text-white">
                    <Maximize2 className="w-6 h-6 drop-shadow" />
                  </div>

                  <div className="absolute top-2 left-2 pointer-events-none">
                    {photo.category === "good" && (
                      <Badge className="bg-emerald-500/90 text-white gap-1 shadow"><CheckCircle2 className="w-3 h-3" /> Bagus</Badge>
                    )}
                    {photo.category === "uncertain" && (
                      <Badge className="bg-amber-500/90 text-white gap-1 shadow"><HelpCircle className="w-3 h-3" /> Ragu</Badge>
                    )}
                    {photo.category === "bad" && (
                      <Badge className="bg-rose-500/90 text-white gap-1 shadow"><XCircle className="w-3 h-3" /> Jelek</Badge>
                    )}
                    {photo.category === "pending" && (
                      <Badge variant="outline" className="bg-slate-900/80 border-slate-700 text-slate-400">Belum Disortir</Badge>
                    )}
                  </div>

                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      removePhoto(photo.id);
                    }}
                    className="absolute top-2 right-2 w-7 h-7 bg-slate-950/80 hover:bg-rose-600 text-slate-300 hover:text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition shadow z-10"
                    title="Hapus foto dari daftar"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="p-3 space-y-1.5">
                  <p className="text-xs font-medium text-slate-300 truncate" title={photo.name}>{photo.name}</p>
                  
                  {photo.score !== null && photo.details && (
                    <div className="text-[10px] text-slate-400 space-y-0.5 pt-1 border-t border-slate-800">
                      <div className="flex justify-between">
                        <span>Skor Ketajaman:</span>
                        <span className="font-semibold text-slate-200">{photo.score}/100</span>
                      </div>
                      <div className="truncate text-slate-500" title={photo.details.exposureStatus}>
                        {photo.details.exposureStatus}
                      </div>
                    </div>
                  )}
                  
                  <div className="flex items-center justify-between pt-1 border-t border-slate-800/80 text-[10px]">
                    <span className="text-slate-500">Ubah:</span>
                    <div className="flex gap-1">
                      <button 
                        onClick={() => changeCategoryById(photo.id, "good")}
                        className={`px-1.5 py-0.5 rounded font-medium transition ${photo.category === 'good' ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                        title="Pindah ke Bagus"
                      >
                        B
                      </button>
                      <button 
                        onClick={() => changeCategoryById(photo.id, "uncertain")}
                        className={`px-1.5 py-0.5 rounded font-medium transition ${photo.category === 'uncertain' ? 'bg-amber-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                        title="Pindah ke Ragu-ragu"
                      >
                        R
                      </button>
                      <button 
                        onClick={() => changeCategoryById(photo.id, "bad")}
                        className={`px-1.5 py-0.5 rounded font-medium transition ${photo.category === 'bad' ? 'bg-rose-600 text-white' : 'bg-slate-800 text-slate-400 hover:bg-slate-700'}`}
                        title="Pindah ke Jelek"
                      >
                        J
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      )}

      {/* --- LIGHTBOX MODAL DENGAN NAVIGASI KEYBOARD & PANAH --- */}
      {activePhoto && (
        <div className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-6">
          <div className="relative max-w-5xl w-full max-h-[90vh] bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center px-6 py-4 border-b border-slate-800 bg-slate-950">
              <div>
                <h3 className="text-sm font-semibold text-slate-200 truncate max-w-md">{activePhoto.name}</h3>
                <p className="text-xs text-slate-400 mt-0.5">
                  Foto {selectedPhotoIndex + 1} dari {filteredPhotos.length} | Status: <span className="font-medium text-slate-200 uppercase">{activePhoto.category}</span>
                </p>
              </div>

              <div className="flex items-center gap-3">
                <span className="hidden sm:inline text-[11px] text-slate-500 bg-slate-900 px-2 py-1 rounded border border-slate-800">
                  Shortcut: [←][→] Ganti Foto | [1] Bagus [2] Ragu [3] Jelek
                </span>
                <button
                  onClick={() => setSelectedPhotoIndex(null)}
                  className="w-8 h-8 rounded-full bg-slate-800 hover:bg-slate-700 text-slate-300 flex items-center justify-center transition"
                  title="Tutup Preview (Esc)"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Modal Body (Foto Utuh Sesuai Asli + Tombol Navigasi Kiri Kanan) */}
            <div className="flex-1 overflow-auto flex items-center justify-center bg-black/80 p-6 relative min-h-[400px] max-h-[70vh]">
              
              {/* Tombol Panah Kiri */}
              {selectedPhotoIndex > 0 && (
                <button
                  onClick={() => setSelectedPhotoIndex(selectedPhotoIndex - 1)}
                  className="absolute left-4 z-20 w-10 h-10 bg-slate-950/80 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center transition shadow-lg"
                  title="Foto Sebelumnya (Panah Kiri)"
                >
                  <ChevronLeft className="w-6 h-6" />
                </button>
              )}

              <img
                src={activePhoto.url}
                alt={activePhoto.name}
                className="w-auto h-auto max-w-full max-h-[65vh] object-contain rounded shadow-2xl"
              />

              {/* Tombol Panah Kanan */}
              {selectedPhotoIndex < filteredPhotos.length - 1 && (
                <button
                  onClick={() => setSelectedPhotoIndex(selectedPhotoIndex + 1)}
                  className="absolute right-4 z-20 w-10 h-10 bg-slate-950/80 hover:bg-emerald-600 text-white rounded-full flex items-center justify-center transition shadow-lg"
                  title="Foto Selanjutnya (Panah Kanan)"
                >
                  <ChevronRight className="w-6 h-6" />
                </button>
              )}
            </div>

            {/* Modal Footer / Quick Culling Actions */}
            <div className="px-6 py-4 bg-slate-950 border-t border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-xs text-slate-400">
                {activePhoto.score !== null ? (
                  <span>Ketajaman: <strong className="text-slate-200">{activePhoto.score}/100</strong> | {activePhoto.details?.exposureStatus}</span>
                ) : (
                  <span>Belum dianalisis oleh AI</span>
                )}
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
                <span className="text-xs text-slate-400 mr-2">Ubah (Tekan 1/2/3):</span>
                <Button
                  size="sm"
                  onClick={() => changeCategoryById(activePhoto.id, "good")}
                  className={`${activePhoto.category === "good" ? "bg-emerald-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                >
                  [1] Bagus
                </Button>
                <Button
                  size="sm"
                  onClick={() => changeCategoryById(activePhoto.id, "uncertain")}
                  className={`${activePhoto.category === "uncertain" ? "bg-amber-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                >
                  [2] Ragu
                </Button>
                <Button
                  size="sm"
                  onClick={() => changeCategoryById(activePhoto.id, "bad")}
                  className={`${activePhoto.category === "bad" ? "bg-rose-600 text-white" : "bg-slate-800 text-slate-300 hover:bg-slate-700"}`}
                >
                  [3] Jelek
                </Button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* Empty State */}
      {photos.length === 0 && (
        <div className="text-center py-12 text-slate-500">
          <ImageIcon className="w-12 h-12 mx-auto mb-3 opacity-30" />
          <p>Belum ada foto yang diunggah.</p>
        </div>
      )}
    </main>
  );
}