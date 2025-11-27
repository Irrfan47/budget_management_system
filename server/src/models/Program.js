import mongoose from 'mongoose';

const programSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true
    },
    budget: {
        type: Number,
        required: true
    },
    recipientName: {
        type: String,
        required: true
    },
    referenceLetter: {
        type: String,
        required: true
    },
    documents: [{
        filename: String,
        originalName: String,
        path: String,
        uploadedAt: {
            type: Date,
            default: Date.now
        }
    }],

    status: {
        type: String,
        enum: ['Active', 'Pending', 'Critical', 'Draft', 'Under Review', 'Completed', 'Query', 'Query Answered', 'Rejected'],
        default: 'Draft'
    },
    history: [{
        status: String,
        message: String,
        updatedBy: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'User'
        },
        date: {
            type: Date,
            default: Date.now
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    }
}, {
    timestamps: true
});

const Program = mongoose.model('Program', programSchema);

export default Program;
