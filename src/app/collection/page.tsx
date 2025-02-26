"use client";

import { useEffect, useState, useCallback } from "react";
import { useRouter, useParams } from "next/navigation";
import { auth, db } from "@/lib/firebaseConfig";
import { collection, deleteDoc, doc, getDocs } from "firebase/firestore";
import Image from "next/image";

const CollectionDetail = () => {
  const router = useRouter();
  const params = useParams();
  const id = params?.id as string;

  const [images, setImages] = useState<{ id: string; url: string }[]>([]);
  const [collectionName, setCollectionName] = useState("");
  const [hoveredImage, setHoveredImage] = useState<string | null>(null);

  useEffect(() => {
    if (!id) {
      console.error("❌ Không tìm thấy ID bộ sưu tập");
      router.push("/personal");
    }
  }, [id, router]);

  const fetchCollection = useCallback(async () => {
    if (!auth.currentUser || !id) return; // Kiểm tra người dùng đăng nhập và id hợp lệ

    try {
      const userId = auth.currentUser.uid; // Lấy id người dùng
      const imagesRef = collection(db, "users", userId, "collections", id, "images"); // Lấy ref ảnh trong bộ sưu tập
      const querySnapshot = await getDocs(imagesRef); // Lấy dữ liệu ảnh

      const fetchedImages = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        url: doc.data().url, // Trích xuất id và url của mỗi ảnh
      }));
      setImages(fetchedImages); // Cập nhật danh sách ảnh
      setCollectionName(`Bộ sưu tập ${id}`); // Cập nhật tên bộ sưu tập
    } catch (error) {
      console.error("❌ Lỗi khi lấy ảnh:", error); // Xử lý lỗi khi lấy ảnh
    }
  }, [id]); // Chạy lại khi id thay đổi

  // Hàm xóa ảnh
  const deleteImage = async (imageId: string) => {
    if (!auth.currentUser || !id) return; // Kiểm tra người dùng đăng nhập và id hợp lệ

    const confirmDelete = confirm("Bạn có chắc muốn xóa ảnh này?"); // Xác nhận xóa ảnh
    if (!confirmDelete) return; // Nếu không xác nhận thì không làm gì

    try {
      const userId = auth.currentUser.uid; // Lấy id người dùng
      await deleteDoc(doc(db, "users", userId, "collections", id, "images", imageId)); // Xóa ảnh khỏi Firestore
      setImages((prevImages) => prevImages.filter((image) => image.id !== imageId)); // Cập nhật lại UI sau khi xóa ảnh
    } catch (error) {
      console.error("❌ Lỗi khi xóa ảnh:", error); // Xử lý lỗi khi xóa ảnh
    }
  };

  // Hàm xóa bộ sưu tập
  const deleteCollection = async () => {
    if (!auth.currentUser || !id) return; // Kiểm tra người dùng đăng nhập và id hợp lệ

    const confirmDelete = confirm("Bạn có chắc muốn xóa bộ sưu tập này?"); // Xác nhận xóa bộ sưu tập
    if (!confirmDelete) return; // Nếu không xác nhận thì không làm gì

    try {
      const userId = auth.currentUser.uid; // Lấy id người dùng
      await deleteDoc(doc(db, "users", userId, "collections", id)); // Xóa bộ sưu tập khỏi Firestore
      alert("✅ Đã xóa bộ sưu tập!"); // Thông báo xóa thành công
      router.push("/personal"); // Điều hướng về trang 
    } catch (error) {
      console.error("❌ Lỗi khi xóa bộ sưu tập:", error); // Xử lý lỗi khi xóa bộ sưu tập
    }
  };

  useEffect(() => {
    if (id) fetchCollection(); // Gọi hàm fetchCollection nếu có id
  }, [id, fetchCollection]); // Chạy lại khi id hoặc fetchCollection thay đổi

  return (
    <div className="flex flex-col items-center min-h-screen bg-gray-100 p-6">
      <div className="max-w-4xl w-full bg-white p-6 rounded-lg shadow-lg">
        {/* Tiêu đề + Nút Xóa */}
        <div className="flex justify-between items-center mb-4">
          <h1 className="text-2xl font-bold">{collectionName}</h1>
          <button
            onClick={deleteCollection} // Gọi hàm xóa bộ sưu tập
            className="px-4 py-2 text-white bg-red-500 rounded-md hover:bg-red-600 transition"
          >
            🗑 Xóa bộ sưu tập
          </button>
        </div>

        {/* Hiển thị ảnh trong bộ sưu tập */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {images.length > 0 ? (
            images.map((image) => (
              <div
                key={image.id}
                className="relative group overflow-hidden rounded-lg shadow-md"
                onMouseEnter={() => setHoveredImage(image.id)} // Set ảnh đang hover
                onMouseLeave={() => setHoveredImage(null)} // Hủy hover
              >
                <Image
                  src={image.url}
                  alt="Ảnh"
                  width={300}
                  height={200}
                  className="w-full h-40 object-cover transition-transform transform group-hover:scale-105" // Hiệu ứng phóng to khi hover
                />

                {/* Nút xóa chỉ hiển thị khi hover */}
                {hoveredImage === image.id && (
                  <button
                    onClick={() => deleteImage(image.id)} // Gọi hàm xóa ảnh
                    className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded opacity-80 hover:opacity-100"
                  >
                    Xóa
                  </button>
                )}
              </div>
            ))
          ) : (
            <p className="text-gray-500 text-center w-full">Chưa có ảnh nào trong bộ sưu tập.</p> // Hiển thị nếu không có ảnh
          )}
        </div>
      </div>
    </div>
  );
};

export default CollectionDetail;
