import mongoose from 'mongoose';



export const connectDB = async () => {
    try {
        await mongoose.connect(process.env.AUTH_MONGO_URI);
        console.log('MongoDB connected');
    } catch (err) {
        console.error('MongoDB connection error (non-fatal in dev):', err.message);
        // Don't exit — allow server to start so auth routes respond
    }
};