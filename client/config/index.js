// 本檔案是用來設定環境變數的檔案，這裡的變數會被其他檔案引入使用
export const PORT = 3000;
// 直接從環境變數取得NODE_ENV(npm run dev or npm run start)
const env = process.env.NODE_ENV;
// 本機環境 OR 營運環境 (true: 本機環境, false: 營運環境)
export const isDev = env === "development";

// 本機環境
const local = {
  apiURL: "http://localhost:3005/api",
  serverURL: "http://localhost:3005",
  avatarURL: "http://localhost:3005/avatar",
  nextUrl: "http://localhost:3000",
};

// 營運環境設定(部署至Vercel)
const production = {
  apiURL: "https://xxxxx.vercel.app/api",
  serverURL: "https://xxxxx.vercel.app",
  avatarURL: "https://xxxxx.vercel.app/avatar",
  nextUrl: "https://xxxxx.vercel.app",
};

export const apiURL = isDev ? local.apiURL : production.apiURL;
export const serverURL = isDev ? local.serverURL : production.serverURL;
export const avatarURL = isDev ? local.avatarURL : production.avatarURL;
export const nextUrl = isDev ? local.nextUrl : production.nextUrl;

// 這裡是設定不需要Layout的路由
export const noLayoutPaths = ["/ship/callback"];
// 登入頁路由
export const loginRoute = "/user";
// 隱私頁面路由，未登入時會，檢查後跳轉至登入頁路由
export const protectedRoutes = [
  // 這代表/dashboard/底下的所有路由都會被保護
  '/dashboard/',
  // 設定各別的路由
  '/user/status',
  '/user/profile',
  '/user/profile-password',
]

// breadcrumb面包屑使用
// 用pathname英文對照中文的名稱(類似關聯陣列的物件)
// 使用方式需用 ex. pathnameLocale['home']
// 下面是防止自動格式化使用註解
/* eslint-disable */
// prettier-ignore
// export const pathsLocaleMap = {
//   'cart':'購物車',
//   'forget-password':'重設密碼',
//   'register':'註冊',
//   'login':'登入',
//   'member':'會員',
//   'news':'新聞',
//   'about': '關於我們',
//   'product': '產品',
//   'men': '男性',
//   'women': '女性',
//   'category': '分類',
//   'list': '列表',
//   'mobile': '手機',
//   'pc': '電腦',
//   'student': '學生資料',
//   'com-test':'元件測試',
//   'breadcrumb':'麵包屑',
//   'home':'首頁',
//   'posts':'張貼文章',
//   'test':'測試',
//   'user':'會員',
// }
/* eslint-enable */
