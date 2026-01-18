import multer from 'multer';
import { CloudinaryStorage } from 'multer-storage-cloudinary';
import cloudinary from '../config/cloudinary.js';

export const upload = multer({
    storage: new CloudinaryStorage({
        cloudinary , 
        params: {
            folder : 'arrakis',
            allowed_formats: ['jpg', 'png', 'jpeg', 'gif'] }
        
    }),
    limits: { fileSize: 5 * 1024 * 1024 }, 
});
