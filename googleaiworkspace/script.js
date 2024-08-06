const repoOwner = "jaikishan52" // Your GitHub username
const repoName = "GoogleaiprojectUI" // Your repository name
const branch = "main" // Your default branch name
const githubToken = "enter you github token" // Your GitHub token

const fetchFiles = async () => {
  try {
    const result = await axios.get(`https://api.github.com/repos/${repoOwner}/${repoName}/contents`, {
      headers: {
        Authorization: `Bearer ${githubToken}`,
      },
    })
    const files = result.data.filter((file) => file.type === "file")
    displayFiles(files)
  } catch (error) {
    console.error("Error fetching files:", error)
  }
}

const displayFiles = (files) => {
  const fileIconsContainer = document.getElementById("file-icons")
  fileIconsContainer.innerHTML = ""

  if (files.length === 0) {
    fileIconsContainer.innerHTML = "<p>No files found.</p>"
  } else {
    files.forEach((file) => {
      const fileIconItem = document.createElement("div")
      fileIconItem.className = "file-icon-item"
      fileIconItem.innerHTML = `
        <div class="icon-placeholder">
          ${file.name.endsWith(".txt") ? "📄" : "📁"}
        </div>
        <div class="file-name">${file.name}</div>
      `
      fileIconsContainer.appendChild(fileIconItem)
    })
  }
}

const uploadFile = async () => {
  const fileInput = document.getElementById("fileInput")
  const file = fileInput.files[0]
  if (!file) return

  const reader = new FileReader()
  reader.readAsDataURL(file)
  reader.onloadend = async () => {
    const content = reader.result.split(",")[1]

    try {
      await axios.put(
        `https://api.github.com/repos/${repoOwner}/${repoName}/contents/${file.name}`,
        {
          message: `Add ${file.name}`,
          content: content,
          branch: branch,
        },
        {
          headers: {
            Authorization: `Bearer ${githubToken}`,
          },
        }
      )
      alert("File uploaded successfully")
    } catch (error) {
      console.error("Error uploading file:", error)
      alert("Failed to upload file")
    }
  }
}

document.getElementById("uploadButton").addEventListener("click", uploadFile)

// Fetch and display files when the page loads
fetchFiles()
