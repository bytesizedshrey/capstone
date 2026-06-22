import express from 'express'
import morgan from 'morgan'
import fs from 'fs'
import path from 'path'

// where the files live fr
const WORKING_DIR = '/workspace'

const app = express()

app.use(express.json())
app.use(morgan('dev'))

// checking if anyone is home
app.get('/', (req, res) => {
    res.status(200).json({
        message: 'Hello from sandbox agent',
        status: 'success',
    })
})

// grab all elements no cap
app.get('/list-files', async (req, res) => {
    const element = await fs.promises.readdir(WORKING_DIR)

    res.status(200).json({
        message: 'Element in working directory...',
        element
    })
})

// spill the tea on file contents
app.get('/read-files', async (req, res) => {
    const files = req.query.files

    if (!files) {
        return res.status(400).json({
            message: 'No files specified in query parameter',
            status: 'error'
        })
    }

    const fileList = files.split(',')

    const results = await Promise.all(
        fileList.map(async (file) => {
            const filePath = `${WORKING_DIR}/${file}`

            try {
                const content = await fs.promises.readFile(filePath, 'utf-8')

                return {
                    [filePath]: content
                }
            } catch (err) {
                return {
                    [filePath]: `Error reading file : ${err.message}`
                }
            }
        })
    )

    res.status(200).json({
        message: 'File contents',
        files: results
    })
})

app.patch('/update-files', async (req, res) => {
    const updates = req.body.updates

    if (!updates || !Array.isArray(updates)) {
        return res.status(400).json({
            message:
                'Invalid request body. Expected a JSON object with an "updates" property containing an array of file updates',
            status: 'error'
        })
    }

    const results = await Promise.all(
        updates.map(async (update) => {
            const { file, content } = update
            const filePath = path.join(WORKING_DIR, file)

            try {
                await fs.promises.writeFile(filePath, content, 'utf-8')

                return {
                    [filePath]: 'File updated successfully'
                }
            } catch (err) {
                return {
                    [filePath]: `Error updating file : ${err.message}`
                }
            }
        })
    )

    res.status(200).json({
        message: 'Files processed',
        results
    })
})

export default app