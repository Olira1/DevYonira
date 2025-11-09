import cloudinaryConfig from "./cloudinaryConfig";

/**
 * Upload a file to Cloudinary
 * @param {File} file - The file to upload
 * @param {string} folder - The folder path in Cloudinary (e.g., "resources/week-123")
 * @param {Object} options - Additional upload options
 * @returns {Promise<{url: string, publicId: string}>} - The uploaded file URL and public ID
 */
export const uploadToCloudinary = async (file, folder = "resources", options = {}) => {
  try {
    const uploadPreset = cloudinaryConfig.upload_preset;
    const cloudName = cloudinaryConfig.cloud_name;

    if (!uploadPreset) {
      throw new Error(
        "Cloudinary upload preset not configured. Please set VITE_CLOUDINARY_UPLOAD_PRESET in your .env.local file"
      );
    }

    if (!cloudName) {
      throw new Error(
        "Cloudinary cloud name not configured. Please set VITE_CLOUDINARY_CLOUD_NAME in your .env.local file"
      );
    }

    // Determine resource type based on file type
    let resourceType = "raw"; // Default for PDFs and other files
    if (file.type.startsWith("image/")) {
      resourceType = "image";
    } else if (file.type.startsWith("video/")) {
      resourceType = "video";
    }

    // Create FormData for upload
    const formData = new FormData();
    formData.append("file", file);
    formData.append("upload_preset", uploadPreset);
    formData.append("folder", folder);
    
    // Add any additional options
    if (options.tags) {
      formData.append("tags", options.tags);
    }
    if (options.context) {
      formData.append("context", JSON.stringify(options.context));
    }

    const uploadUrl = `https://api.cloudinary.com/v1_1/${cloudName}/${resourceType}/upload`;
    
    console.log("📤 Upload Details:", {
      url: uploadUrl,
      preset: uploadPreset,
      folder: folder,
      resourceType: resourceType,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type
    });

    // Upload to Cloudinary
    let response;
    try {
      response = await fetch(uploadUrl, {
        method: "POST",
        body: formData,
      });
    } catch (fetchError) {
      // Handle network errors
      console.error("❌ Network Error:", fetchError);
      if (fetchError.message.includes("Failed to fetch") || fetchError.message.includes("ERR_INTERNET_DISCONNECTED")) {
        throw new Error(
          "Network error: Unable to connect to Cloudinary. Please check:\n" +
          "1. Your internet connection\n" +
          "2. Cloudinary service status\n" +
          "3. Firewall/proxy settings\n" +
          "4. Upload preset configuration in Cloudinary Console"
        );
      }
      throw new Error(`Network error: ${fetchError.message}`);
    }

    if (!response.ok) {
      let errorMessage = `Upload failed with status ${response.status}`;
      try {
        const errorData = await response.json();
        console.error("❌ Cloudinary API Error:", errorData);
        errorMessage = errorData.error?.message || errorData.message || errorMessage;
        
        // Provide helpful error messages for common issues
        if (errorData.error?.message?.includes("Invalid upload preset")) {
          errorMessage = `Invalid upload preset "${uploadPreset}". Please verify:\n` +
            "1. The preset name is correct (case-sensitive)\n" +
            "2. The preset exists in Cloudinary Console\n" +
            "3. The preset is set to 'Unsigned' mode";
        } else if (errorData.error?.message?.includes("Invalid cloud name")) {
          errorMessage = `Invalid cloud name "${cloudName}". Please verify your Cloudinary cloud name.`;
        }
        
        // Include more details if available
        if (errorData.error?.http_code) {
          errorMessage += ` (HTTP ${errorData.error.http_code})`;
        }
      } catch (parseError) {
        // If JSON parsing fails, try to get text response
        try {
          const textResponse = await response.text();
          console.error("❌ Cloudinary Response (text):", textResponse);
          if (textResponse) {
            errorMessage = textResponse;
          }
        } catch (textError) {
          // Use default error message
          console.error("❌ Could not parse error response");
        }
      }
      throw new Error(errorMessage);
    }

    const data = await response.json();
    return {
      url: data.secure_url,
      publicId: data.public_id,
      format: data.format,
      bytes: data.bytes,
      width: data.width,
      height: data.height,
    };
  } catch (error) {
    console.error("Error uploading to Cloudinary:", error);
    throw error;
  }
};

/**
 * Delete a file from Cloudinary
 * @param {string} publicId - The public ID of the file to delete
 * @param {string} resourceType - The resource type (image, video, raw, auto)
 * @returns {Promise<void>}
 */
export const deleteFromCloudinary = async (publicId, resourceType = "auto") => {
  try {
    // Note: Deletion requires api_secret which should be on server-side
    // For client-side, you'll need a backend endpoint to handle deletion
    // For now, we'll use the admin API (not recommended for production client-side)
    
    if (!publicId) {
      console.warn("No public ID provided for deletion");
      return;
    }

    // Extract public ID from URL if full URL is provided
    const cleanPublicId = publicId.includes("/") 
      ? publicId.split("/").slice(-2).join("/").replace(/\.[^/.]+$/, "")
      : publicId;

    // For client-side deletion, you should call a backend API
    // This is a placeholder - implement server-side deletion for production
    console.warn(
      "Client-side deletion is not secure. Please implement server-side deletion endpoint."
    );
    
    // If you have a backend API endpoint:
    // const response = await fetch('/api/cloudinary/delete', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ publicId, resourceType })
    // });
    
    return;
  } catch (error) {
    console.error("Error deleting from Cloudinary:", error);
    throw error;
  }
};

/**
 * Extract public ID from Cloudinary URL
 * @param {string} url - The Cloudinary URL
 * @returns {string|null} - The public ID or null if not a Cloudinary URL
 */
export const extractPublicIdFromUrl = (url) => {
  if (!url || !url.includes("cloudinary.com")) {
    return null;
  }

  try {
    const urlParts = url.split("/");
    const uploadIndex = urlParts.findIndex((part) => part === "upload");
    if (uploadIndex === -1) return null;

    // Get the part after the version (v1234567890) or after upload
    const afterUpload = urlParts.slice(uploadIndex + 1);
    const versionIndex = afterUpload.findIndex((part) => part.startsWith("v"));
    
    const startIndex = versionIndex !== -1 ? versionIndex + 1 : 0;
    const pathParts = afterUpload.slice(startIndex);
    
    // Remove file extension
    const publicId = pathParts.join("/").replace(/\.[^/.]+$/, "");
    return publicId;
  } catch (error) {
    console.error("Error extracting public ID:", error);
    return null;
  }
};

