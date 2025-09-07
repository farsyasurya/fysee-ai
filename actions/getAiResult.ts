"use server";
import { google } from "@ai-sdk/google";
import { generateText } from "ai";

export const getAiResult = async (prompt: string, file: File) => {
  try {
    const arrayBuffer = await file.arrayBuffer();
    const base64String = Buffer.from(arrayBuffer).toString("base64");

    const result = await generateText({
      model: google("gemini-2.5-flash"),
      messages: [
        {
          role: "system",
          content:
            "Kamu adalah AI yang hanya dirancang untuk mendeteksi atau mengubah teks dari gambar. Jika file yang dikirim tidak berisi teks atau bukan gambar dengan teks, jawab dengan: 'saya hanya dirancang untuk mengubah gambar ke teks'.",
        },
        {
          role: "user",
          content: [
            { type: "text" as const, text: prompt },
            { type: "file" as const, data: base64String, mediaType: file.type },
          ],
        },
      ],
    });

    return result.steps[0].text;
  } catch (err) {
    console.error("Server error:", err);
    throw new Error("Terjadi kesalahan saat memproses gambar.");
  }
};
