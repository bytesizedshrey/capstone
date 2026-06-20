import express from "express"
import morgan from "morgan"

const app = express()

app.use(morgan('dev'))
app.use(express.json())
app.use(express.urlencoded({extended: true})) //supports nested objects and arrays.

app.get('/api/sandbox/health',(req,res)=>{
    res.status(200).json({
        message : 'Sandbox API is healthy',
        status : 'ok'
    })
})

export default app