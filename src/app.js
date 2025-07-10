import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import cookieParser from 'cookie-parser';

dotenv.config({ path: './src/.env'})
const app = express();

app.use(express.json())
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentails: true
}))
app.use(express.urlencoded({extended: true}))
app.use(cookieParser())

app.get("/", (req, res) =>{
    res.send("Welcome to the medium server")
})

//Import routes
import userRoutes from './routes/user.routes.js';
import postRoutes from './routes/post.routes.js';
import commentRoutes from './route/comment.routes.js';
import uploadRoutes from './routes/upload.routes.js';


app.use("/api/v1/user", userRoutes);
app.use('/api/v1/post', postRoutes);
app.use('/api/v1/comment', commentRoutes);
app.use('api/v1/media', uploadRoutes);

export { app };
