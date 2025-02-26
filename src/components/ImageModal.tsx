"use client";

import Image from "next/image";
import { useEffect } from "react";

interface ImageData {
  id: string;
  src: string;
  fullSrc: string;
  alt: string;
}

interface ImageModalProps {
  image: ImageData;
  onClose: () => void;
}

const ImageModal: React.FC<ImageModalProps> = ({ image, onClose }) => {
  useEffect(() => {
    const handleEsc = (event: KeyboardEvent) => {
      if (event.key === "Escape") onClose(); // Đóng modal khi nhấn Escape
    };
    document.addEventListener("keydown", handleEsc);
    return () => document.removeEventListener("keydown", handleEsc); // Dọn dẹp khi component bị hủy
  }, [onClose]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 flex justify-center items-center z-50">
      <div className="relative">
        {/* ✅ Định dạng ảnh tự động co lại nếu quá to */}
        <div className="relative max-w-[90vw] max-h-[80vh]">
          <Image
            src={image.fullSrc}
            alt={image.alt}
            width={0} // Next.js sẽ tự tính toán
            height={0}
            sizes="90vw"
            className="w-auto h-auto max-w-[90vw] max-h-[80vh] object-contain rounded-lg"
            quality={80} //  Bây giờ sẽ có hiệu lực            
            priority

          />

          {/*  Nút đóng (✖) gắn vào góc trên bên phải của ảnh */}
          <button
            className="absolute top-1 right-1 translate-x-1/2 -translate-y-1/2 text-white px-3 py-1 rounded-full z-10"
            onClick={onClose}
          >
            ✖
          </button>

          {/*  Nút tải ảnh trên mobile */}
          <button
            className="absolute bottom-0 left-1/2 -translate-x-1/2 bg-blue-500 text-white py-2 px-6 rounded-lg shadow-lg"
            onClick={() => downloadImage(image.fullSrc)}
          >
            Tải ảnh
          </button>
        </div>
      </div>
    </div>
  );
};

const downloadImage = async (url: string) => {
  const response = await fetch(url); // Lấy ảnh từ URL
  const blob = await response.blob(); // Chuyển đổi ảnh thành blob
  const link = document.createElement("a"); // Tạo một link để tải về
  link.href = URL.createObjectURL(blob); // Tạo URL cho blob
  link.download = "downloaded-image.jpg"; // Đặt tên file khi tải về
  link.click(); // Thực hiện tải ảnh
  URL.revokeObjectURL(link.href); // Giải phóng URL blob sau khi tải xong
};

export default ImageModal;
