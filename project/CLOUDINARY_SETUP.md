# Cloudinary Setup Guide

This guide will help you set up Cloudinary for file storage in your application.

## Step 1: Create a Cloudinary Account

1. Go to [https://cloudinary.com/users/register/free](https://cloudinary.com/users/register/free)
2. Sign up for a free account (or use an existing account)
3. Verify your email if required

## Step 2: Get Your Cloudinary Credentials

1. Log in to your [Cloudinary Console](https://console.cloudinary.com/)
2. Go to **Settings** → **Access Keys** (or click on your dashboard)
3. You'll see:
   - **Cloud Name** (e.g., `dxyz123abc`)
   - **API Key** (e.g., `123456789012345`)
   - **API Secret** (e.g., `abcdefghijklmnopqrstuvwxyz123456`)

## Step 3: Create an Upload Preset

1. In Cloudinary Console, go to **Settings** → **Upload**
2. Scroll down to **Upload presets**
3. Click **Add upload preset**
4. Configure the preset:
   - **Preset name**: Choose a name (e.g., `devyonira_unsigned`)
   - **Signing mode**: Select **Unsigned** (this allows client-side uploads)
   - **Folder**: Optional - you can set a default folder (e.g., `resources`)
   - **Resource type**: Select **Auto** or **Raw** (for PDFs)
5. Click **Save**

## Step 4: Configure Environment Variables

1. Copy `.env.example` to `.env.local`:
   ```bash
   cp .env.example .env.local
   ```

2. Open `.env.local` and fill in your Cloudinary credentials:
   ```env
   VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
   VITE_CLOUDINARY_API_KEY=your_api_key_here
   VITE_CLOUDINARY_API_SECRET=your_api_secret_here
   VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset_name_here
   ```

   **Important**: 
   - Replace all placeholder values with your actual credentials
   - The `VITE_CLOUDINARY_API_SECRET` is used for server-side operations (if needed later)
   - The `VITE_CLOUDINARY_UPLOAD_PRESET` should match the preset name you created in Step 3

3. Save the file

## Step 5: Restart Your Development Server

After adding the environment variables, restart your Vite development server:

```bash
npm run dev
```

## Step 6: Test the Upload

1. Navigate to your admin panel
2. Go to a week's resource management page
3. Try uploading a PDF file
4. Check the browser console for any errors
5. Verify the file appears in your Cloudinary Media Library

## Troubleshooting

### Error: "Cloudinary upload preset not configured"
- Make sure you've created the upload preset in Cloudinary Console
- Verify the preset name in `.env.local` matches exactly (case-sensitive)
- Ensure the preset is set to **Unsigned** mode

### Error: "Cloudinary cloud name not configured"
- Check that `VITE_CLOUDINARY_CLOUD_NAME` is set in `.env.local`
- Restart your development server after adding environment variables

### Files not uploading
- Check browser console for detailed error messages
- Verify your Cloudinary credentials are correct
- Make sure the upload preset allows the file type you're trying to upload

### Files uploading but not displaying
- Check that the URL is being saved correctly in Firestore
- Verify the `publicId` field is being stored
- Check Cloudinary Media Library to confirm files are uploaded

## Security Notes

⚠️ **Important Security Considerations:**

1. **Upload Preset**: Using an unsigned upload preset is convenient for client-side uploads, but:
   - Set upload limits (file size, file types) in the preset settings
   - Consider adding folder restrictions
   - Monitor your usage to prevent abuse

2. **API Secret**: The `VITE_CLOUDINARY_API_SECRET` is exposed in client-side code. For production:
   - Consider implementing a backend API endpoint for file deletion
   - Use signed uploads for sensitive files (requires backend)
   - Implement rate limiting and authentication

3. **File Deletion**: Currently, file deletion from Cloudinary requires the API secret. For production:
   - Implement a backend endpoint to handle deletions securely
   - Or use Cloudinary's admin API with proper authentication

## Additional Resources

- [Cloudinary Documentation](https://cloudinary.com/documentation)
- [Upload Presets Guide](https://cloudinary.com/documentation/upload_presets)
- [Client-Side Upload Guide](https://cloudinary.com/documentation/upload_images#client_side_upload)

