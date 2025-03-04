import React, { useRef, useEffect, useState } from "react"; // 確保 useRef 已經導入

class MyUploadAdapter {
  constructor(loader, articleId) {
    this.loader = loader;
    this.articleId = articleId; // 傳遞文章 ID
  }

  upload() {
    return this.loader.file.then(
      (file) =>
        new Promise((resolve, reject) => {
          const formData = new FormData();
          formData.append("articleImage", file);

          fetch("http://localhost:3005/api/article/upload-ckeditor-image-temp", {
            method: "POST",
            body: formData,
          })
            .then((response) => response.json())
            .then((result) => {
              if (result.success) {
                resolve({ default: `http://localhost:3005${result.url}` });
              } else {
                reject(result.message);
              }
            })
            .catch(reject);
        })
    );
  }
}

function MyCustomUploadAdapterPlugin(editor, articleId) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader, articleId);
  };
}

const Myeditor = ({ onChange, name, value, articleId }) => {
  const editorRef = useRef(); // 初始化 useRef
  const [editorLoaded, setEditorLoaded] = useState(false); // 用於檢查 CKEditor 是否加載完成
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    // 動態加載 CKEditor
    import("@ckeditor/ckeditor5-react").then((mod) => {
      editorRef.current = {
        CKEditor: mod.CKEditor,
        ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
      };
      setEditorLoaded(true); // 設置加載完成狀態
    });
  }, []);

  return (
    <>
      {editorLoaded ? (
        <CKEditor
          name={name}
          editor={ClassicEditor}
          data={value}
          onChange={(event, editor) => onChange(editor.getData())}
          config={{
            extraPlugins: [MyCustomUploadAdapterPlugin], // 確保插件已註冊
            uploadAdapter: (loader) => {
              return new MyUploadAdapter(loader, articleId); // 確保上傳適配器已配置
            },
          }}
        />
      ) : (
        <div>Editor loading...</div>
      )}
    </>
  );
};

export default Myeditor;
