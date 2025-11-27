import express from 'express';
import multer from 'multer';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';
import {
    getPrograms,
    getProgramById,
    createProgram,
    updateProgram,
    deleteDocument,
    deleteProgram
} from '../controllers/programController.js';
import { protect, authorize } from '../middleware/authMiddleware.js';

const router = express.Router();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configure multer for document uploads
const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        // We'll create a temporary folder first, then move to program-specific folder after creation
        const tempDir = path.join(__dirname, '../../uploads/documents/temp');
        if (!fs.existsSync(tempDir)) {
            fs.mkdirSync(tempDir, { recursive: true });
        }
        cb(null, tempDir);
    },
    filename: function (req, file, cb) {
        const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
        cb(null, file.fieldname + '-' + uniqueSuffix + path.extname(file.originalname));
    }
});

// File filter
function checkFileType(file, cb) {
    const filetypes = /pdf|doc|docx|jpg|jpeg|png|xls|xlsx/;
    const extname = filetypes.test(path.extname(file.originalname).toLowerCase());
    const mimetype = filetypes.test(file.mimetype);

    if (mimetype && extname) {
        return cb(null, true);
    } else {
        cb('Error: Documents only (PDF, DOC, DOCX, JPG, PNG, XLS, XLSX)!');
    }
}

const upload = multer({
    storage: storage,
    limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
    fileFilter: function (req, file, cb) {
        checkFileType(file, cb);
    }
});

// Middleware to move files to program-specific folder
const moveFilesToProgramFolder = async (req, res, next) => {
    if (req.files && req.files.length > 0 && res.locals.programId) {
        const programId = res.locals.programId;
        const programDir = path.join(__dirname, `../../uploads/documents/${programId}`);

        if (!fs.existsSync(programDir)) {
            fs.mkdirSync(programDir, { recursive: true });
        }

        for (const file of req.files) {
            const oldPath = file.path;
            const newPath = path.join(programDir, file.filename);
            fs.renameSync(oldPath, newPath);
            file.path = newPath;
        }
    }
    next();
};

router.route('/')
    .get(protect, getPrograms)
    .post(protect, upload.array('documents', 10), createProgram);

router.route('/:id')
    .get(protect, getProgramById)
    .put(protect, upload.array('documents', 10), updateProgram)
    .delete(protect, authorize('admin'), deleteProgram);

router.route('/:id/documents/:documentId')
    .delete(protect, deleteDocument);

export default router;
