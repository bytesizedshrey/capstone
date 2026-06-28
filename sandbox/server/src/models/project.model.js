import mongoose from 'mongoose'

const projectSchema = new mongoose.Schema({
    user: { type: String, required: true },
    title: { type: String, required: true },
})

const Project = mongoose.model('Project', projectSchema)

export default Project 