# E-commerce Platform Backend

## Tujuan

Proyek ini adalah backend untuk platform e-commerce sederhana yang memungkinkan pengguna untuk menjelajahi produk, mengelola keranjang belanja, dan melakukan pemesanan. Dibangun menggunakan Node.js, Express.js, dan Sequelize ORM dengan MySQL, serta menggunakan jsonwebtoken dan bcrypt untuk autentikasi.

## Fitur

1. **Fitur Autentikasi**

   - Registrasi pengguna baru
   - Login pengguna yang aman

2. **Manajemen Produk**

   - Menampilkan daftar produk dengan pencarian, pengurutan, dan filter
   - Menampilkan detail produk
   - Menambahkan produk ke keranjang

3. **Keranjang Belanja**

   - Menampilkan isi keranjang
   - Memperbarui produk di dalam keranjang

4. **Proses Pemesanan**
   - Membuat pesanan dari item di keranjang
   - Menampilkan riwayat dan detail pesanan pengguna

## Endpoint

### Autentikasi

- **POST /api/v1/auth/register**: Mendaftarkan pengguna baru.
- **POST /api/v1/auth/login**: Melakukan login pengguna.

### Manajemen Produk

- **GET /api/v1/products**: Mendapatkan daftar semua produk (dengan pagination, filter, dan sorting).
- **GET /api/v1/products/:id**: Mendapatkan detail produk berdasarkan ID.

### Keranjang Belanja

- **POST /api/v1/carts**: Menambahkan produk ke keranjang.
- **GET /api/v1/carts**: Melihat daftar produk di dalam keranjang.
- **PATCH /api/v1/carts/:id**: Memperbarui jumlah produk di dalam keranjang.
- **PUT /api/v1/carts/:id**: Memperbarui produk di dalam keranjang.

### Pemesanan

- **POST /api/v1/orders**: Membuat pesanan baru berdasarkan produk di keranjang.
- **GET /api/v1/orders**: Melihat daftar pesanan pengguna.
- **GET /api/v1/orders/:id**: Melihat detail pesanan berdasarkan ID.

## Penggunaan

Anda dapat menggunakan `Collections` dan `Environment` _postman_ yang tersedia pada folder `document`. ERD juga tersedia pada folder tersebut.

## Setup

1. **Clone Repository**

   ```bash
   git clone https://github.com/agiladis/express-ecommerce-api.git
   cd express-ecommerce-api

   ```

2. **Install Dependencies**

   ```bash
   npm install

   ```

3. **Setup Environment Variables**
   Buat file `.env` sesuai dengan file `.env.example`.

4. **Start Server**
   ```bash
   npm start
   ```

## Teknologi yang Digunakan

- Node.js
- Express.js
- Sequelize ORM
- MySQL
- jsonwebtoken
- bcrypt
