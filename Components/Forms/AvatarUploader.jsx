"use client";

import React, { useState, useEffect } from "react";
import { Upload, Modal, message } from "antd";
import { PlusOutlined } from "@ant-design/icons";
import {
  ref,
  uploadBytesResumable,
  getDownloadURL,
  deleteObject,
} from "firebase/storage";
import imageCompression from "browser-image-compression";
import { v4 as uuidv4 } from "uuid";
import { storage } from "@/utils/firebase/firebaseConfig";

const AvatarUploader = ({
  onAvatarUpload,
  backendImageId,
  firebaseUrlPrefix,
}) => {
  const [uploading, setUploading] = useState(false);
  const [fileList, setFileList] = useState([]);
  const [previewOpen, setPreviewOpen] = useState(false);
  const [previewImage, setPreviewImage] = useState("");
  const [uniqueImageId, setUniqueImageId] = useState(null);

  useEffect(() => {
    if (backendImageId) {
      // Fetch the URL of the existing image and set it in the file list
      const imageRef = ref(
        storage,
        `${firebaseUrlPrefix}/high/${backendImageId}`
      );
      getDownloadURL(imageRef).then((url) => {
        setUniqueImageId(backendImageId);
        console.log(url);
        setFileList([
          {
            uid: "-1",
            name: "Profile Picture",
            status: "done",
            url,
          },
        ]);
      });
    }
  }, [backendImageId]);

  const handleUpload = async ({ file, onSuccess, onError }) => {
    console.log("Uploading", firebaseUrlPrefix);
    setUploading(true);
    try {
      if (file.size > 1048576) {
        throw new Error("File size exceeds 1MB");
      }

      const uniqueImageId = `${uuidv4()}`;
      const storageRefHigh = ref(
        storage,
        `${firebaseUrlPrefix}/high/${uniqueImageId}`
      );
      const storageRefLow = ref(
        storage,
        `${firebaseUrlPrefix}/low/${uniqueImageId}`
      );

      const compressedFile = await imageCompression(file, {
        maxSizeMB: 0.1,
        maxWidthOrHeight: 200,
        useWebWorker: true,
      });

      const uploadTaskHigh = uploadBytesResumable(storageRefHigh, file);
      const uploadTaskLow = uploadBytesResumable(storageRefLow, compressedFile);

      uploadTaskHigh.on(
        "state_changed",
        (snapshot) => {
          // Handle progress if needed
        },
        async (error) => {
          onError(error);
          message.error(`${file.name} file upload failed.`);
          setUploading(false);
          setFileList([]);
          await deleteObject(storageRefHigh);
          await deleteObject(storageRefLow);
        },
        async () => {
          const highQualityURL = await getDownloadURL(
            uploadTaskHigh.snapshot.ref
          );
          const lowQualityURL = await getDownloadURL(
            uploadTaskLow.snapshot.ref
          );
          console.log("Unique Image ID", uniqueImageId);
          setUniqueImageId(uniqueImageId);
          onAvatarUpload(uniqueImageId);
          setFileList([
            {
              uid: "-1",
              name: file.name,
              status: "done",
              url: highQualityURL,
            },
          ]);
          message.success(`${file.name} file uploaded successfully.`);
          console.log(highQualityURL);
          onSuccess(null, file);
          setUploading(false);
        }
      );
    } catch (error) {
      onError(error);
      message.error("Upload failed");
      setUploading(false);
    }
  };

  const handleRemove = async () => {
    if (uniqueImageId != backendImageId) {
      const fileRefHigh = ref(
        storage,
        `${firebaseUrlPrefix}/high/${uniqueImageId}`
      );
      const fileRefLow = ref(
        storage,
        `${firebaseUrlPrefix}/low/${uniqueImageId}`
      );
      await deleteObject(fileRefHigh);
      await deleteObject(fileRefLow);
    }

    setUniqueImageId(null);
    setFileList([]);
    onAvatarUpload(null);
  };

  const beforeUpload = (file) => {
    const isLt1M = file.size / 1024 / 1024 < 1;
    if (!isLt1M) {
      message.error("File must be smaller than 1MB!");
      return Upload.LIST_IGNORE;
    }
    const isImage = file.type.startsWith("image/");
    if (!isImage) {
      message.error("You can only upload image files!");
      return Upload.LIST_IGNORE;
    }
    return true;
  };

  const handleChange = (info) => {
    // Only update fileList with valid files
    const validFiles = info.fileList.filter(
      (file) =>
        file.status !== "error" &&
        file.size <= 1048576 &&
        file.type.startsWith("image/")
    );
    setFileList(validFiles);
  };

  const handlePreview = async (file) => {
    setPreviewImage(file.url || file.thumbUrl);
    setPreviewOpen(true);
  };

  const uploadButton = (
    <div>
      <PlusOutlined />
      <div style={{ marginTop: 8 }}>Upload </div>
      <div className=" text-light-gray">(Max :1MB)</div>
    </div>
  );

  return (
    <div className=" flex items-center h-full ms-10">
      <Upload
        customRequest={handleUpload}
        listType="picture-card"
        fileList={fileList}
        onPreview={handlePreview}
        onChange={handleChange}
        accept=".png,.jpg,.jpeg"
        beforeUpload={beforeUpload}
        onRemove={handleRemove}
      >
        {fileList.length >= 1 ? null : uploadButton}
      </Upload>
      <Modal
        visible={previewOpen}
        title="Image Preview"
        footer={null}
        onCancel={() => setPreviewOpen(false)}
      >
        <img alt="example" style={{ width: "100%" }} src={previewImage} />
      </Modal>
    </div>
  );
};

export default AvatarUploader;
