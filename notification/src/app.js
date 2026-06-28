import express from 'express'
import morgan from 'morgan'


const app = express()

app.get('/',(req,res)=>{
    res.send('Hello from notification service!!')
})

export default app;