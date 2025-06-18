const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require("fs");
const { promisify } = require('util');
const pool = require('../config/db'); // เชื่อมต่อฐานข้อมูล MySQL
const router = express.Router();

// Promisify pool.query for async/await usage
const query = promisify(pool.query).bind(pool);

const uploadsDir = path.join(__dirname, "../uploads");

// Create the uploads directory if it doesn't exist
if (!fs.existsSync(uploadsDir)) {
  fs.mkdirSync(uploadsDir, { recursive: true });
}

// Configure multer storage to save files with unique names
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadsDir); // หรือ './uploads'
  },
  filename: (req, file, cb) => {
    let originalName = path.parse(file.originalname).name;
    const ext = path.extname(file.originalname);
    const suffix = '_' + Math.random().toString(36).substring(2, 8);

    // แปลงชื่อให้เป็น UTF-8 (กรณีมีภาษาไทย)
    originalName = Buffer.from(originalName, 'latin1').toString('utf8');

    // ตัดชื่อถ้ายาวเกิน 200 ตัว
    if (originalName.length > 200) {
      originalName = originalName.substring(0, 200);
    }

    const filename = `${originalName}${suffix}${ext}`;
    cb(null, filename);
  }
});

// File filter to allow only specific file types (JPEG, PNG, PDF)
const fileFilter = (req, file, cb) => {
  const allowedTypes = ["image/jpeg", "image/png", "application/pdf"];
  if (allowedTypes.includes(file.mimetype)) {
    cb(null, true);
  } else {
    cb(new Error("Invalid file type. Only JPEG, PNG, and PDF are allowed."), false);
  }
};

// Multer setup for handling file uploads
const upload = multer({ storage, fileFilter });






// Route สำหรับอัพโหลดไฟล์
router.post('/upload', upload.array('files'), (req, res) => {
  const fileUrls = req.files.map(file => `/uploads/${file.filename}`);
  res.status(200).json({ fileUrls });
});

// Route สำหรับเพิ่มข้อมูลการเบิกเงิน
router.post(
  '/add-disbursement',
  upload.fields([
    { name: 'file_name', maxCount: 10 },
  ]),
  addDisbursement
);





// Route สำหรับดึงข้อมูลการเบิกเงินทั้งหมด
router.get('/disbursements', getDisbursements);

// Route สำหรับดึงข้อมูลการเบิกเงินตาม ID
router.get('/disbursement/:id', getDisbursementById);

// Route สำหรับอัพเดตข้อมูลการเบิกเงิน
router.put('/disbursement/:id', 
  upload.fields([
    { name: 'file_name', maxCount: 10 },
  ]),
  updateDisbursement
);

// Route สำหรับลบข้อมูลการเบิกเงิน
router.delete('/disbursement/:id', deleteDisbursementById);

// Route สำหรับเปลี่ยนสถานะการเบิกเงิน
router.patch('/disbursement/:id/status', updateDisbursementStatus);

// Controller Functions

// ฟังก์ชันเพิ่มข้อมูลการเบิกเงิน
async function addDisbursement(req, res) {
  const {
    employee_id,
    category,
    amount,
    date,
    details,
    disbursement_status = 'PENDING',
    create_name = null,
    modify_name = null
  } = req.body;

  // 👇 แปลง '' เป็น null
    const salary_id = req.body.salary_id === '' ? null : req.body.salary_id;

  // Validation
  if (!employee_id || !category || !amount || !date) {
    return res.status(400).json({ 
      error: 'กรุณากรอกข้อมูลที่จำเป็น: employee_id, category, amount, date' 
    });
  }

  // ตรวจสอบ category ที่อนุญาต
  const allowedCategories = ['TRAVEL', 'FOOD', 'EQUIPMENT', 'OTHER'];
  if (!allowedCategories.includes(category)) {
    return res.status(400).json({ 
      error: 'หมวดหมู่ไม่ถูกต้อง: ' + allowedCategories.join(', ') 
    });
  }

  // ตรวจสอบ status ที่อนุญาต
  const allowedStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
  if (!allowedStatuses.includes(disbursement_status)) {
    return res.status(400).json({ 
      error: 'สถานะไม่ถูกต้อง: ' + allowedStatuses.join(', ') 
    });
  }

  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    let finalAttachmentId = null;

    // สร้าง attachment record ใหม่
    const [insertAttachment] = await connection.query(
      `INSERT INTO attachment (reference_type, create_name, modify_name, create_date, modify_date) 
       VALUES (?, ?, ?, NOW(), NOW())`,
      ['disbursement', create_name, modify_name]
    );
    finalAttachmentId = insertAttachment.insertId;

    // จัดการไฟล์หลายตัว - สร้าง attachment ใหม่สำหรับแต่ละไฟล์
    const uploadedFiles = [];
    const allAttachmentIds = [finalAttachmentId]; // เก็บ ID หลักก่อน

    if (req.files && req.files['file_name'] && req.files['file_name'].length > 0) {
      for (let i = 0; i < req.files['file_name'].length; i++) {
        const file = req.files['file_name'][i];
        const fileName = file.filename;
        const filePath = `/uploads/${fileName}`;

        if (i === 0) {
          // ไฟล์แรก - อัพเดท attachment หลัก
          await connection.query(
            `UPDATE attachment SET file_name = ?, file_path = ?, modify_date = NOW() WHERE attachment_id = ?`,
            [fileName, filePath, finalAttachmentId]
          );

          uploadedFiles.push({
            attachment_id: finalAttachmentId,
            file_name: fileName,
            file_path: filePath
          });
        } else {
          // ไฟล์ที่ 2, 3, 4... - สร้าง attachment ใหม่
          const [newAttachment] = await connection.query(
            `INSERT INTO attachment (file_name, file_path, reference_type, create_name, modify_name, create_date, modify_date) 
             VALUES (?, ?, ?, ?, ?, NOW(), NOW())`,
            [fileName, filePath, 'disbursement', create_name, modify_name]
          );

          allAttachmentIds.push(newAttachment.insertId);
          uploadedFiles.push({
            attachment_id: newAttachment.insertId,
            file_name: fileName,
            file_path: filePath
          });
        }
      }
    }

    // บันทึกข้อมูลการเบิกเงิน - ใช้ attachment_id หลัก
    const insertDisbursementQuery = `
      INSERT INTO disbursement (employee_id, salary_id, category, amount, date, details, disbursement_status, attachment_id, create_date, modify_date)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW(), NOW())
    `;
    const [disbursementResult] = await connection.query(insertDisbursementQuery, [
      employee_id,
      salary_id,
      category,
      amount,
      date,
      details,
      disbursement_status,
      finalAttachmentId
    ]);

    const insertedDisbursementId = disbursementResult.insertId;

    // อัปเดต reference_id ใน attachment ทั้งหมดให้ชี้ไปที่ disbursement_id ที่เพิ่งเพิ่ม
    for (const attachmentId of allAttachmentIds) {
      await connection.query(
        `UPDATE attachment SET reference_id = ? WHERE attachment_id = ?`,
        [insertedDisbursementId, attachmentId]
      );
    }

    await connection.commit();

    return res.status(200).json({
      message: 'เพิ่มข้อมูลการเบิกเงินสำเร็จ',
      insertedId: insertedDisbursementId,
      main_attachment_id: finalAttachmentId,
      all_attachment_ids: allAttachmentIds,
      data: {
        id: insertedDisbursementId,
        employee_id,
        salary_id,
        category,
        amount,
        date,
        details,
        disbursement_status,
        attachment_id: finalAttachmentId,
        uploaded_files: uploadedFiles,
        files_count: uploadedFiles.length,
        create_name,
        modify_name
      }
    });

  } catch (err) {
    await connection.rollback();
    console.error('Database error:', err);
    res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการเพิ่มข้อมูลการเบิกเงิน',
      detail: err.message
    });
  } finally {
    connection.release();
  }
}


// ฟังก์ชันดึงข้อมูลการเบิกเงินทั้งหมด
async function getDisbursements(req, res) {
  const sql = `
    SELECT 
      d.disbursement_id,
      d.employee_id,
      d.salary_id,
      d.category,
      d.amount,
      d.date,
      d.details,
      d.disbursement_status,
      d.create_date,
      d.modify_date,
      
      e.first_name,
      e.last_name,
      e.email_person,

      a.attachment_id,
      a.file_name,
      a.file_path,
      a.file_type

    FROM disbursement d
    JOIN employee e ON d.employee_id = e.employee_id
    LEFT JOIN attachment a ON a.reference_id = d.disbursement_id AND a.reference_type = 'disbursement'
    ORDER BY d.create_date DESC
  `;

  try {
    const [results] = await pool.query(sql);

    if (results.length === 0) {
      return res.status(404).json({ message: "ไม่พบข้อมูลการเบิกเงิน" });
    }

    // รวมรายการ attachment ที่มี disbursement_id ซ้ำกัน
    const disbursementMap = new Map();

    results.forEach(row => {
      if (!disbursementMap.has(row.disbursement_id)) {
        disbursementMap.set(row.disbursement_id, {
          id: row.disbursement_id,
          employeeId: row.employee_id,
          employeeName: `${row.first_name} ${row.last_name}`,
          email: row.email_person,
          category: row.category,
          amount: parseFloat(row.amount),
          status: row.disbursement_status,
          date: row.date,
          details: row.details,
          attachments: []
        });
      }

      if (row.attachment_id) {
        disbursementMap.get(row.disbursement_id).attachments.push({
          id: row.attachment_id,
          name: row.file_name,
          url: row.file_path,
          type: row.file_type
        });
      }
    });

    const disbursementList = Array.from(disbursementMap.values());

    res.status(200).json(disbursementList);
  } catch (err) {
    console.error("Error fetching disbursements:", err);
    res.status(500).json({ error: "เกิดข้อผิดพลาดในการดึงข้อมูลการเบิกเงิน" });
  }
}


// ฟังก์ชันดึงข้อมูลการเบิกเงินตาม ID
async function getDisbursementById(req, res) {
  const { id } = req.params;

  try {
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'กรุณาระบุ ID ของการเบิกเงินที่ถูกต้อง' });
    }

    const getDisbursementQuery = `
      SELECT 
        d.disbursement_id,
        d.employee_id,
        d.salary_id,
        d.category,
        d.amount,
        d.date,
        d.details,
        d.disbursement_status,
        d.attachment_id,
        d.create_date,
        d.modify_date,
        a.file_name,
        a.file_path,
        a.create_name as attachment_create_name,
        a.modify_name as attachment_modify_name
      FROM disbursement d
      LEFT JOIN attachment a ON d.attachment_id = a.attachment_id
      WHERE d.disbursement_id = ?
    `;

    const [disbursementResult] = await pool.query(getDisbursementQuery, [id]);

    if (disbursementResult.length === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลการเบิกเงินที่ต้องการ' });
    }

    const disbursementData = disbursementResult[0];

    const responseData = {
      disbursement_id: disbursementData.disbursement_id,
      employee_id: disbursementData.employee_id,
      salary_id: disbursementData.salary_id,
      category: disbursementData.category,
      amount: disbursementData.amount,
      date: disbursementData.date,
      details: disbursementData.details,
      disbursement_status: disbursementData.disbursement_status,
      attachment_id: disbursementData.attachment_id,
      attachment: disbursementData.attachment_id ? {
        file_name: disbursementData.file_name,
        file_path: disbursementData.file_path,
        create_name: disbursementData.attachment_create_name,
        modify_name: disbursementData.attachment_modify_name
      } : null,
      create_date: disbursementData.create_date,
      modify_date: disbursementData.modify_date
    };

    return res.status(200).json({
      message: 'ดึงข้อมูลการเบิกเงินสำเร็จ',
      data: responseData
    });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ 
      error: 'เกิดข้อผิดพลาดในการดึงข้อมูลการเบิกเงิน', 
      detail: err.message 
    });
  }
}

// ฟังก์ชันอัพเดตข้อมูลการเบิกเงิน
async function updateDisbursement(req, res) {
  const disbursementId = req.params.id;
  const {
    employee_id,
    salary_id,
    category,
    amount,
    date,
    details,
    disbursement_status,
    attachment_id,
    modify_name = null
  } = req.body;

  try {
    const [existingDisbursement] = await pool.query(
      'SELECT * FROM disbursement WHERE disbursement_id = ?',
      [disbursementId]
    );

    if (existingDisbursement.length === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลการเบิกเงินที่ต้องการแก้ไข' });
    }

    // ตรวจสอบ category และ status หากมีการส่งมา
    if (category) {
      const allowedCategories = ['TRAVEL', 'FOOD', 'EQUIPMENT', 'OTHER'];
      if (!allowedCategories.includes(category)) {
        return res.status(400).json({ 
          error: 'หมวดหมู่ไม่ถูกต้อง: ' + allowedCategories.join(', ') 
        });
      }
    }

    if (disbursement_status) {
      const allowedStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
      if (!allowedStatuses.includes(disbursement_status)) {
        return res.status(400).json({ 
          error: 'สถานะไม่ถูกต้อง: ' + allowedStatuses.join(', ') 
        });
      }
    }

    let finalAttachmentId = attachment_id || existingDisbursement[0].attachment_id;

    let uploadedFile = null;
    if (req.files && req.files['file_name'] && req.files['file_name'][0]) {
      uploadedFile = req.files['file_name'][0].filename;
    }
    let filePath = uploadedFile ? `/uploads/${uploadedFile}` : null;

    if (uploadedFile || !finalAttachmentId) {
      if (!finalAttachmentId) {
        const [insertAttachment] = await pool.query(
          `INSERT INTO attachment (reference_type, create_name, modify_name, create_date, modify_date) VALUES (?, ?, ?, NOW(), NOW())`,
          ['disbursement', existingDisbursement[0].create_name, modify_name]
        );
        finalAttachmentId = insertAttachment.insertId;
      }

      if (uploadedFile) {
        await pool.query(
          `UPDATE attachment SET file_name = ?, file_path = ?, modify_name = ?, modify_date = NOW() WHERE attachment_id = ?`,
          [uploadedFile, filePath, modify_name, finalAttachmentId]
        );
      }
    }

    let updateFields = [];
    let updateValues = [];

    if (employee_id !== undefined) {
      updateFields.push('employee_id = ?');
      updateValues.push(employee_id);
    }
    if (salary_id !== undefined) {
      updateFields.push('salary_id = ?');
      updateValues.push(salary_id);
    }
    if (category !== undefined) {
      updateFields.push('category = ?');
      updateValues.push(category);
    }
    if (amount !== undefined) {
      updateFields.push('amount = ?');
      updateValues.push(amount);
    }
    if (date !== undefined) {
      updateFields.push('date = ?');
      updateValues.push(date);
    }
    if (details !== undefined) {
      updateFields.push('details = ?');
      updateValues.push(details);
    }
    if (disbursement_status !== undefined) {
      updateFields.push('disbursement_status = ?');
      updateValues.push(disbursement_status);
    }
    if (finalAttachmentId !== undefined) {
      updateFields.push('attachment_id = ?');
      updateValues.push(finalAttachmentId);
    }

    updateFields.push('modify_date = NOW()');
    updateValues.push(disbursementId);

    const updateDisbursementQuery = `
      UPDATE disbursement 
      SET ${updateFields.join(', ')}
      WHERE disbursement_id = ?
    `;

    const [updateResult] = await pool.query(updateDisbursementQuery, updateValues);

    if (updateResult.affectedRows === 0) {
      return res.status(400).json({ error: 'ไม่สามารถอัปเดตข้อมูลการเบิกเงินได้' });
    }

    const [updatedDisbursement] = await pool.query(
      `SELECT d.*, a.file_name, a.file_path, a.create_name, a.modify_name
       FROM disbursement d 
       LEFT JOIN attachment a ON d.attachment_id = a.attachment_id 
       WHERE d.disbursement_id = ?`,
      [disbursementId]
    );

    return res.status(200).json({
      message: 'อัปเดตข้อมูลการเบิกเงินสำเร็จ',
      data: {
        disbursement_id: parseInt(disbursementId),
        employee_id: updatedDisbursement[0].employee_id,
        salary_id: updatedDisbursement[0].salary_id,
        category: updatedDisbursement[0].category,
        amount: updatedDisbursement[0].amount,
        date: updatedDisbursement[0].date,
        details: updatedDisbursement[0].details,
        disbursement_status: updatedDisbursement[0].disbursement_status,
        attachment_id: updatedDisbursement[0].attachment_id,
        attachment: {
          file_name: updatedDisbursement[0].file_name,
          file_path: updatedDisbursement[0].file_path,
          create_name: updatedDisbursement[0].create_name,
          modify_name: updatedDisbursement[0].modify_name
        },
        create_date: updatedDisbursement[0].create_date,
        modify_date: updatedDisbursement[0].modify_date
      }
    });

  } catch (err) {
    console.error('Database error:', err);
    res.status(500).json({ error: 'เกิดข้อผิดพลาดในการอัปเดตข้อมูลการเบิกเงิน', detail: err.message });
  }
}

// ฟังก์ชันลบข้อมูลการเบิกเงิน
async function deleteDisbursementById(req, res) {
  const { id } = req.params;

  try {
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'กรุณาระบุ ID ของการเบิกเงินที่ถูกต้อง' });
    }

    const deleteQuery = `DELETE FROM disbursement WHERE disbursement_id = ?`;
    const [result] = await pool.query(deleteQuery, [id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลการเบิกเงินที่ต้องการลบ' });
    }

    return res.status(200).json({
      message: `ลบข้อมูลการเบิกเงิน ID ${id} เรียบร้อยแล้ว`
    });

  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการลบข้อมูลการเบิกเงิน',
      detail: err.message
    });
  }
}

// ฟังก์ชันเปลี่ยนสถานะการเบิกเงิน
async function updateDisbursementStatus(req, res) {
  const { id } = req.params;
  const { status } = req.body;

  try {
    if (!id || isNaN(id)) {
      return res.status(400).json({ error: 'กรุณาระบุ ID ของการเบิกเงินที่ถูกต้อง' });
    }

    const allowedStatuses = ['PENDING', 'APPROVED', 'REJECTED'];
    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ 
        error: 'สถานะไม่ถูกต้อง: ' + allowedStatuses.join(', ') 
      });
    }

    const updateQuery = `UPDATE disbursement SET disbursement_status = ?, modify_date = NOW() WHERE disbursement_id = ?`;
    const [result] = await pool.query(updateQuery, [status, id]);

    if (result.affectedRows === 0) {
      return res.status(404).json({ error: 'ไม่พบข้อมูลการเบิกเงินที่ต้องการอัพเดต' });
    }

    return res.status(200).json({
      message: `อัพเดตสถานะการเบิกเงิน ID ${id} เป็น ${status} เรียบร้อยแล้ว`
    });

  } catch (err) {
    console.error('Database error:', err);
    return res.status(500).json({
      error: 'เกิดข้อผิดพลาดในการอัพเดตสถานะ',
      detail: err.message
    });
  }
}

module.exports = router;