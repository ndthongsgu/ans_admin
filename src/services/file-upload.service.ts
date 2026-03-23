import axiosInstance from "./axios";
import API_ENDPOINTS from "./api-route";

interface UploadResponse {
  fileUrl: string;
  fileName: string;
  id?: string;
}

interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  error: null | string;
  statusCode: number;
}

interface StallImageResponse {
  id: string;
  cover_image: string;
}

export class FileUploadService {
  /**
   * Generic file upload method
   * @param file File to upload
   * @param endpoint API endpoint for upload
   * @param additionalParams Additional form data parameters
   * @param fieldName Field name for the file in form data (default: "cover_image")
   * @returns Upload response
   */
  static async uploadFile(
    file: File,
    endpoint: string,
    additionalParams?: Record<string, any>,
    fieldName: string = "cover_image"
  ): Promise<UploadResponse> {
    const formData = new FormData();
    formData.append(fieldName, file);

    // Add any additional parameters to the form data
    if (additionalParams) {
      Object.entries(additionalParams).forEach(([key, value]) => {
        formData.append(key, value);
      });
    }

    try {
      const response = await axiosInstance.post<ApiResponse<StallImageResponse>>(
        endpoint,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );

      // Handle the wrapped response format from the API
      const data = response.data.data || response.data;
      return {
        fileUrl: data.cover_image || (data as any).fileUrl || "",
        fileName: file.name,
        id: data.id,
      };
    } catch (error) {
      const errorMsg = error instanceof Error ? error.message : "Upload failed";
      throw new Error(`Failed to upload file: ${errorMsg}`);
    }
  }

  /**
   * Delete uploaded image
   * @param stallId Stall ID
   * @returns Deletion response
   */
  static async deleteStallImage(stallId: string): Promise<void> {
    try {
      await axiosInstance.delete(API_ENDPOINTS.STALL.DELETEIMAGE(stallId));
    } catch (error) {
      throw new Error(`Failed to delete image: ${error}`);
    }
  }
}
