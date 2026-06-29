import mongoose, { connect } from 'mongoose'

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.AUTH_MONGO_URI)
        console.log('MongoDB connected')
    } catch (err) {
        console.error('MongoDB connection error  :  ', err.message)
        // Non-fatal, do not exit process so health check still works
    }
}

export default connectDB