import cron from "node-cron";
import { checkAndUpdateGroupStatus } from "./helpers/checkGroupStatus.js";

// 每分鐘執行一次
cron.schedule("* * * * *",()=>{
    console.log("正在檢查並更新狀態");
    checkAndUpdateGroupStatus() //執行檢查並更新的程式，希望有用
})