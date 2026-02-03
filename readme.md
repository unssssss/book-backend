DOKUMENTASI PEMBUATAN BACKEND

start the server = cd backend; node server.js; (shows server runninh on port ....., MongoDb connected)

token untuk buat jwt secret yang akan expire dalam 1 jam setelah login

if a PORT doesnt work its bcs its been used before so u have to change it

code 200 = ok
code 400 = bad request

express js = framework
package.json = library, "dependencies"

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

CRUD :

- C create
- R read
- U update
- D delete

////////////////////////////////////////////////////////////////
////////////////////////////////////////////////////////////////

1. folder structure:

- MIDDLEWARE:
  - auth.js: konfirmasi jwt (json web token)


- MODELS:(untuk interaksi dengan database)
  
  - Book.js: template untuk suatu buku (nama, deskripsi, id category, id user, jumlah, harga, waktu upload)

  - Category.js: template untuk suatu kategori (name, deskripsi, id user, warna, aktif/tidak)

  - User.js: template untuk user (nama, password, waktu pembuatan)


- ROUTES: (ada router.get [ada juga router.get("/:id") untuk mengambil id], router.post, router.put, router.delete)

router.get: mengambil semua item/isi
router.get("/:id"): mengambil 1 item/isi
router.post: membuat/mengupload suatu hal
router.put: memperbarui data yang sudah ada di server
router.delete

  users.js:mengambil(get), post(membuat), delete(menghapus) user
  
  books.js:mengambil, mengambil dengan id, membuat, mengupdate, menghapus buku
  
  categories.js:mengambil, mengambil dengan id, membuat, mengupdate, menghapus categori

2. files:

- server.js: membuat koneksi aktif ke data MongoDB
- .env:menyimpan kunci API, username & password, token, dll
- package.json: File ini berfungsi sebagai "kartu identitas" untuk proyek, sangat penting untuk menggunakan CLI npm (Node Package Manager), dan memastikan konsistensi di berbagai lingkungan pengembangan. 

3. installation:
   --> program mulai dari buat folder backend -> node install (untuk install environment backend)
   --> install library (npm i bcrypt cors dotenv express jsonwebtoken mongoose)

mongoose: database noSQL
