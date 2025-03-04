// client/app/article/components/editMyeditor.jsx
"use client";
import React, { useRef, useEffect, useState } from "react";

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

function MyCustomUploadAdapterPlugin(editor) {
  editor.plugins.get("FileRepository").createUploadAdapter = (loader) => {
    return new MyUploadAdapter(loader);
  };
}

const EditMyeditor = ({ value, onChange }) => {
  const editorRef = useRef();
  const [editorLoaded, setEditorLoaded] = useState(false);
  const { CKEditor, ClassicEditor } = editorRef.current || {};

  useEffect(() => {
    // 動態加載 CKEditor
    import("@ckeditor/ckeditor5-react").then((mod) => {
      editorRef.current = {
        CKEditor: mod.CKEditor,
        ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
      };
      setEditorLoaded(true);
    });
  }, []);

  return (
    <>
      {editorLoaded ? (
        <CKEditor
          editor={ClassicEditor}
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

export default EditMyeditor;