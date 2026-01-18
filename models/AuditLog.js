import mongoose from 'mongoose';

const schema = new mongoose.Schema({
    action: {
        type: String,
        required: true,
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    meta : {
        type: Object,
    },
}, {
    timestamps: true,
});

export default mongoose.model('AuditLog', schema);