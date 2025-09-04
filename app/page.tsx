import FileUploadContainer from "@/components/file-upload-container";
import Image from "next/image";

export default function Home() {
  return (
    <main
      className="flex min-h-screen w-full flex-col items-center justify-between p-6 bg-cover bg-center bg-no-repeat"
      style={{ backgroundImage: "url('/bg2.jpg')" }}
    >
      <div className="w-full max-w-2xl mx-auto text-center bg-white/80 backdrop-blur-sm rounded-2xl p-8 shadow-xl">
        {/* Logo */}
        <img
          src="/fysee.png"
          alt="Fysee OCR Logo"
          className="mx-auto mb-6 w-40 h-32 object-contain rounded-xl"
        />

        {/* Nama Aplikasi */}
        <h1 className="text-3xl font-bold mb-4">Fysee OCR</h1>

        {/* Deskripsi Aplikasi */}
        <p className="text-lg text-gray-700 mb-8">
          Aplikasi AI yang dapat mengubah teks dari gambar menjadi tulisan yang
          bisa kamu salin dan gunakan kembali. Cukup unggah gambar, dan biarkan
          AI mengekstrak teksnya untukmu.
        </p>

        {/* File Upload */}
        <FileUploadContainer />

        {/* Footer */}
        <footer className="mt-10 text-sm text-gray-600">
          © {new Date().getFullYear()} Muhammad Farsya Surya
        </footer>
      </div>
    </main>
  );
}
