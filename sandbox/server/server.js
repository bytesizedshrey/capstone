import "dotenv/config"
import app from './src/app.js'
import connectDB from "./src/config/db.js"

connectDB()

// let the api cook on port 3000
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Sandbox API server is running on port ${PORT}`);
});