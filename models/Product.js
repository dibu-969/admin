import mongoose from "mongoose";

const ProdukSchema = new mongoose.Schema({
  nama: { type: String, required: true },
  jenis: { type: String },
  Harga: { type: Number, required: true },
  deskripsi : { type: String},
  image_url: { type: String },
  macam: [
    {
      ukuran: String,
      Harga: Number,
      image_url: String
    }
  ]
}, { _id: true });

const collectionName = "PRODUK";

export default mongoose.models.Produk ||
  mongoose.model("Produk", ProdukSchema, "PRODUK");