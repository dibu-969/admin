"use client";

import { useState } from "react";
import styles from "./Form.module.css";

export default function Form() {
  const [nama, setNama] = useState("");
  const [harga, setHarga] = useState("");
  const [jenis, setJenis] = useState("");
  const [deskripsi, setDeskripsi] = useState("");
  const [image, setImage] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!image) {
      alert("Pilih gambar dulu!");
      return;
    }

    const formData = new FormData();
    formData.append("nama", nama);
    formData.append("harga", harga);
    formData.append("jenis", jenis);
    formData.append("deskripsi", deskripsi);
    formData.append("image", image);

    const res = await fetch("/api/upload", {
      method: "POST",
      body: formData,
    });

    const data = await res.json();

    if (!res.ok) {
      alert("Gagal: " + data.error);
    } else {
      alert("Berhasil upload!");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2>Tambah Produk</h2>

      <div className={styles.formGroup}>
        <label>Nama Barang</label>
        <input 
          value={nama} 
          onChange={(e) => setNama(e.target.value)} 
        />
      </div>

      <div className={styles.formGroup}>
        <label>Jenis</label>
        <input 
          value={jenis} 
          onChange={(e) => setJenis(e.target.value)} 
        />
      </div>

      <div className={styles.formGroup}>
        <label>Harga</label>
        <input 
          type="number"
          value={harga} 
          onChange={(e) => setHarga(e.target.value)} 
        />
      </div>

      <div className={styles.formGroup}>
        <label>Deskripsi</label>
        <textarea 
          value={deskripsi} 
          onChange={(e) => setDeskripsi(e.target.value)} 
        />
      </div>

      <div className={styles.formGroup}>
        <label>Gambar</label>
        <input 
          type="file" 
          onChange={(e) => setImage(e.target.files[0])} 
        />
      </div>

      <button type="submit">Tambah Produk</button>
    </form>
  );
}