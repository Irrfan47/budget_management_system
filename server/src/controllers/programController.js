import Program from '../models/Program.js';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// @desc    Get all programs
// @route   GET /api/programs
// @access  Private
const getPrograms = async (req, res) => {
    let query = {};

    // If user is basic user, only show their own programs
    if (req.user.role === 'user') {
        query.createdBy = req.user._id;
    } else if (req.query.userId) {
        // If admin/finance and userId param is provided, filter by that user
        query.createdBy = req.query.userId;
    }

    const programs = await Program.find(query).populate('createdBy', 'name email');
    res.json(programs);
};

// @desc    Get single program
// @route   GET /api/programs/:id
// @access  Private
const getProgramById = async (req, res) => {
    const program = await Program.findById(req.params.id);

    if (program) {
        res.json(program);
    } else {
        res.status(404).json({ message: 'Program not found' });
    }
};

// @desc    Create a program
// @route   POST /api/programs
// @access  Private (User role)
const createProgram = async (req, res) => {
    try {
        const { name, budget, recipientName, referenceLetter, status } = req.body;

        // Create the program first to get the ID
        const program = new Program({
            name,
            budget,
            recipientName,
            referenceLetter,
            status: status || 'Draft',
            createdBy: req.user._id,
            documents: []
        });

        const createdProgram = await program.save();

        // If files were uploaded, move them to program-specific folder
        if (req.files && req.files.length > 0) {
            const programDir = path.join(__dirname, `../../uploads/documents/${createdProgram._id}`);

            // Create program-specific directory
            if (!fs.existsSync(programDir)) {
                fs.mkdirSync(programDir, { recursive: true });
            }

            const documents = [];

            // Move files from temp to program folder
            for (const file of req.files) {
                const oldPath = file.path;
                const newPath = path.join(programDir, file.filename);

                fs.renameSync(oldPath, newPath);

                documents.push({
                    filename: file.filename,
                    originalName: file.originalname,
                    path: `/uploads/documents/${createdProgram._id}/${file.filename}`
                });
            }

            createdProgram.documents = documents;
            await createdProgram.save();
        }

        res.status(201).json(createdProgram);
    } catch (error) {
        console.error('Error creating program:', error);
        res.status(500).json({ message: 'Failed to create program', error: error.message });
    }
};

// @desc    Update a program
// @route   PUT /api/programs/:id
// @access  Private
const updateProgram = async (req, res) => {
    try {
        const { name, budget, recipientName, referenceLetter, status } = req.body;

        const program = await Program.findById(req.params.id);

        if (!program) {
            return res.status(404).json({ message: 'Program not found' });
        }

        // Check if user owns this program (unless admin/finance)
        if (req.user.role === 'user' && program.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to update this program' });
        }

        // Update basic fields only if provided
        if (name !== undefined && name !== '') program.name = name;
        if (budget !== undefined && budget !== '') program.budget = budget;
        if (recipientName !== undefined && recipientName !== '') program.recipientName = recipientName;
        if (referenceLetter !== undefined && referenceLetter !== '') program.referenceLetter = referenceLetter;

        // Handle status change and history
        if (status !== undefined && status !== '') {
            program.status = status;

            // Add to history if status changed or message provided
            if (req.body.message || program.isModified('status')) {
                program.history.push({
                    status: status,
                    message: req.body.message || `Status updated to ${status}`,
                    updatedBy: req.user._id,
                    date: new Date()
                });
            }
        } else if (req.body.message) {
            // If only message is provided without status change (e.g. just a comment)
            program.history.push({
                status: program.status,
                message: req.body.message,
                updatedBy: req.user._id,
                date: new Date()
            });
        }

        // Handle new document uploads
        if (req.files && req.files.length > 0) {
            const programDir = path.join(__dirname, `../../uploads/documents/${program._id}`);

            // Create program-specific directory if it doesn't exist
            if (!fs.existsSync(programDir)) {
                fs.mkdirSync(programDir, { recursive: true });
            }

            const newDocuments = [];

            // Move files from temp to program folder
            for (const file of req.files) {
                const oldPath = file.path;
                const newPath = path.join(programDir, file.filename);

                fs.renameSync(oldPath, newPath);

                newDocuments.push({
                    filename: file.filename,
                    originalName: file.originalname,
                    path: `/uploads/documents/${program._id}/${file.filename}`
                });
            }

            // Append new documents to existing ones
            program.documents = [...program.documents, ...newDocuments];
        }

        const updatedProgram = await program.save();
        res.json(updatedProgram);
    } catch (error) {
        console.error('Error updating program:', error);
        res.status(500).json({ message: 'Failed to update program', error: error.message });
    }
};

// @desc    Delete a document from a program
// @route   DELETE /api/programs/:id/documents/:documentId
// @access  Private
const deleteDocument = async (req, res) => {
    try {
        const { id, documentId } = req.params;

        const program = await Program.findById(id);

        if (!program) {
            return res.status(404).json({ message: 'Program not found' });
        }

        // Check if user owns this program (unless admin/finance)
        if (req.user.role === 'user' && program.createdBy.toString() !== req.user._id.toString()) {
            return res.status(403).json({ message: 'Not authorized to delete documents from this program' });
        }

        // Find the document in the array
        const documentIndex = program.documents.findIndex(
            doc => doc._id.toString() === documentId
        );

        if (documentIndex === -1) {
            return res.status(404).json({ message: 'Document not found' });
        }

        const document = program.documents[documentIndex];

        // Delete the physical file
        const filePath = path.join(__dirname, '../..', document.path);
        if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
        }

        // Remove document from array
        program.documents.splice(documentIndex, 1);
        await program.save();

        res.json({ message: 'Document deleted successfully', program });
    } catch (error) {
        console.error('Error deleting document:', error);
        res.status(500).json({ message: 'Failed to delete document', error: error.message });
    }
};

// @desc    Delete a program
// @route   DELETE /api/programs/:id
// @access  Private (Admin only?)
const deleteProgram = async (req, res) => {
    try {
        const program = await Program.findById(req.params.id);

        if (!program) {
            return res.status(404).json({ message: 'Program not found' });
        }

        // Check permissions
        if (req.user.role === 'user') {
            // User must own the program
            if (program.createdBy.toString() !== req.user._id.toString()) {
                return res.status(403).json({ message: 'Not authorized to delete this program' });
            }
            // Program must be in Draft status
            if (program.status !== 'Draft') {
                return res.status(400).json({ message: 'Can only delete programs in Draft status' });
            }
        }

        // Delete associated files and directory
        const programDir = path.join(__dirname, `../../uploads/documents/${program._id}`);
        if (fs.existsSync(programDir)) {
            fs.rmSync(programDir, { recursive: true, force: true });
        }

        await program.deleteOne();
        res.json({ message: 'Program removed' });
    } catch (error) {
        console.error('Error deleting program:', error);
        res.status(500).json({ message: 'Failed to delete program', error: error.message });
    }
};

export { getPrograms, getProgramById, createProgram, updateProgram, deleteDocument, deleteProgram };
