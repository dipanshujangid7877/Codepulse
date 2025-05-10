const fs = require("fs").promises;
const path = require("path");
const cloudinary = require("cloudinary").v2;  // Cloudinary SDK

// Configure Cloudinary with your Cloudinary credentials
cloudinary.config({
  cloud_name: 'dqhpxpzoc',
  api_key: '722785896367625',
  api_secret: 'mXDOnMy-55nFF_l16wvy3uSZgU4'
});

async function pullRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitFiles = await fs.readdir(commitsPath);  // List files in commits directory

    for (const file of commitFiles) {
      const filePath = path.join(commitsPath, file);

      // Check if it's a file, not a directory
      const stats = await fs.stat(filePath);
      if (stats.isFile()) {
        // Upload the file to Cloudinary
        const uploadResult = await cloudinary.uploader.upload(filePath, {
          folder: "commits", // Folder in Cloudinary for organization
        });

        console.log(`File uploaded to Cloudinary: ${uploadResult.secure_url}`);
      } else {
        console.log(`Skipping directory: ${file}`);
      }
    }

    console.log("All commits pulled and uploaded to Cloudinary.");
  } catch (err) {
    console.error("Unable to upload to Cloudinary: ", err);
  }
}

module.exports = { pullRepo };
