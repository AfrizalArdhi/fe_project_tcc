# Gunakan image ringan Node.js berbasis Alpine
FROM node:18-alpine

# Buat dan pindah ke working directory
WORKDIR /app

# Salin file konfigurasi terlebih dahulu untuk memanfaatkan layer cache
COPY package.json package-lock.json* ./

# Install dependency dulu (lebih cepat karena belum copy semua source code)
RUN npm install

# Salin seluruh kode proyek ke dalam image
COPY . .

# Port default untuk React (biasanya 3000, sesuaikan jika beda)
EXPOSE 3000

# Jalankan aplikasi
CMD ["npm", "start"]
