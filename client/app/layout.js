import { Geist, Geist_Mono } from "next/font/google";
import { CartProvider } from "@/hooks/cartContext";
import "bootstrap/dist/css/bootstrap.min.css";
import "../public/globals.css";
// import 'bootstrap/dist/js/bootstrap.bundle.js';
import Header from "./components/Header/header";
import Footer from "./components/Footer/footer";
import Breadcrumb from "./components/Breadcrumb/breadcrumb";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import { AuthProvider } from "@/hooks/use-auth";
import Script from "next/script";

import { Noto_Sans_TC } from "next/font/google";
import { FavoriteProvider } from "@/hooks/useFavorite";

const notoSansTC = Noto_Sans_TC({
  weight: ["400", "500", "600", "700"], // 你可以選擇不同的字重
  subsets: ["latin", "chinese-traditional"], // 中文繁體字集
});

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata = {
  title: "潛水商城",
  description: "專業的潛水裝備購物平台",
};

export default function RootLayout({ children }) {
  return (
    <html lang="zh-TW">
      <head>
        <link
          href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css"
          rel="stylesheet"
          integrity="sha384-QWTKZyjpPEjISv5WaRU9OFeRpok6YctnYmDr5pNlyT2bRjXh0JMhjY6hW+ALEwIH"
          crossOrigin="anonymous"
        />
        <link
          rel="stylesheet"
          href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.11.3/font/bootstrap-icons.min.css"
        />
        <link
          rel="stylesheet"
          href="https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.5.1/css/all.min.css"
          integrity="sha512-DTOQO9RWCH3ppGqcWaEA1BIZOC6xxalwEsw9c2QQeAIftl+Vegovlnee1c9QX4TctnWMn13TZye+giMm8e2LwA=="
          crossOrigin="anonymous"
          referrerPolicy="no-referrer"
        />

        <Script
          src="https://cdn.jsdelivr.net/npm/bootstrap@5.1.1/dist/js/bootstrap.bundle.min.js"
          integrity="sha384-/bQdsTh/da6pkI1MST/rWKFNjaCP5gBSY4sEBT38Q/9RBh9AH40zEOg7Hlq2THRZ"
          crossorigin="anonymous"
        ></Script>
      </head>
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AuthProvider>
          <Header />
          <CartProvider>
            {/* <Breadcrumb /> */}
            {children}
            <ToastContainer />
          </CartProvider>
          <Footer />
        </AuthProvider>
      </body>
    </html>
  );
}
