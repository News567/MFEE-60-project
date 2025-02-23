import express from "express";
import { pool } from "../../config/mysql.js";
import multer from "multer";
import path, { dirname, resolve } from "path";
import { fileURLToPath } from "url";
import fs from "fs"; // 引入 fs 模組

const __dirname = dirname(fileURLToPath(import.meta.url));
const router = express.Router();

//設定 Multer 的儲存策略
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        const userId = req.body.userId || "default"; // 從請求的 body 取得 userId，若沒有則使用 'default'
        const uploadPath = resolve(__dirname, `../../../client/public/image/group`);

        // 檢查目錄是否存在，若不存在則建立
        if (!fs.existsSync(uploadPath)) {
            fs.mkdirSync(uploadPath, { recursive: true }); // 遞迴創建資料夾
        }

        cb(null, uploadPath); // 設定上傳目錄
    },
    filename: (req, file, cb) => {
        // 設定檔案名稱，時間戳+副檔名
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

// 初始化 Multer
const upload = multer({storage});
router.post("/create", upload.single("file"), async (req, res) => {
    try {
        const formData = req.body
        console.log(formData);
        const name = formData.title;
        const userId = formData.userId;
        const gender = formData.gender;
        const maxNumber = formData.maxNumber;
        const type = formData.type;
        const certificates = formData.certificates;
        const country = formData.country;
        const city = formData.city;
        const date = formData.date;
        const time = formData.time;
        const signEndDate = formData.signEndDate;
        const signEndTime = formData.signEndTime;
        const description = formData.description;
        const cityFunction = () => {
            switch (country) {
                case "1" :
                    if(city == "屏東") return 1 
                    if(city == "台東") return 2 
                    if(city == "澎湖") return 3 
                    if(city == "綠島") return 4 
                    if(city == "蘭嶼") return 5 
                    if(city == "小琉球") return 7 
                    if(city == "其他") return 8
                break;
                case "2" :
                    if(city == "沖繩") return 10 
                    if(city == "石垣島") return 11 
                    if(city == "其他") return 12 
                break;
                case "3" :
                    if(city == "長灘島") return 13 
                    if(city == "宿霧") return 14 
                    if(city == "薄荷島") return 15 
                    if(city == "其他") return 16 
                break;
                case "4" :
                    return 17;
            }
        }
        const groups_city_id = cityFunction()
        const sign_end_date = signEndDate + " " +signEndTime + ":00"
        const sql = `INSERT INTO groups (name,user_id,type,gender,certificates,groups_city_id,description,sign_end_date,max_number,date,time) VALUES(?,?,?,?,?,?,?,?,?,?,?)`
        const sqlImg = `INSERT INTO groups_image (groups_id,name,img_url) VALUES (?,?,?)`
        const result = await pool.execute(sql, [
            name,
            userId,
            type,
            gender,
            certificates,
            groups_city_id,
            description,
            sign_end_date,
            maxNumber,
            date,
            time
        ])
        const groupId = result[0].insertId
        const imgName = req.file.filename
        // console.log(req.file.filename);
        const imgResult = await pool.execute(sqlImg,[groupId,name,imgName])
        console.log(imgResult);
        res.status(200).json({
            status: "success",
            message: "成功建立揪團！",
            groupId:groupId
        });
    } catch (error) {
        console.log(error);
    }
});

export default router;
