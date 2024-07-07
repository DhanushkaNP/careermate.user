import React, { useState } from "react";
import { Upload, Button, message } from "antd";
import { UploadOutlined } from "@ant-design/icons";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import { v4 as uuidv4 } from "uuid"; // Import the UUID library
import { storage } from "@/utils/firebase/firebaseConfig";

const FlyerUploader = ({ onFlyerUpload }) => {
  const [uploadingFlyer, setUploadingFlyer] = useState(false);
  const [uploadedFlyerUrl, setUploadedFlyerUrl] = useState(null);
  const [fileList, setFileList] = useState([]);

  const handleFlyerUpload = ({ file, onSuccess, onError }) => {
    setUploadingFlyer(true);
    const uniqueFileName = `${uuidv4()}-${file.name}`;
    const storageRef = ref(storage, `flyers/${uniqueFileName}`);
    const uploadTask = uploadBytesResumable(storageRef, file);

    uploadTask.on(
      "state_changed",
      (snapshot) => {
        // Handle progress if needed
      },
      (error) => {
        onError(error);
        message.error(`${file.name} file upload failed.`);
        setUploadingFlyer(false);
        // Clear file list on error
        setFileList([]);
        // Delete the partially uploaded file from storage
        const fileRef = ref(storage, `flyers/${uniqueFileName}`);
        deleteObject(fileRef)
          .then(() => {
            message.warning(`${file.name} file removed due to upload failure.`);
          })
          .catch((deleteError) => {
            message.error("Failed to remove partially uploaded file.");
          });
      },
      () => {
        getDownloadURL(uploadTask.snapshot.ref).then((downloadURL) => {
          setUploadedFlyerUrl(downloadURL);
          onFlyerUpload(downloadURL);
          message.success(`${file.name} file uploaded successfully.`);
          onSuccess(null, file);
          setUploadingFlyer(false);

          setFileList([file]);
        });
      }
    );
  };

  const handleFlyerRemove = () => {
    if (uploadedFlyerUrl) {
      const fileRef = ref(storage, uploadedFlyerUrl);
      deleteObject(fileRef)
        .then(() => {
          setUploadedFlyerUrl(null);
          onFlyerUpload(null);
          message.success("Flyer removed successfully.");
        })
        .catch((error) => {
          message.error("Failed to remove flyer.");
        });
    }
  };

  const beforeUpload = (file) => {
    const isLt2M = file.size / 1024 / 1024 < 2;
    if (!isLt2M) {
      message.error("File must be smaller than 2MB!");
    }
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
    }
    return isLt2M && isImage;
  };

  const flyerUploaderProps = {
    name: "flyer",
    multiple: false,
    customRequest: handleFlyerUpload,
    onRemove: handleFlyerRemove,
    beforeUpload, // Add this to validate the file size
    maxCount: 1,
    accept: "image/jpeg,image/png,image/gif,image/bmp,image/svg+xml",
    fileList, // Controlled fileList
    onChange: (info) => {
      const { status } = info.file;
      if (status === "done") {
        setFileList([info.file]);
      } else if (status === "removed") {
        setFileList([]);
      }
    },
  };

  return (
    <Upload {...flyerUploaderProps}>
      <Button icon={<UploadOutlined />} loading={uploadingFlyer}>
        {uploadingFlyer ? "Uploading" : "Upload Flyer"}
      </Button>
    </Upload>
  );
};

export default FlyerUploader;
