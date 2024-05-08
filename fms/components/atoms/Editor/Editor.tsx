import { Editor as TinyEditor } from "@tinymce/tinymce-react";
import { useRef, useState } from "react";
import { TEditor } from "./Editor.type";

// NOTE: Get content
// (e) => {
//   console.log(e.target.getContent());
// };

const Editor = ({
  className,
  onChange,
  uploadFolder,
  label,
  initialValue,
}: TEditor) => {
  const editorRef = useRef<TinyEditor | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  return (
    <div className={className}>
      {isLoading && <p>Editor is loading...</p>}
      {isLoading ? null : label ? (
        <p className="text-md mb-1 ml-1 text-gray-500">{label}</p>
      ) : null}
      <TinyEditor
        tinymceScriptSrc={
          "https://cdn.tiny.cloud/1/24la1abqyn4zhf70ikph4nzltj1aqvtxl7efjeeheozsf44q/tinymce/6/tinymce.min.js"
        }
        initialValue={initialValue}
        // FIXME: add types for editor
        onInit={(_evt, editor: any) => {
          setIsLoading(false);
          editorRef.current = editor;
        }}
        onChange={onChange}
        init={{
          menubar: false,
          images_upload_url: "/api/upload?folder=" + uploadFolder,
          media_live_embeds: true,
          branding: false,
          plugins: [
            "autolink",
            "lists",
            "link",
            "image",
            "fullscreen",
            "media",
            "table",
          ],
          toolbar:
            "undo redo | blocks | " +
            "bold italic | alignleft aligncenter " +
            "alignright alignjustify | bullist numlist outdent indent | link image fullscreen",
        }}
      />
    </div>
  );
};

export default Editor;
