import mongoose, { connect } from 'mongoose'

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.AUTH_MONGO_URI)
        console.log('MongoDB connected')
    } catch (err) {
        console.error('MongoDB connection error  :  ', err)
        process.exit(1)
    }
}

export default connectDB