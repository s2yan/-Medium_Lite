import { app } from './app.js';
import { connectDb } from './DB/index.js';
import dotenv from 'dotenv';

dotenv.config({ path: './src/.env'})
const PORT = process.env.PORT || 8002

connectDb()
.then( () => {
    app.listen(PORT, () => {
    console.log("server is running on port: " + PORT);
})
}).catch(err  => {
    console.error("Failed to connect to the database:", err);
    process.exit(1);
})