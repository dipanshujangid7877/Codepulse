const fs = require("fs").promises;
const path = require("path");
const cloudinary = require("cloudinary").v2;  // Cloudinary SDK

// Configure Cloudinary with your Cloudinary credentials
cloudinary.config({
  cloud_name: 'dqhpxpzoc',
  api_key: '722785896367625',
  api_secret: 'mXDOnMy-55nFF_l16wvy3uSZgU4'
});

async function revertRepo(commitID) {
  const repoPath = path.resolve(process.cwd(), ".apnaGit");
  const commitsPath = path.join(repoPath, "commits");

  try {
    const commitDir = path.join(commitsPath, commitID);

    // Check if the commit directory exists
    const stats = await fs.stat(commitDir).catch((err) => null);
    if (!stats || !stats.isDirectory()) {
      console.error(`The commit directory "${commitID}" does not exist.`);
      return;
    }

    console.log(`Commit directory "${commitID}" found.`);

    // Read the files inside the commit directory
    const files = await fs.readdir(commitDir);
    const parentDir = path.resolve(repoPath, "..");

    // Download and revert each file from Cloudinary (if applicable)
    for (const file of files) {
      const filePath = path.join(commitDir, file);

      // Download the file from Cloudinary
      const cloudinaryFile = await cloudinary.api.resource(file, {
        resource_type: "auto", // Automatically detect the resource type
      });

      if (cloudinaryFile) {
        const fileContent = await cloudinary.api.download(file, {
          resource_type: "auto",
        });

        // Save the file back to the parent directory
        await fs.writeFile(path.join(parentDir, file), fileContent);
        console.log(`File ${file} reverted successfully from Cloudinary.`);
      }
    }

    console.log(`Commit ${commitID} reverted successfully!`);
  } catch (err) {
    console.error("Unable to revert commit: ", err);
  }
}

module.exports = { revertRepo };
