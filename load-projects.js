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
    const remoteURL = "https://my-json-server.typicode.com/AKalakota23/portfolio-data/projects";
    fetch("https://my-json-server.typicode.com/AKalakota23/portfolio-data/projects")
      .then(response => {
        console.log("Response status:", response.status);
        if (!response.ok) {
          throw new Error("Network response was not ok.");
        }
        return response.json();
      })
      .then(data => {
        console.log("Fetched data:", data);
        const projects = Array.isArray(data) ? data : data.projects;
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
