import cron from 'node-cron';
import Complaint from '../models/Complaint.js';

cron.schedule('0 0 * * *', async () => {
    await Complaint.updateMany(
        { slaDeadline: { $lt: new Date() }, status: { $ne: 'resolved' } },
        { $set: { priority: 'high' } }
    );
    console.log('SLA job executed: Overdue complaints updated');
});