"use client";

import { useState } from "react";
import styles from "./Form.module.css";

export default function Form() {
  // --- State Utama (Parent) ---
  const [nama, setNama] = useState("");
  const [jenis, setJenis] = useState("");
  const [posisi, setPosisi] = useState("");
  const [hargaUtama, setHargaUtama] = useState(""); // Field: Harga
  const [hargaBeliUtama, setHargaBeliUtama] = useState(""); // Field: harga_beli
  const [deskripsi, setDeskripsi] = useState("");
  const [imageUtama, setImageUtama] = useState(null);

  // --- State Varian (macam) ---
  const [macam, setMacam] = useState([
    { ukuran: "", Harga: "", harga_beli: "", image: null }
  ]);

  // Handler untuk menambah baris varian baru
  const addMacam = () => {
    setMacam([...macam, { ukuran: "", Harga: "", harga_beli: "", image: null }]);
  };

  // Handler untuk update teks di dalam array macam
  const handleMacamChange = (index, field, value) => {
    const updatedMacam = [...macam];
    updatedMacam[index][field] = value;
    setMacam(updatedMacam);
  };

  // Handler untuk update file gambar di dalam array macam
  const handleMacamImage = (index, file) => {
    const updatedMacam = [...macam];
    updatedMacam[index].image = file;
    setMacam(updatedMacam);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    // Append data Parent
    formData.append("nama", nama);
    formData.append("jenis", jenis);
    formData.append("posisi", posisi);
    formData.append("Harga", hargaUtama);
    formData.append("harga_beli", hargaBeliUtama);
    formData.append("deskripsi", deskripsi);
    if (imageUtama) formData.append("imageUtama", imageUtama);

    // Append data Macam (Varian)
    macam.forEach((item, index) => {
      formData.append(`macam[${index}][ukuran]`, item.ukuran);
      formData.append(`macam[${index}][Harga]`, item.Harga);
      formData.append(`macam[${index}][harga_beli]`, item.harga_beli);
      if (item.image) {
        // Kita gunakan field name berbeda atau array untuk file
        formData.append(`macam_images`, item.image); 
      }
    });

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (res.ok) {
        alert("Produk berhasil disimpan!");
      } else {
        const errorData = await res.json();
        alert("Gagal: " + errorData.error);
      }
    } catch (err) {
      console.error(err);
      alert("Terjadi kesalahan sistem.");
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.formContainer}>
      <h2>Tambah Produk & Varian</h2>

      {/* Input Data Utama */}
      <div className={styles.formGroup}>
        <label>Nama Barang</label>
        <input value={nama} onChange={(e) => setNama(e.target.value)} required />
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label>Jenis</label>
          <input value={jenis} onChange={(e) => setJenis(e.target.value)} />
        </div>
        <div className={styles.formGroup}>
          <label>Posisi</label>
          <select value={posisi} onChange={(e) => setPosisi(e.target.value)} required>
            <option value="">-- Pilih Posisi --</option>
            {["Etalase 1", "Etalase 2", "Etalase 3", "Rak 1", "Rak 2", "Rak 3", "Rak 4", "Rak 5"].map(p => (
              <option key={p} value={p}>{p}</option>
            ))}
          </select>
        </div>
      </div>

      <div className={styles.row}>
        <div className={styles.formGroup}>
          <label>Harga Jual Utama</label>
          <input type="number" value={hargaUtama} onChange={(e) => setHargaUtama(e.target.value)} required />
        </div>
        <div className={styles.formGroup}>
          <label>Harga Beli Utama (Opsional)</label>
          <input type="number" value={hargaBeliUtama} onChange={(e) => setHargaBeliUtama(e.target.value)} />
        </div>
      </div>

      <div className={styles.formGroup}>
        <label>Deskripsi Produk</label>
        <textarea value={deskripsi} onChange={(e) => setDeskripsi(e.target.value)} rows="3" />
      </div>

      <div className={styles.formGroup}>
        <label>Gambar Utama</label>
        <input type="file" onChange={(e) => setImageUtama(e.target.files[0])} />
      </div>

      <hr className={styles.divider} />

      {/* Bagian Varian (Macam) */}
      <div className={styles.macamHeader}>
        <h3>Daftar Varian (Macam)</h3>
        <button type="button" onClick={addMacam} className={styles.btnAdd}>+ Tambah Varian</button>
      </div>

      {macam.map((m, index) => (
        <div key={index} className={styles.macamCard}>
          <h4>Varian #{index + 1}</h4>
          <div className={styles.formGroup}>
            <label>Ukuran / Kapasitas</label>
            <input 
              value={m.ukuran} 
              onChange={(e) => handleMacamChange(index, "ukuran", e.target.value)} 
              placeholder="Contoh: 8/256GB"
            />
          </div>
          <div className={styles.row}>
            <div className={styles.formGroup}>
              <label>Harga Jual Varian</label>
              <input 
                type="number" 
                value={m.Harga} 
                onChange={(e) => handleMacamChange(index, "Harga", e.target.value)} 
              />
            </div>
            <div className={styles.formGroup}>
              <label>Harga Beli Varian</label>
              <input 
                type="number" 
                value={m.harga_beli} 
                onChange={(e) => handleMacamChange(index, "harga_beli", e.target.value)} 
              />
            </div>
          </div>
          <div className={styles.formGroup}>
            <label>Gambar Varian</label>
            <input type="file" onChange={(e) => handleMacamImage(index, e.target.files[0])} />
          </div>
          {macam.length > 1 && (
            <button type="button" onClick={() => setMacam(macam.filter((_, i) => i !== index))} className={styles.btnRemove}>
              Hapus Varian ini
            </button>
          )}
        </div>
      ))}

      <button type="submit" className={styles.btnSubmit}>Simpan Produk Lengkap</button>
    </form>
  );
}