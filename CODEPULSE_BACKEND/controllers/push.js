const fs = require("fs").promises;
const path = require("path");
const cloudinary = require('../config/cloudinary-config');


async function pushRepo() {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDirs = await fs.readdir(commitsPath);

    for (const commitDir of commitDirs) {
      const commitPath = path.join(commitsPath, commitDir);
      const files = await fs.readdir(commitPath);

      for (const file of files) {
        const filePath = path.join(commitPath, file);

        const uploadResult = await cloudinary.uploader.upload(filePath, {
          folder: `commits/${commitDir}`, 
          public_id: path.parse(file).name, 
          resource_type: "raw", 
        });

        console.log(`Uploaded: ${uploadResult.secure_url}`);
      }
    }

    console.log("All commits pushed to Cloudinary.");
  } catch (err) {
    console.error("Error pushing to Cloudinary: ", err);
  }
}

module.exports = { pushRepo };
