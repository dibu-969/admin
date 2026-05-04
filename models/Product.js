import mongoose from "mongoose";

const ProdukSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  jenis: { type: String },
  posisi: { 
  type: String,
  enum: [
    "Etalase 1", "Etalase 2", "Etalase 3",
    "Rak 1", "Rak 2", "Rak 3", "Rak 4", "Rak 5"
  ], required: true
  },
  
  Harga: { type: Number, required: true },
  harga_beli: { type: Number }, // 👈 tambahan (optional)
  deskripsi: { type: String },
  image_url: { type: String },
  macam: [
    {
      ukuran: String,
      Harga: Number,
      harga_beli: Number, 
      image_url: String
    }
  ]
}, { _id: true });

export default mongoose.models.Produk ||
  mongoose.model("Produk", ProdukSchema, "PRODUK");