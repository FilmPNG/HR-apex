const express = require('express');
const router = express.Router();
const employeeController = require('../controllers/employeesController');
const { addEmployee, upload, updateEmployee } = require('../controllers/employeesController');

/**
 * @swagger
 * tags:
 *   name: Employees
 *   description: จัดการข้อมูลพนักงาน
 */

/**
 * @swagger
 * /api/employee/addemployee:
 *   post:
 *     summary: เพิ่มพนักงานใหม่
 *     tags: [Employees]
 *     consumes:
 *       - multipart/form-data
 *     requestBody:
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
 *               profile_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       201:
 *         description: เพิ่มข้อมูลพนักงานสำเร็จ
 */
router.post(
  '/addemployee',
  upload.fields([
    { name: 'file_name', maxCount: 10 },
    { name: 'profile_image', maxCount: 1 },
  ]),
  addEmployee
);

/**
 * @swagger
 * /api/employee/{employee_id}:
 *   patch:
 *     summary: แก้ไขข้อมูลพนักงาน
 *     tags: [Employees]
 *     consumes:
 *       - multipart/form-data
 *     parameters:
 *       - in: path
 *         name: employee_id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสพนักงาน
 *     requestBody:
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
 *               profile_image:
 *                 type: string
 *                 format: binary
 *     responses:
 *       200:
 *         description: แก้ไขข้อมูลพนักงานสำเร็จ
 */
router.patch('/:employee_id', upload.fields([
  { name: 'file_name', maxCount: 10 },
  { name: 'profile_image', maxCount: 1 },
]), updateEmployee);

/**
 * @swagger
 * /api/employee:
 *   get:
 *     summary: ดึงพนักงานทั้งหมด
 *     tags: [Employees]
 *     responses:
 *       200:
 *         description: ดึงข้อมูลพนักงานสำเร็จ
 */
router.get('/', employeeController.getAllEmployees);

/**
 * @swagger
 * /api/employee/{id}:
 *   get:
 *     summary: ดึงข้อมูลพนักงานตาม ID
 *     tags: [Employees]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: รหัสพนักงาน
 *     responses:
 *       200:
 *         description: ดึงข้อมูลพนักงานสำเร็จ
 */
router.get('/:id', employeeController.getEmployeeById);

module.exports = router;
