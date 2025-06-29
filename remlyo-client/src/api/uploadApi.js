import API from "../services/api";
import { getAuthHeaders } from "../utils";
import { ALLOWED_FILE_TYPES, MAX_FILE_SIZE } from "../constants";

// const validateFile = (files) => {
//   if (!files || (Array.isArray(files) && files.length === 0)) {
//     throw new Error("No files provided");
//   }

//   const filesToValidate = Array.isArray(files) ? files : [files];

//   filesToValidate.forEach((file) => {
//     if (!ALLOWED_FILE_TYPES.includes(file.type)) {
//       throw new Error(
//         "Invalid file type. Only JPEG, PNG, WebP images and Excel/CSV files are allowed"
//       );
//     }

//     if (file.size > MAX_FILE_SIZE) {
//       throw new Error(
//         `File size too large. Maximum size is ${
//           MAX_FILE_SIZE / (1024 * 1024)
//         }MB`
//       );
//     }
//   });
// };

const uploadFiles = async (authToken, files) => {
  try {
    // validateFile(files);

    const formData = new FormData();
    files.forEach((file) => formData.append("files", file));
    const res = await API.post("/api/v1/upload/multiple", formData, {
      headers: {
        ...getAuthHeaders(authToken),
        "Content-Type": "multipart/form-data",
      },
    });

    if (!res.data.success) {
      throw new Error(res.data.message || "Upload failed");
    }

    return {
      success: true,
      data: res.data.files,
    };
  } catch (error) {
    console.error("Upload error:", error);
    return error.response.data;
  }
};

export { uploadFiles };
