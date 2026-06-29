import { Router } from "express"
import { createPod } from "../kubernetes/pod.js";
import { createService } from "../kubernetes/service.js";
import { createSandboxKey } from "../config/redis.js";
import { v7 as uuid } from 'uuid'
import { authMiddleware } from "../middlewares/auth.middleware.js"
import Project from "../models/project.model.js"

const router = Router()

router.post('/project',authMiddleware,async(req,res) => {
    const {title} = req.body

    const newProject = new Project({
        user : req.user.id,
        title
    })
    await newProject.save()

    return res.status(201).json({
        message : 'Project created sucessfully',
        project : newProject
    })
})

// main entry point for spinning up pods, fr fr
router.post("/start",authMiddleware,async(req,res)=>{
    const projectId = req.body.projectId
    const project = await Project.findOne({ _id: projectId, user: req.user.id })

    if(!project){
        return res.status(404).json({message : 'Project not found or access denied'})
    }

    // Hardcode the sandbox ID as requested
    const sandboxId = uuid()

    try {
        await Promise.all([
            createPod(sandboxId,projectId),
            createService(sandboxId),
            createSandboxKey(sandboxId)
        ]);
        const sandboxDomain = process.env.SANDBOX_DOMAIN || 'localhost';
        return res.status(201).json({
            message : 'Sandbox env created sucessfully',
            sandboxId,
            previewUrl : `http://${sandboxId}.preview.${sandboxDomain}`
        });
    } catch (error) {
        if (error.code === 409 || (error.body && error.body.includes('"code":409'))) {
            const sandboxDomain = process.env.SANDBOX_DOMAIN || 'localhost';
            // Already exists, just return success
            return res.status(200).json({
                message : 'Sandbox env already exists',
                sandboxId,
                previewUrl : `http://${sandboxId}.preview.${sandboxDomain}`
            });
        }
        console.error(error);
        return res.status(500).json({ error: 'Failed to start sandbox' });
    }
})

router.get("/projects",authMiddleware,async(req,res)=>{
    const projects = await Project.find({user : req.user.id})

    return res.status(200).json({
        message : 'Project retrieved sucessfully',
        projects
    })
})

export default router

