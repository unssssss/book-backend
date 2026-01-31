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

- MODELS:

  - Book.js: template untuk suatu buku (nama, deskripsi, id category, id user, jumlah, harga, waktu upload)

  - Category.js: template untuk suatu kategori (name, deskripsi, id user, warna, aktif/tidak)

  - User.js: template untuk user (nama, password, waktu pembuatan)

- ROUTES: (ada router.get [ada juga router.get("/:id") untuk mengambil id], router.post, router.put, router.delete)

router.get: mengambil semua item/isi
router.get("/:id"): mengambil 1 item/isi
router.post: membuat/mengupload suatu hal
router.put: memperbarui data yang sudah ada di server

2. files:

- server.js:
- .env:
- package.json:

3. installation:
   --> program mulai dari buat folder backend -> node install (untuk install environment backend)
   --> install library (npm i bcrypt cors dotenv express jsonwebtoken mongoose)

mongoose: database
