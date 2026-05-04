import { NextResponse } from "next/server";
import cloudinary from "@/lib/cloudinary";
import Produk from "@/models/Product"; // Pastikan nama model sesuai (Produk)
import mongoose from "mongoose";

// Helper function untuk upload buffer ke Cloudinary
const uploadToCloudinary = (buffer) => {
  return new Promise((resolve, reject) => {
    cloudinary.uploader.upload_stream({ folder: "produk_toko" }, (err, result) => {
      if (err) reject(err);
      else resolve(result);
    }).end(buffer);
  });
};

export async function POST(req) {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    const data = await req.formData();

    // 1. Ambil Data Parent
    const nama = data.get("nama");
    const jenis = data.get("jenis");
    const posisi = data.get("posisi");
    const Harga = data.get("Harga");
    const harga_beli = data.get("harga_beli");
    const deskripsi = data.get("deskripsi");
    const mainFile = data.get("imageUtama");

    // 2. Upload Gambar Utama
    let mainImageUrl = "";
    if (mainFile) {
      const buffer = Buffer.from(await mainFile.arrayBuffer());
      const uploadRes = await uploadToCloudinary(buffer);
      mainImageUrl = uploadRes.secure_url;
    }

    // 3. Proses Array 'macam' (Varian)
    const macamData = [];
    const variantFiles = data.getAll("macam_images"); // Ambil semua file varian
    
    // Kita looping berdasarkan index yang dikirim dari frontend
    let index = 0;
    while (data.has(`macam[${index}][ukuran]`)) {
      const ukuran = data.get(`macam[${index}][ukuran]`);
      const vHarga = data.get(`macam[${index}][Harga]`);
      const vHargaBeli = data.get(`macam[${index}][harga_beli]`);
      
      let vImageUrl = "";
      // Cocokkan file gambar berdasarkan urutan upload
      if (variantFiles[index]) {
        const vBuffer = Buffer.from(await variantFiles[index].arrayBuffer());
        const vUploadRes = await uploadToCloudinary(vBuffer);
        vImageUrl = vUploadRes.secure_url;
      }

      macamData.push({
        ukuran,
        Harga: Number(vHarga) || 0,
        harga_beli: Number(vHargaBeli) || 0,
        image_url: vImageUrl
      });

      index++;
    }

    // 4. Validasi Dasar
    if (!nama || !Harga || !posisi) {
      return NextResponse.json({ error: "Data wajib (nama, harga, posisi) belum lengkap!" }, { status: 400 });
    }

    // 5. Simpan ke MongoDB sesuai ProdukSchema
    const produkBaru = await Produk.create({
      nama,
      jenis,
      posisi,
      Harga: Number(Harga),
      harga_beli: harga_beli ? Number(harga_beli) : 0,
      deskripsi,
      image_url: mainImageUrl,
      macam: macamData // Masukkan array varian yang sudah diproses
    });

    return NextResponse.json({
      message: "Berhasil tambah produk dan varian",
      data: produkBaru
    });

  } catch (err) {
    console.error("Error API:", err);
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}