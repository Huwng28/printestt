" use client "; // ✅ Đảm bảo chạy trên client

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { auth, db } from "@/lib/firebaseConfig";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import Image from "next/image";

const CollectionDetail = () => {
  const router = useRouter();
  const params = useParams();
  const id = typeof params?.id === "string" ? params.id : params?.id?.[0]; // 🔥 Kiểm tra id

  const [images, setImages] = useState<Array<{ id: string; url: string }>>([]);
  const [collectionName, setCollectionName] = useState<string>("Đang tải...");
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);
  const [loading, setLoading] = useState(true); // ✅ Thêm trạng thái loading

  // 🔥 Kiểm tra nếu ID không tồn tại, chuyển hướng về `/personal`
  useEffect(() => {
    if (!id) {
      console.error("❌ Không tìm thấy ID bộ sưu tập");
      router.push("/personal");
    }
  }, [id, router]);

  // ✅ Hàm lấy ảnh từ Firestore
  const fetchCollection = useCallback(async () => {
    if (!id || !auth.currentUser) return;

    try {
      setLoading(true); // Bắt đầu tải dữ liệu
      const userId = auth.currentUser.uid;
      const imagesRef = collection(db, "users", userId, "collections", id, "images");
      const querySnapshot = await getDocs(imagesRef);

      setCollectionName(querySnapshot.empty ? "Bộ sưu tập trống" : `Bộ sưu tập ${id}`);
      setImages(querySnapshot.docs.map(doc => ({ id: doc.id, url: doc.data().url as string })));
    } catch (error) {
      console.error("❌ Lỗi khi lấy ảnh:", error);
    } finally {
      setLoading(false); // Dừng trạng thái loading
    }
  }, [id]);

  // 🚀 Gọi `fetchCollection` khi ID thay đổi
  useEffect(() => {
    if (id) fetchCollection();
  }, [id, fetchCollection]);

  // ✅ Hàm xóa ảnh
  const deleteImage = async (imageId: string) => {
    if (!auth.currentUser || !id) return;
    if (!confirm("Bạn có chắc muốn xóa ảnh này?")) return;

    try {
      const userId = auth.currentUser.uid;
      await deleteDoc(doc(db, "users", userId, "collections", id, "images", imageId));
      setImages(prevImages => prevImages.filter(image => image.id !== imageId));
    } catch (error) {
      console.error("❌ Lỗi khi xóa ảnh:", error);
    }
  };

  // ✅ Hàm xóa bộ sưu tập (bao gồm xóa toàn bộ ảnh bên trong)
  const deleteCollection = async () => {
    if (!auth.currentUser || !id) return;
    if (!confirm("Bạn có chắc muốn xóa bộ sưu tập này?")) return;

    try {
      const userId = auth.currentUser.uid;

      // Xóa tất cả ảnh trong bộ sưu tập trước
      const imagesRef = collection(db, "users", userId, "collections", id, "images");
      const imagesSnapshot = await getDocs(imagesRef);
      const deletePromises = imagesSnapshot.docs.map(imageDoc => deleteDoc(imageDoc.ref));
      await Promise.all(deletePromises);

      // Xóa bộ sưu tập chính
      await deleteDoc(doc(db, "users", userId, "collections", id));
      alert("✅ Đã xóa bộ sưu tập!");
      router.push("/personal");
    } catch (error) {
      console.error("❌ Lỗi khi xóa bộ sưu tập:", error);
    }
  };

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-lg">
        {/* Tiêu đề + Nút Xóa */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{loading ? "Đang tải..." : collectionName}</h1>
          <button
            onClick={deleteCollection}
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition"
          >
            🗑 Xóa bộ sưu tập
          </button>
        </div>

        {/* Hiển thị ảnh trong bộ sưu tập */}
        {loading ? (
          <p className="text-gray-500 text-center w-full">Đang tải ảnh...</p>
        ) : images.length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {images.map(image => (
              <div
                key={image.id}
                className="relative group overflow-hidden rounded-lg shadow-md"
                onMouseEnter={() => setHoveredImage(image.id)}
                onMouseLeave={() => setHoveredImage(null)}
              >
                <Image
                  src={image.url}
                  alt="Ảnh"
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover transition-transform transform group-hover:scale-105"
                  priority
                />

                {/* Nút xóa chỉ hiển thị khi hover */}
                {hoveredImage === image.id && (
                  <button
                    onClick={() => deleteImage(image.id)}
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded opacity-80 hover:opacity-100"
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 text-center w-full">Chưa có ảnh nào trong bộ sưu tập.</p>
        )}
      </div>
    </div>
  );
};

export default CollectionDetail;
