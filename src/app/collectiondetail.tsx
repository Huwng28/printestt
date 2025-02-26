"use client";
import { useEffect, useState } from "react";
import { collection, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebaseConfig";
import Image from "next/image";

const CollectionDetail = ({ params }: { params: { id: string } }) => {
    const [images, setImages] = useState<{ id: string; url: string }[]>([]);

    useEffect(() => {
        if (!params?.id) return;

        const fetchImages = async () => {
            try {
                const imagesRef = collection(db, "collections", params.id, "images");
                const querySnapshot = await getDocs(imagesRef);
                const fetchedImages = querySnapshot.docs.map((doc) => ({
                    id: doc.id,
                    url: doc.data().url,
                }));

                setImages(fetchedImages);
            } catch (error) {
                console.error("🔥 Lỗi khi lấy ảnh:", error);
            }
        };

        fetchImages();
    }, [params?.id]);

    return (
        <div>
            <h1>Bộ sưu tập: {params?.id}</h1>
            {images.length > 0 ? (
                images.map((img) => (
                    <Image key={img.id} src={img.url} alt="Ảnh" width={300} height={200} />
                ))
            ) : (
                <p>Không có ảnh nào</p>
            )}
        </div>
    );
};

export default CollectionDetail;
