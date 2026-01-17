import { urlencoded } from 'express';
import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    title : {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    location: {
        lat: Number,
        lng: Number,
        adress: String,    
    },
    image: {
        url: String,
        publicId: String,
    },
    status: {
        type: String,
        enum: ['submitted', 'assigned', 'in-progress', 'resolved', 'closed'],
        default: 'submitted',
    },
    priority: {
        type: String,
        enum: ['low', 'medium', 'high'],
        default: 'medium',
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    asssignedTo: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    slaDeadline: {
        type: Date,
    },
}, {
    timestamps: true,
});

export default mongoose.model('Complaint', schema);