import FileUploadContainer from "@/components/file-upload-container";
import Image from "next/image";

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="w-full max-w-2xl mx-auto text-center">
        {/* Logo */}
        <img
          src="/fysee.png"
          alt="Fysee AI Logo"
          className="mx-auto mb-6 w-50 h-44 object-contain rounded-xl"
        />

        {/* Nama Aplikasi */}
        <h1 className="text-3xl font-bold mb-4">Fysee-ai</h1>

        {/* Deskripsi Aplikasi */}
        <p className="text-lg text-muted-foreground mb-8">
          Aplikasi pembuat deskripsi tentang gambar secara otomatis dengan
          bantuan AI.
        </p>

        {/* File Upload */}
        <FileUploadContainer />

        {/* Footer */}
        <footer className="mt-10 text-sm text-muted-foreground">
          © {new Date().getFullYear()} Muhammad Farsya Surya
        </footer>
      </div>
    </main>
  );
}
