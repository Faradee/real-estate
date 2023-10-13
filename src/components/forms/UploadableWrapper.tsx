"use client";
import React, { SetStateAction, useState } from "react";
import { useAppSelector } from "@/app/redux/store";
import { AiOutlineCloudUpload } from "react-icons/ai";
type UploadableWrapperProps = {
  children: React.ReactNode;
  addFile: (file: string) => void;
};

const UploadableWrapper = (props: UploadableWrapperProps) => {
  const { children, addFile } = props;
  const [localDim, setLocalDim] = useState<boolean>(false);
  const postThumbnails = useAppSelector(
    (state) => state.postReducer.thumbnails,
  );
  const handleUpload = (e: React.DragEvent) => {
    const reader = new FileReader();
    console.log(e.dataTransfer.items);
    if (e.dataTransfer.items) {
      for (let i = 0; i < e.dataTransfer.items.length; i++) {
        const file = e.dataTransfer.items[i];
        if (file.kind === "file" && file.type.match("^image/")) {
          const image = file.getAsFile();
          reader.readAsDataURL(image as Blob);
          reader.onload = () => addFile(reader.result as string);
        }
      }
    }
  };

  return (
    <div className="relative w-full">
      <div
        onDragEnter={(e) => {
          e.preventDefault();
          setLocalDim(true);
        }}
        onDragLeave={(e) => {
          e.preventDefault();
          setLocalDim(false);
        }}
        onDrop={(e) => {
          e.preventDefault();
          setLocalDim(false);
          handleUpload(e);
        }}
        className="absolute z-30 hidden h-full w-full items-center justify-center bg-black text-white opacity-0"
        style={localDim ? { opacity: "0.7", display: "flex" } : {}}
      >
        {" "}
        {localDim && (
          <div className="pointer-events-none flex translate-y-[-25%] flex-col items-center justify-center">
            <AiOutlineCloudUpload size={"xl"} />
            Отпустите чтобы загрузить файл
          </div>
        )}
      </div>
      <div onDragEnter={() => setLocalDim(true)}>{children}</div>
    </div>
  );
};

export default UploadableWrapper;
