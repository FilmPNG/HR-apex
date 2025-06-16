const express = require('express');
const router = express.Router();
const { 
  getcategorynews, addnews, upload, getNewsById, updatenews, 
  hideNewsById, unhideNewsById, deleteNewsById, 
  pinNewsById, unpinNewsById, getnewsbyadmin, getnewsbyuser, 
  togglePinStatus 
} = require('../controllers/newsControllers');

/**
 * @swagger
 * /api/news/getcategorynews:
 *   get:
 *     summary: ดึงประเภทข่าวทั้งหมด
 *     tags: [News]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getcategorynews/', getcategorynews);

/**
 * @swagger
 * /api/news/getnews/{id}:
 *   get:
 *     summary: ดึงข่าวจาก ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ของข่าว
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getnews/:id', getNewsById);

/**
 * @swagger
 * /api/news/getnewsbyadmin:
 *   get:
 *     summary: ดึงข่าวทั้งหมดสำหรับแอดมิน
 *     tags: [News]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getnewsbyadmin/', getnewsbyadmin);

/**
 * @swagger
 * /api/news/getnewsbyuser:
 *   get:
 *     summary: ดึงข่าวทั้งหมดสำหรับผู้ใช้งาน
 *     tags: [News]
 *     responses:
 *       200:
 *         description: Success
 */
router.get('/getnewsbyuser/', getnewsbyuser);

/**
 * @swagger
 * /api/news/pin/{id}:
 *   patch:
 *     summary: ปักหมุดข่าว
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID ของข่าว
 *     responses:
 *       200:
 *         description: Success
 */
router.patch('/pin/:id', togglePinStatus);

/**
 * @swagger
 * /api/news/unpin/{id}:
 *   put:
 *     summary: เอาหมุดออกจากข่าว
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.put('/unpin/:id', unpinNewsById);

/**
 * @swagger
 * /api/news/unhide/{id}:
 *   put:
 *     summary: แสดงข่าวที่ซ่อนไว้
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.put('/unhide/:id', unhideNewsById);

/**
 * @swagger
 * /api/news/hide/{id}:
 *   put:
 *     summary: ซ่อนข่าว
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Success
 */
router.put('/hide/:id', hideNewsById);

/**
 * @swagger
 * /api/news/addnews:
 *   post:
 *     summary: เพิ่มข่าวใหม่ (สามารถอัปโหลดไฟล์ได้)
 *     tags: [News]
 *     requestBody:
 *       required: true
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file_name:
 *                 type: array
 *                 items:
 *                   type: string
 *                   format: binary
 *     responses:
 *       201:
 *         description: สร้างข่าวสำเร็จ
 */
router.post(
  '/addnews',
  upload.fields([
    { name: 'file_name', maxCount: 10 },
  ]),
  addnews
);

/**
 * @swagger
 * /api/news/updatenews/{id}:
 *   put:
 *     summary: อัปเดตข่าว
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: false
 *       content:
 *         multipart/form-data:
 *           schema:
 *             type: object
 *             properties:
 *               file_name:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: อัปเดตสำเร็จ
 */
router.put('/updatenews/:id', upload.fields([
  { name: 'file_name', maxCount: 1 },
]), updatenews);

/**
 * @swagger
 * /api/news/deletenews/{id}:
 *   delete:
 *     summary: ลบข่าวตาม ID
 *     tags: [News]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: ลบสำเร็จ
 */
router.delete('/deletenews/:id', deleteNewsById);

module.exports = router;
