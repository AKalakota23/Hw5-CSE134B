class ProjectCard extends HTMLElement {
  constructor() {
    super();
    this.attachShadow({ mode: "open" });
  }
  
  connectedCallback() {
    const title = this.getAttribute("title") || "Project Title";
    const description = this.getAttribute("description") || "Description";
    const imgSrc = this.getAttribute("img-src") || "images/.jpg";
    const imgAlt = this.getAttribute("img-alt") || "Project image";
    const link = this.getAttribute("link") || "#";
    
    this.render(title, description, imgSrc, imgAlt, link);
  }
  
  render(title, description, imgSrc, imgAlt, link) {
    this.shadowRoot.innerHTML = `
      <style>
        :host {
          display: block;
          background-color: var(--card-bg, #fff);
          border: 1px solid var(--card-border, #ccc);
          padding: var(--card-padding, 16px);
          margin: var(--card-margin, 16px);
          max-width: 300px;
          box-shadow: var(--card-shadow, 0 2px 4px rgba(0,0,0,0.1));
          border-radius: 8px;
          font-family: var(--card-font, 'Arial', sans-serif);
        }
        h2 {
          margin-top: 0;
          font-size: 1.5rem;
        }
        picture, img {
          width: 100%;
          height: auto;
          border-radius: 4px;
          margin-bottom: 8px;
        }
        p {
          font-size: 1rem;
          line-height: 1.4;
          margin-bottom: 8px;
        }
        a {
          text-decoration: none;
          color: var(--secondar-color, #8bc34a);
          font-weight: bold;
        }
        a:hover {
          text-decoration: underline;
        }
      </style>
      <article>
        <h2>${title}</h2>
        <picture>
          <img src="${imgSrc}" alt="${imgAlt}">
        </picture>
        <p>${description}</p>
        <a href="${link}" target="_blank" rel="noopener">Learn More</a>
      </article>
    `;
  }
}

customElements.define("project-card", ProjectCard);
