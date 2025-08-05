import express from 'express';
import cors from "cors";
import routes from "./routes/index.route"
import { connectDB } from './config/database';
import dotenv from "dotenv"

const app = express();
const port = 4000;


//Load biến môi trường
dotenv.config();
//Kết nối DB
connectDB();
//Cấu hình CORS
app.use(cors({
  origin: "http://localhost:3000",
  methods: ["GET", "POST","PATCH", "DELETE"],
  allowedHeaders: ['Content-Type', 'Authorization']
}))

//Cho phép gửi data lên dạng Json
app.use(express.json());

//Thiết lập đường dẫn
app.use("/",routes);


app.listen(port, () => {
  console.log(`Website đang chạy trên cổng ${port}`);
});
