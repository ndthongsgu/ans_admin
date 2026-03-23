import { PlusOutlined } from "@ant-design/icons";
import { Form, Upload, message } from "antd";
import type { UploadFile, UploadProps } from "antd/es/upload/interface";
import { useEffect, useState } from "react";
import { FileUploadService } from "@/services/file-upload.service";

export interface FileDto {
  id?: string;
  fileUrl: string;
  fileName: string;
}

interface FileUploadProps {
  label?: string;
  name?: string;
  required?: boolean;
  type?: "document" | "image" | "all";
  maxSize?: number;
  onFileUploaded?: (files: FileDto[] | FileDto) => void;
  onFileRemove?: (fileUrl: string) => Promise<void>;
  initValue?: FileDto[] | FileDto;
  mode?: "single" | "multi";
  style?: React.CSSProperties;
  // Upload configuration
  uploadEndpoint?: string;
  uploadParams?: Record<string, any>;
  autoUpload?: boolean;
}

/* ---------------- Helper ---------------- */
const getAcceptType = (type: FileUploadProps["type"]) => {
  switch (type) {
    case "document":
      return ".pdf,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.txt";
    case "image":
      return "image/*";
    default:
      return "";
  }
};

const mapInitValueToFileList = (
  initValue?: FileDto[] | FileDto | string,
  mode: "single" | "multi" = "single"
): UploadFile[] => {
  if (!initValue) return [];

  // Handle string (URL) case
  if (typeof initValue === "string") {
    return [
      {
        uid: initValue,
        name: initValue.split("/").pop() || "image",
        status: "done" as const,
        url: initValue,
        response: { fileUrl: initValue },
      },
    ] as UploadFile[];
  }

  if (mode === "multi" && Array.isArray(initValue)) {
    return initValue.map((f) => ({
      uid: f.id || f.fileName,
      name: f.fileName,
      status: "done" as const,
      url: f.fileUrl,
      response: f.fileUrl,
    })) as UploadFile[];
  }
  const file = Array.isArray(initValue) ? initValue[0] : initValue;
  return [
    {
      uid: file.id || file.fileName,
      name: file.fileName,
      status: "done" as const,
      url: file.fileUrl,
      response: file.fileUrl,
    },
  ] as UploadFile[];
};

/* ---------------- Component ---------------- */
function FileUpload({
  label = "File",
  name = "file",
  required = false,
  type = "all",
  maxSize = 10,
  onFileUploaded,
  onFileRemove,
  initValue,
  mode = "single",
  style,
  uploadEndpoint,
  uploadParams,
  autoUpload = true,
}: FileUploadProps) {
  const [fileList, setFileList] = useState<UploadFile[]>(() =>
    mapInitValueToFileList(initValue, mode)
  );
  const [uploading, setUploading] = useState(false);

  /**
   * Custom upload handler for Ant Design Upload component
   * This is called instead of the default upload behavior
   */
  const customUpload: UploadProps["customRequest"] = async (options) => {
    if (!uploadEndpoint) {
      message.error("Upload endpoint not configured");
      options.onError?.(new Error("Upload endpoint not configured"));
      return;
    }

    const { file, onSuccess, onError } = options;
    const fileObj = file as File;

    try {
      setUploading(true);
      const response = await FileUploadService.uploadFile(fileObj, uploadEndpoint, uploadParams);

      onSuccess?.(
        {
          uid: response.id || fileObj.name,
          name: response.fileName,
          status: "done" as const,
          url: response.fileUrl,
          response: response,
        },
        new XMLHttpRequest()
      );

      message.success(`${fileObj.name} tải lên thành công`);
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Upload failed";
      console.error("Upload error:", error);
      message.error(errorMsg);
      onError?.(new Error(errorMsg));
    } finally {
      setUploading(false);
    }
  };

  const uploadProps: UploadProps = {
    fileList,
    multiple: mode === "multi",
    accept: getAcceptType(type),
    customRequest: autoUpload && uploadEndpoint ? customUpload : undefined,
    beforeUpload: (file) => {
      if (file.size / 1024 / 1024 > maxSize) {
        message.error(`File phải nhỏ hơn ${maxSize}MB`);
        return Upload.LIST_IGNORE;
      }
      if (type === "image" && !file.type.startsWith("image/")) {
        message.error("Chỉ chấp nhận file hình ảnh!");
        return Upload.LIST_IGNORE;
      }
      if (mode === "single" && fileList.length >= 1) {
        message.error("Chỉ được tải lên 1 file");
        return Upload.LIST_IGNORE;
      }
      return true;
    },
    onChange: (info) => {
      let newList = info.fileList;
      if (mode === "single") newList = newList.slice(-1);
      setFileList(newList);
    },
    onRemove: async (file) => {
      try {
        if (onFileRemove) {
          const fileUrl = file.url || "";
          await onFileRemove(fileUrl);
        }
        return true;
      } catch (error) {
        const errorMsg = error instanceof Error ? error.message : "Delete failed";
        message.error(errorMsg);
        return false;
      }
    },
    disabled: uploading,
  };

  useEffect(() => {
    if (onFileUploaded) {
      const files = fileList
        .filter((f) => f.status === "done" || f.url)
        .map((f) => {
          const fileUrl = f.response?.fileUrl || f.response?.url || f.url || "";
          return {
            id: f.uid,
            fileUrl: fileUrl,
            fileName: f.name,
          };
        });

      if (files.length > 0) {
        onFileUploaded(mode === "single" ? files[0] : files);
      }
    }
  }, [fileList, mode, onFileUploaded]);

  const showUploadButton = mode === "multi" || (mode === "single" && fileList.length === 0);

  return (
    <Form.Item
      label={label}
      name={name}
      style={style}
      rules={required ? [{ required: true, message: `Vui lòng tải lên ${label}` }] : []}
    >
      <Upload listType="picture-card" {...uploadProps}>
        {showUploadButton && <PlusOutlined />}
      </Upload>
      <div style={{ fontSize: 12, color: "#666", marginTop: 4 }}>
        {type === "image" ? "Chấp nhận: Hình ảnh" : "Chấp nhận: Tất cả các file"} - Tối đa {maxSize}
        MB
        {uploading && <span style={{ marginLeft: 8, color: "#1890ff" }}>Đang tải lên...</span>}
      </div>
    </Form.Item>
  );
}

export default FileUpload;
