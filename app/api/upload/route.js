import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import Product from "@/models/Product";
import mongoose from "mongoose";

export async function POST(req) {
  try {
    // koneksi MongoDB
    await mongoose.connect(process.env.MONGODB_URI);

    const data = await req.formData();

    const nama = data.get("nama");
    const jenis = data.get("jenis");
    const harga = data.get("harga"); // dari form (string)
    const deskripsi = data.get("deskripsi")
    const file = data.get("image");

    // ubah file ke buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // upload ke Cloudinary
    const result = await new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream({}, (err, result) => {
        if (err) reject(err);
        else resolve(result);
      }).end(buffer);
    });

    // simpan ke MongoDB (SESUAI MODEL KAMU)
    const product = await Product.create({
      nama,
      jenis,
      Harga: Number(harga), // ⚠️ harus sesuai "Harga"
      deskripsi,
      image_url: result.secure_url,
      macam: [] // default kosong dulu
    });

    return NextResponse.json({
      message: "Berhasil tambah produk",
      data: product
    });

  } catch (err) {
    console.error(err);
    return NextResponse.json({ error: err.message });
  }
}