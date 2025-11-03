import { useEffect, useState } from "react";
import { Card } from "./ui/card";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "./ui/dialog";
import { Plus } from "lucide-react";
import { ImageWithFallback } from "./figma/ImageWithFallback";

type Photo = { id:string; caption:string; date:string; url:string };

export function Gallery() {
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  const [showUpload, setShowUpload] = useState(false);
  const [photos, setPhotos] = useState<Photo[]>([]);
  const [newUrl, setNewUrl] = useState("");
  const [newCaption, setNewCaption] = useState("");

  useEffect(() => {
    (async () => {
      try {
        const res = await fetch("/api/gallery");
        const json = await res.json();
        if (json.ok) setPhotos(json.data);
      } catch (e) { console.error(e); }
    })();
  }, []);

  const handleUpload = async () => {
    if (!newUrl) return;
    try {
      const res = await fetch("/api/gallery", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ url: newUrl, caption: newCaption }),
      });
      const json = await res.json();
      if (json.ok) {
        setShowUpload(false);
        setNewUrl(""); setNewCaption("");
        // recargar
        const r2 = await fetch("/api/gallery"); const j2 = await r2.json();
        if (j2.ok) setPhotos(j2.data);
      }
    } catch (e) { console.error(e); }
  };

  const selectedPhoto = selectedImage ? photos.find(p => p.id === selectedImage) : null;

  return (
    <div className="space-y-6">
      {/* header igual */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 sm:gap-0">
        <div>
          <h2 className="text-[#C41C1C]" style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', fontWeight: 700, letterSpacing: '-0.01em' }}>
            Galería de Momentos
          </h2>
          <p className="text-[#5A5A5A] mt-1" style={{ fontSize: 'clamp(0.875rem, 2vw, 1rem)' }}>
            Capturando nuestro viaje en la ciencia
          </p>
        </div>
        <button onClick={() => setShowUpload(true)} className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#C41C1C] text-white flex items-center justify-center shadow-lg hover:bg-[#A01515] transition-all duration-300 hover:scale-110 flex-shrink-0">
          <Plus className="w-5 h-5 sm:w-6 sm:h-6" />
        </button>
      </div>

      {/* grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
        {photos.map((photo) => (
          <Card key={photo.id} onClick={() => setSelectedImage(photo.id)} className="border-none shadow-lg cursor-pointer overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl group" style={{ borderRadius: '16px' }}>
            <div className="relative aspect-square bg-gradient-to-br from-[#F5EFE6] to-[#E5DDD4]">
              <ImageWithFallback src={photo.url} alt={photo.caption} className="w-full h-full object-cover" />
              <div className="absolute inset-0 bg-[#C41C1C]/90 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-6">
                <div className="text-center text-white">
                  <p style={{ fontSize: '1rem', fontWeight: 600 }}>{photo.caption}</p>
                  <p className="text-white/80 mt-2" style={{ fontSize: '0.875rem' }}>{photo.date}</p>
                </div>
              </div>
            </div>
          </Card>
        ))}
        {photos.length === 0 && <div className="text-center text-[#5A5A5A] col-span-full">Aún no hay fotos.</div>}
      </div>

      {/* modal ver */}
      {selectedPhoto && (
        <Dialog open={!!selectedImage} onOpenChange={() => setSelectedImage(null)}>
          <DialogContent className="max-w-4xl" style={{ borderRadius: '16px' }}>
            <DialogHeader>
              <DialogTitle className="text-[#1E1E1E]" style={{ fontSize: '1.5rem', fontWeight: 700 }}>{selectedPhoto.caption}</DialogTitle>
            </DialogHeader>
            <div className="space-y-4">
              <div className="relative aspect-video bg-gradient-to-br from-[#F5EFE6] to-[#E5DDD4] rounded-xl overflow-hidden">
                <ImageWithFallback src={selectedPhoto.url} alt={selectedPhoto.caption} className="w-full h-full object-cover" />
              </div>
              <p className="text-[#5A5A5A]" style={{ fontSize: '1rem' }}>{selectedPhoto.date}</p>
            </div>
          </DialogContent>
        </Dialog>
      )}

      {/* modal subir */}
      {showUpload && (
        <Dialog open={showUpload} onOpenChange={setShowUpload}>
          <DialogContent style={{ borderRadius: '16px' }}>
            <DialogHeader><DialogTitle className="text-[#1E1E1E]" style={{ fontSize: '1.5rem', fontWeight: 700 }}>Subir Nueva Foto</DialogTitle></DialogHeader>
            <div className="space-y-4">
              <input className="w-full border rounded-lg p-2" placeholder="URL de la imagen" value={newUrl} onChange={e=>setNewUrl(e.target.value)} />
              <input className="w-full border rounded-lg p-2" placeholder="Título / caption" value={newCaption} onChange={e=>setNewCaption(e.target.value)} />
              <button onClick={handleUpload} className="w-full rounded-xl bg-[#C41C1C] text-white py-2 hover:bg-[#A01515]">Guardar</button>
            </div>
          </DialogContent>
        </Dialog>
      )}
    </div>
  );
}
