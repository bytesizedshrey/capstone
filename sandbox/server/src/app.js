import express from "express"
import morgan from "morgan"
import { createPod } from "./kubernetes/pod.js"
import { createService } from "./kubernetes/service.js"
import { v7 as uuid } from 'uuid'


const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true})) //supports nested objects and arrays.

// checking if API is still breathing
app.get('/api/sandbox/health',(req,res)=>{
    res.status(200).json({
        message : 'Sandbox API is healthy',
        status : 'ok'
    })
})

// main entry point for spinning up pods, fr fr
app.post("/api/sandbox/start",async(req,res)=>{
    // Hardcode the sandbox ID as requested
    const sandboxId = "019ef6fa-619f-71ba-b484-a27de5bc4e99";

    try {
        await Promise.all([
            createPod(sandboxId),
            createService(sandboxId)
        ]);
        return res.status(201).json({
            message : 'Sandbox env created sucessfully',
            sandboxId,
            previewUrl : `http://${sandboxId}.preview.localhost`
        });
    } catch (error) {
        if (error.code === 409 || (error.body && error.body.includes('"code":409'))) {
            // Already exists, just return success
            return res.status(200).json({
                message : 'Sandbox env already exists',
                sandboxId,
                previewUrl : `http://${sandboxId}.preview.localhost`
            });
        }
        console.error(error);
        return res.status(500).json({ error: 'Failed to start sandbox' });
    }
})

export default app