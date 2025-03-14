document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("project-cards-container");
  const btnLoadLocal = document.getElementById("load-local");
  const btnLoadRemote = document.getElementById("load-remote");

  // Function to render an array of project data as <project-card> elements
  function renderProjects(projects) {
    container.innerHTML = ""; // Clear any existing cards
    projects.forEach(project => {
      const card = document.createElement("project-card");
      card.setAttribute("title", project.title);
      card.setAttribute("description", project.description);
      card.setAttribute("img-src", project.imgSrc);
      card.setAttribute("img-alt", project.imgAlt);
      card.setAttribute("link", project.link);
      container.appendChild(card);
    });
  }

  // Load data from localStorage
  function loadLocalData() {
    const projects = JSON.parse(localStorage.getItem("projects")) || [];
    if (projects.length === 0) {
      alert("No local project data found.");
    }
    renderProjects(projects);
  }

  // Load data from a remote server using My JSON Server
  function loadRemoteData() {
    // Replace the URL below with your actual endpoint
    const remoteURL = "https://api.jsonbin.io/v3/b/67d3b5308a456b79667578e1";
    fetch("https://api.jsonbin.io/v3/b/67d3b5308a456b79667578e1")
      .then(response => {
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then(data => {
        // Assume the data is either an array or an object with a 'projects' property
        const projects = Array.isArray(data) ? data : data.projects;
        // Save the fetched projects to localStorage for future use
        localStorage.setItem("projects", JSON.stringify(projects));
        renderProjects(projects);
      })
      .catch(error => {
        console.error("Error fetching remote projects:", error);
        alert("Failed to load remote project data.");
      });
  }

  // Event listeners for the buttons
  if (btnLoadLocal) {
    btnLoadLocal.addEventListener("click", loadLocalData);
  }
  if (btnLoadRemote) {
    btnLoadRemote.addEventListener("click", loadRemoteData);
  }
});
