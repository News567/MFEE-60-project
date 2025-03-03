import nodemailer from 'nodemailer'
import { serverConfig } from '../config/server.config.js'
import { isDev } from './utils.js'

// 取得config檔案中的smtp設定
const { host, user, pass, provider } = serverConfig.smtp

// 使用gmail寄送
const gmail = {
  host,
  port: 465,
  secure: true, // use TLS
  //在專案的 .env 檔案中定義關於寄送郵件的 process.env 變數
  auth: {
    user,
    pass,
  },
  tls: {
    servername: 'smtp.gmail.com',
    rejectUnauthorized: false,
  },
}

// 使用 https://ethereal.email/
// const ethereal = {
//   host,
//   port: 587,
//   auth: {
//     user,
//     pass,
//   },
// }

// 定義所有email的寄送伺服器位置
const transport = provider === 'gmail' ? gmail : ethereal

const otpMailHtml = (otpToken, secret) => `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>重設網站登入密碼要求的一次性驗証碼 OTP Verification</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f6f6f6;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #007BFF; /* Corporate color */
            padding: 20px;
            text-align: center;
        }
        .header img {
            max-width: 150px;
        }
        .content {
            padding: 20px;
        }
        .otp-code {
            font-size: 24px;
            font-weight: bold;
            color: #333333;
            margin: 20px 0;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777777;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <img src="${serverConfig.nextUrl}/kawaii_next.png" alt="Company Logo" width="150"> 
            <h1 style="color: #ffffff;">重設登入密碼的一次性驗証碼(OTP)</h1>
        </div>
        <div class="content">
            <p>親愛的網站會員 您好，</p>
            <p>您的一次性驗証碼(OTP code)如下:</p>
            <div class="otp-code">${otpToken}</div>
            <p>請在您目前的重設登入密碼頁面中的"一次性驗証碼"輸入框進行輸入。或是從以下的連結連入頁面:</p>
            <p><a href="${serverConfig.nextUrl}/user/forget-password-2p/reset?secret=${secret}" target="_blank">重設登入密碼頁面連結</a></p>
            <p>請注意驗証碼將於寄送後5分鐘後到期，如有任何問題請洽網站客服人員。</p>
        </div>
        <div class="footer">
            <p>&copy; 2024 台灣 NextJS Inc. 網站.</p>
        </div>
    </div>

</body>
</html>
`
// 電子郵件文字訊息樣版
const otpMailText = (otpToken, secret) => `親愛的網站會員 您好，
通知重設密碼所需要的驗証碼，
請輸入以下的6位數字，重設密碼頁面的"電子郵件驗証碼"欄位中。
    
${otpToken}

或是點選以下連結:

<http://localhost:3000/user/forget-password-2p/reset?secret=${secret}>
    
請注意驗証碼將於寄送後5分鐘後到期，如有任何問題請洽網站客服人員:

敬上

台灣 NextJS Inc. 網站`

// 測試用一般寄送
export const sendOtpMail = async (to, otpToken, secret = '') => {
  if (isDev) console.log(otpToken)
  // 寄送email
  const mailOptions = {
    // 這裡要改寄送人
    from: user, // sender address
    to: to, // list of receivers
    subject: '重設登入密碼的一次性驗証碼(OTP)',
    text: otpMailText(otpToken, secret),
    html: otpMailHtml(otpToken, secret),
  }

  // 呼叫transport函式
  const transporter = nodemailer.createTransport(transport)

  // 寄送email
  try {
    const info = await transporter.sendMail(mailOptions)
    if (isDev) console.log('Message sent: ', info.messageId)
  } catch (err) {
    console.log(err)
    throw new Error('無法寄送email')
  }
}

// 揪團成功，告知揪團參加者
const sendJoinGroupSuccessHTML = (groupName, date, link)=>`<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>揪團成團通知</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f6f6f6;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #007BFF;
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777777;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <h1>您所參加的揪團開團成功！</h1>
        </div>
        <div class="content">
            <p>親愛的潛水愛好者，您好：</p>
            <p>恭喜您！您所報名的揪團 <strong>${groupName}</strong> 已成功成立！</p>
            <p>活動時間：<strong>${date}</strong></p>
            <p>請點擊以下連結查看詳細資訊：</p>
            <p><a href="${link}" target="_blank">查看活動詳情</a></p>
            <p>DiveIn全體敬祝您與其他團員們共度美好的潛水時光！</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 DiveIn.</p>
        </div>
    </div>

</body>
</html>`;

// 電子郵件文字訊息樣版
const sendJoinGroupSuccessText = (groupName, date, link) => `親愛的潛水愛好者 您好：
恭喜您！您所報名的揪團${groupName}已成功成立！活動時間：${date}，請點擊以下連結查看詳細資訊：${link}，DiveIn全體敬祝您與其他團員們共度美好的潛水時光！`


// 寄送參加的揪團成功成團的通知信件
export const sendJoinGroupSuccessMail = async (to, groupName, date,link) => {
  // 寄送email
  const mailOptions = {
    // 這裡要改寄送人
    from: user, // sender address
    to: to, // list of receivers
    subject: `參與的揪團活動${groupName}成立通知`,
    text: sendJoinGroupSuccessText(groupName, date, link),
    html: sendJoinGroupSuccessHTML(groupName, date, link),
  }

  // 呼叫transport函式
  const transporter = nodemailer.createTransport(transport)

  // 寄送email
  try {
    const info = await transporter.sendMail(mailOptions)
    if (isDev) console.log('Message sent: ', info.messageId)
  } catch (err) {
    console.log(err)
    throw new Error('無法寄送email')
  }
}


// 成團後告知團主
const sendHostGroupSuccessHTML = (groupName, date, link)=>`<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>揪團成團通知</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f6f6f6;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #007BFF;
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777777;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <h1>您所舉辦的揪團順利成團！</h1>
        </div>
        <div class="content">
            <p>親愛的潛水愛好者，您好：</p>
            <p>恭喜您！您所舉辦的揪團 <strong>${groupName}</strong> 已成功集齊人數成立！</p>
            <p>活動時間：<strong>${date}</strong></p>
            <p>請點擊以下連結查看詳細資訊：</p>
            <p><a href="${link}" target="_blank">查看活動詳情</a></p>
            <p>DiveIn全體敬祝您與其他團員們共度美好的潛水時光！</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 DiveIn.</p>
        </div>
    </div>

</body>
</html>`;

// 電子郵件文字訊息樣版
const sendHostGroupSuccessText = (groupName, date, link) => `親愛的潛水愛好者 您好：
恭喜您！您所報名的揪團${groupName}已成功成立！活動時間：${date}，請點擊以下連結查看詳細資訊：${link}，DiveIn全體敬祝您與其他團員們共度美好的潛水時光！`


// 寄送參加的揪團成功成團的通知信件
export const sendHostGroupSuccessMail = async (to, groupName, date,link) => {
  // 寄送email
  const mailOptions = {
    // 這裡要改寄送人
    from: user, // sender address
    to: to, // list of receivers
    subject: `創立的揪團活動${groupName}成立通知`,
    text: sendHostGroupSuccessText(groupName, date, link),
    html: sendHostGroupSuccessHTML(groupName, date, link)
  }

  // 呼叫transport函式
  const transporter = nodemailer.createTransport(transport)

  // 寄送email
  try {
    const info = await transporter.sendMail(mailOptions)
    if (isDev) console.log('Message sent: ', info.messageId)
  } catch (err) {
    console.log(err)
    throw new Error('無法寄送email')
  }
}

// 團主取消揪團後傳送給參加者
const sendJoinGroupCancelHTML = (groupName, date)=>`<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>參加的揪團活動已被取消</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f6f6f6;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #007BFF;
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777777;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <h1>您所參加的揪團已取消！</h1>
        </div>
        <div class="content">
            <p>親愛的潛水愛好者，您好：</p>
            <p>很遺憾地通知您，您所參加的原定於${date}舉行的揪團 <strong>${groupName}</strong> 已被取消！</p>
            <p>如有任何疑問，請與我們聯絡。</p>
            <p>DiveIn 敬上</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 DiveIn.</p>
        </div>
    </div>

</body>
</html>`;

// 參加的揪團電子郵件文字訊息樣版
const sendJoinGroupCancelText = (groupName, date) => `親愛的潛水愛好者 您好：
很遺憾地通知您，您所參加的原定於${date}舉行的揪團${groupName}已被取消！如有任何疑問，請與我們聯絡。DiveIn敬上。`


// 寄送參加的揪團取消的通知信件
export const sendJoinGroupCancelMail = async (to, groupName, date) => {
    console.log("寄送參加的揪團取消的通知信件");
  // 寄送email
  const mailOptions = {
    // 這裡要改寄送人
    from: user, // sender address
    to: to, // list of receivers
    subject: `參加的揪團活動${groupName}取消通知`,
    text: sendJoinGroupCancelText(groupName, date),
    html: sendJoinGroupCancelHTML(groupName, date)
  }

  // 呼叫transport函式
  const transporter = nodemailer.createTransport(transport)

  // 寄送email
  try {
    const info = await transporter.sendMail(mailOptions)
    if (isDev) console.log('Message sent: ', info.messageId)
  } catch (err) {
    console.log(err)
    throw new Error('無法寄送email')
  }
}

// 揪團超過報名日期自動取消後傳送給團主
const sendHostGroupCancelHTML = (groupName, date)=>`<!DOCTYPE html>
<html lang="zh-TW">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>創立的揪團因人數不足已自動取消</title>
    <style>
        body {
            font-family: Arial, sans-serif;
            background-color: #f6f6f6;
            margin: 0;
            padding: 20px;
        }
        .container {
            max-width: 600px;
            margin: 0 auto;
            background-color: #ffffff;
            border-radius: 8px;
            box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
            overflow: hidden;
        }
        .header {
            background-color: #007BFF;
            padding: 20px;
            text-align: center;
            color: #ffffff;
        }
        .content {
            padding: 20px;
        }
        .footer {
            text-align: center;
            padding: 10px;
            font-size: 12px;
            color: #777777;
        }
    </style>
</head>
<body>

    <div class="container">
        <div class="header">
            <h1>您所創立的揪團已取消！</h1>
        </div>
        <div class="content">
            <p>親愛的潛水愛好者，您好：</p>
            <p>很遺憾地通知您，您所創立的原定於${date}舉行的揪團 <strong>${groupName}</strong> 因參加人數不足已被取消！</p>
            <p>如有任何疑問，請與我們聯絡。</p>
            <p>DiveIn 敬上</p>
        </div>
        <div class="footer">
            <p>&copy; 2025 DiveIn.</p>
        </div>
    </div>

</body>
</html>`;

// 主辦的揪團取消電子郵件文字訊息樣版
const sendHostGroupCancelText = (groupName, date) => `親愛的潛水愛好者 您好：
很遺憾地通知您，您所創立的原定於${date}舉行的揪團${groupName}因參加人數不足已被取消！如有任何疑問，請與我們聯絡。DiveIn敬上。`


// 寄送主辦的揪團取消的通知信件
export const sendHostGroupCancelMail = async (to, groupName, date) => {
    console.log("寄送主辦的揪團取消的通知信件");
  // 寄送email
  const mailOptions = {
    // 這裡要改寄送人
    from: user, // sender address
    to: to, // list of receivers
    subject: `創立的揪團活動${groupName}已遭取消`,
    text: sendHostGroupCancelText(groupName, date),
    html: sendHostGroupCancelHTML(groupName, date)
  }

  // 呼叫transport函式
  const transporter = nodemailer.createTransport(transport)

  // 寄送email
  try {
    const info = await transporter.sendMail(mailOptions)
    if (isDev) console.log('Message sent: ', info.messageId)
  } catch (err) {
    console.log(err)
    throw new Error('無法寄送email')
  }
}