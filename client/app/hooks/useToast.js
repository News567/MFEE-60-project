import { toast, Zoom } from "react-toastify";

const useToast = () => {
  const showToast = (message, options = {}) => {
    toast.success(message, {
      position: "top-center",
      autoClose: 1000,
      hideProgressBar: true,
      closeOnClick: false,
      pauseOnHover: true,
      draggable: true,
      progress: undefined,
      theme: "colored", // 在這裡設定顏色主題
      transition: Zoom, // 設置過渡效果為 Zoom
      ...options, //覆蓋用
    });
  };

  return { showToast };
};

export default useToast;
