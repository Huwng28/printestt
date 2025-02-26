"use client";

import { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { useSearchParams } from "next/navigation";
import MasonryGrid from "@/components/MasonryGrid";
import ImageModal from "@/components/ImageModal";

interface ImageData {
  id: string;
  src: string;
  fullSrc: string;
  alt: string;
}

function HomePageContent() {
  const [images, setImages] = useState<ImageData[]>([]);
  const [page, setPage] = useState(1);
  const [selectedImage, setSelectedImage] = useState<ImageData | null>(null);
  const observerRef = useRef<HTMLDivElement | null>(null);

  const searchParams = useSearchParams();
  const query = searchParams.get("q") || "";

  const API_KEY = process.env.NEXT_PUBLIC_UNSPLASH_API_KEY;

  // Fetch ảnh từ Unsplash API khi `page` hoặc `query` thay đổi
  const fetchImages = useCallback(async () => {
    if (!API_KEY) {
      console.error("❌ API Key bị thiếu. Kiểm tra file .env.local");
      return;
    }

    try {
      let url = `https://api.unsplash.com/photos?page=${page}&per_page=10&client_id=${API_KEY}`;
      if (query) {
        url = `https://api.unsplash.com/search/photos?page=${page}&per_page=10&query=${encodeURIComponent(query)}&client_id=${API_KEY}`;
      }

      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`Lỗi API: ${res.status}`);

      const data = await res.json();

      const newImages: ImageData[] = (Array.isArray(data) ? data : data.results).map((img: {
        id: string;
        urls: { small: string; full: string };
        alt_description?: string
      }) => ({
        id: img.id,
        src: img.urls.small,
        fullSrc: img.urls.full,
        alt: img.alt_description || "Image",
      }));

      setImages((prev) => {
        const allImages = [...prev, ...newImages];
        return Array.from(new Map(allImages.map((img) => [img.id, img])).values());
      });
    } catch (error) {
      console.error("❌ Lỗi khi fetch ảnh:", error);
    }
  }, [page, query, API_KEY]);

  useEffect(() => {
    fetchImages();
  }, [fetchImages]);

  useEffect(() => {
    if (!observerRef.current) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0].isIntersecting) {
          setPage((prevPage) => prevPage + 1);
        }
      },
      { rootMargin: "1000px" }
    );

    observer.observe(observerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-4">
      <h1 className="text-2xl font-bold mb-4">
        {query ? `Kết quả tìm kiếm: "${query}"` : "Ảnh Mới Nhất"}
      </h1>

      <MasonryGrid
        images={images}
        onImageClick={(image) => setSelectedImage(image)}
      />

      {selectedImage && (
        <ImageModal
          image={selectedImage}
          onClose={() => setSelectedImage(null)}
        />
      )}

      <div ref={observerRef} className="h-10"></div>
    </div>
  );
}

export default function HomePage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <HomePageContent />
    </Suspense>
  );
}
