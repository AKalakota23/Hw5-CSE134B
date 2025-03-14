document.addEventListener("DOMContentLoaded", function () {
  const container = document.getElementById("project-cards-container");

  // Try to load from localStorage
  let projects = JSON.parse(localStorage.getItem("projects")) || [];

  // If no data in localStorage, fetch from remote JSON
  if (projects.length === 0) {
    fetch("projects.json")
      .then(response => response.json())
      .then(data => {
        projects = data.projects; // e.g. { "projects": [ { ... }, { ... } ] }
        // Save to localStorage
        localStorage.setItem("projects", JSON.stringify(projects));
        renderProjects(projects);
      })
      .catch(error => {
        console.error("Error fetching projects:", error);
      });
  } else {
    // We already have projects from localStorage
    renderProjects(projects);
  }

  function renderProjects(projects) {
    // Clear container before rendering
    container.innerHTML = "";

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
});
