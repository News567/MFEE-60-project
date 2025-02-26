"use client";
import React, { useRef } from "react";

// 自定義上傳適配器
class MyUploadAdapter {
  constructor(loader) {
    this.loader = loader;
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("articleImage", file);
          fetch("/api/upload", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((result) => {
              resolve({ default: result.url });
            })
            .catch(reject);
        })
    );
  }
}

// 自定義 CKEditor 插件，讓它支援圖片上傳
function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

const Myeditor = ({ onChange, name, value }) => {
  const editorRef = useRef();
  const { CKEditor, ClassicEditor } = editorRef.current || {}; // 這裡會進行動態加載 CKEditor 和 ClassicEditor

  React.useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"), // 使用免費版的 ClassicEditor
    };
  }, []);

  
  return (
    <>
      {CKEditor && ClassicEditor ? ( // 確保 CKEditor 和 ClassicEditor 都已經加載完成
        <CKEditor
          name={name}
          editor={ClassicEditor} // 使用 ClassicEditor
          data={value}
          onChange={(event, editor) => onChange(editor.getData())}
          config={{
            extraPlugins: [MyCustomUploadAdapterPlugin],
          }}
        />
      ) : (
        <div>Editor loading...</div>
      )}
    </>
  );
};

export default Myeditor;
