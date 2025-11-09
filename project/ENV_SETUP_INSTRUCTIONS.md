# How to Fix the Cloudinary Upload Preset Error

## The Problem
You're seeing this error: "Cloudinary upload preset not configured. Please set VITE_CLOUDINARY_UPLOAD_PRESET in your .env.local file"

## Solution Steps

### Step 1: Open your `.env.local` file
The file should be located at: `DevYonira/project/.env.local`

### Step 2: Add these lines to the file
Make sure your `.env.local` file contains these variables (replace with your actual values):

```env
VITE_CLOUDINARY_CLOUD_NAME=your_cloud_name_here
VITE_CLOUDINARY_UPLOAD_PRESET=your_preset_name_here
```

**Important Notes:**
- ✅ Variable names MUST start with `VITE_` (this is required by Vite)
- ✅ No spaces around the `=` sign
- ✅ No quotes around the values (unless the value itself contains spaces)
- ✅ One variable per line

### Step 3: Get Your Cloudinary Values

1. **Cloud Name**: 
   - Go to [Cloudinary Console](https://console.cloudinary.com/)
   - Your cloud name is shown at the top of the dashboard (e.g., `dxyz123abc`)

2. **Upload Preset**:
   - In Cloudinary Console, go to **Settings** → **Upload**
   - Scroll to **Upload presets**
   - Find your preset name (or create one if you haven't)
   - The preset MUST be set to **"Unsigned"** mode
   - Copy the exact preset name (case-sensitive)

### Step 4: Example `.env.local` file
Here's what your file should look like (with example values):

```env
VITE_CLOUDINARY_CLOUD_NAME=dxyz123abc
VITE_CLOUDINARY_API_KEY=123456789012345
VITE_CLOUDINARY_API_SECRET=abcdefghijklmnopqrstuvwxyz123456
VITE_CLOUDINARY_UPLOAD_PRESET=devyonira_unsigned
```

**Note:** For unsigned uploads, you only NEED:
- `VITE_CLOUDINARY_CLOUD_NAME` (required)
- `VITE_CLOUDINARY_UPLOAD_PRESET` (required)

The API Key and Secret are optional for unsigned uploads.

### Step 5: Restart Your Dev Server
**This is CRITICAL!** Vite only reads environment variables when it starts.

1. Stop your current dev server (press `Ctrl+C` in the terminal)
2. Start it again: `npm run dev`
3. Try uploading again

### Step 6: Verify It's Working
1. Open your browser console (F12)
2. Look for the debug message: "🔍 Cloudinary Config Debug"
3. You should see ✅ for both `cloud_name` and `upload_preset`

## Common Issues

### Issue: File doesn't exist
Create the file: `DevYonira/project/.env.local`

### Issue: Variables not being read
- Make sure variable names start with `VITE_`
- Make sure there are no spaces around `=`
- **Restart your dev server** after making changes

### Issue: Upload preset not found
- Make sure the preset name matches exactly (case-sensitive)
- Make sure the preset is set to "Unsigned" mode
- Check Cloudinary Console → Settings → Upload → Upload presets

### Issue: Still getting errors after restart
1. Check browser console for the debug message
2. Verify the values are correct (no typos)
3. Make sure the `.env.local` file is in the `project` folder (same level as `package.json`)

## Quick Test
After setting up, check the browser console. You should see:
```
🔍 Cloudinary Config Debug: {
  cloud_name: "✅ Set",
  upload_preset: "✅ Set",
  ...
}
```

If you see "❌ Missing" for upload_preset, the variable is not being read correctly.

