// import { NextResponse } from 'next/server';
// import multer from 'multer';
// import path from 'path';

// // ตั้งค่า multer สำหรับการอัปโหลดไฟล์
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     // กำหนดที่เก็บไฟล์
//     cb(null, 'public/uploads/');
//   },
//   filename: (req, file, cb) => {
//     // กำหนดชื่อไฟล์ที่บันทึก
//     const fileName = Date.now() + path.extname(file.originalname);
//     cb(null, fileName);
//   },
// });

// const upload = multer({ storage });

// export async function POST(req) {
//   return new Promise((resolve, reject) => {
//     upload.single('image')(req, {}, (err) => {
//       if (err) {
//         return reject(new NextResponse('Error uploading file', { status: 500 }));
//       }
//       // เมื่ออัปโหลดไฟล์สำเร็จ
//       const uploadedFilePath = `/uploads/${req.file.filename}`;
//       return resolve(new NextResponse('Image uploaded successfully', { status: 200 }));
//     });
//   });
// }
// // 