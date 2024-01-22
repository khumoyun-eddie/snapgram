import { useCallback, useState } from "react";
import { FileWithPath, useDropzone } from "react-dropzone";
import { Button } from "../ui";

type FileUploaderProps = {
  fieldChange: (FILES: File[]) => void;
  mediaUrl: string;
};

const FileUploader = ({ fieldChange, mediaUrl }: FileUploaderProps) => {
  const [file, setFile] = useState<File[]>([]);
  const [fileUrl, setFileUrl] = useState(mediaUrl);

  const onDrop = useCallback(
    (acceptedFiles: FileWithPath[]) => {
      setFile(acceptedFiles);
      fieldChange(acceptedFiles);
      setFileUrl(URL.createObjectURL(acceptedFiles[0]));
    },
    [file]
  );

  const { getRootProps, getInputProps } = useDropzone({
    onDrop,
    accept: {
      "image/*": [".png", ".jpg", ".svg", ".jpeg"],
    },
  });

  return (
    <div {...getRootProps()} className='flex flex-col cursor-pointer flex-center bg-dark-3 rounded-xl'>
      <input {...getInputProps()} className='cursor-pointer' />
      {fileUrl ? (
        <>
          <div className='flex justify-center flex-1 w-full p-5 lg:p-10'>
            <img src={fileUrl} alt='image' className='file_uploader-img' />
          </div>
          <p className='file_uploader-label'>Click or drag photo to replace</p>
        </>
      ) : (
        <div className='file_uploader-box'>
          <img src='/assets/icons/file-upload.svg' alt='file upload' width={96} height={77} />
          <h3 className='mt-6 mb-2 base-medium text-light-2'>Drag photo here</h3>
          <p className='mb-6 text-light-4 small-regular'>SVG, PNG, JPG</p>

          <Button className='shad-button_dark_4'>Select from computer</Button>
        </div>
      )}
    </div>
  );
};

export default FileUploader;
