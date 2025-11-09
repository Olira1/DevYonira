// Cloudinary configuration
// Get your credentials from: https://console.cloudinary.com/settings/api-keys

const cloudinaryConfig = {
  cloud_name: import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "dtuaqlzvx",
  api_key: import.meta.env.VITE_CLOUDINARY_API_KEY || "144392779945653",
  api_secret: import.meta.env.VITE_CLOUDINARY_API_SECRET || "Z3VtnEMjoOuvIox-ZGVka9J_XpQ",
  upload_preset: import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "yaaliyaaluf",
};

// Validation: Log configuration status (only in development)
if (import.meta.env.DEV) {
  // Debug: Log what configuration is being used
  const usingEnvVars = !!(import.meta.env.VITE_CLOUDINARY_CLOUD_NAME && import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET);
  console.log("🔍 Cloudinary Config:", {
    source: usingEnvVars ? "Environment Variables" : "Hardcoded (default)",
    cloud_name: cloudinaryConfig.cloud_name ? "✅ " + cloudinaryConfig.cloud_name.substring(0, 8) + "..." : "❌ Missing",
    upload_preset: cloudinaryConfig.upload_preset ? "✅ " + cloudinaryConfig.upload_preset : "❌ Missing",
  });
}

export default cloudinaryConfig;

