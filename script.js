document.addEventListener("DOMContentLoaded", function () {
    // ---------------------------
    // Dark & Light Theme Switcher and Custom Themes
    // ---------------------------
    const themeSwitcher = document.getElementById("theme-switcher");
    const body = document.body;
    
    // Function to apply a theme from a settings object by updating CSS variables and the font family.
    function applyTheme(themeSettings) {
      document.documentElement.style.setProperty("--bg-color", themeSettings.bgColor);
      document.documentElement.style.setProperty("--text-color", themeSettings.textColor);
      body.style.fontFamily = themeSettings.font;
    }
    
    // Check localStorage for the saved theme selection.
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      body.classList.add("dark-theme");
      themeSwitcher.textContent = "🌜"; // Moon icon for dark mode.
    } else if (savedTheme === "custom") {
      const customThemeJSON = localStorage.getItem("activeCustomTheme");
      if (customThemeJSON) {
        const customTheme = JSON.parse(customThemeJSON);
        applyTheme(customTheme);
      }
      themeSwitcher.textContent = "🌞"; // Use sun icon for light mode.
    } else {
      themeSwitcher.textContent = "🌞"; // Default is light mode.
    }
    
    // Toggle dark/light theme on switcher click.
    if (themeSwitcher) {
      themeSwitcher.addEventListener("click", function () {
        // If a custom theme is active, clear it.
        if (localStorage.getItem("theme") === "custom") {
          localStorage.removeItem("activeCustomTheme");
        }
        body.classList.toggle("dark-theme");
        if (body.classList.contains("dark-theme")) {
          themeSwitcher.textContent = "🌜";
          localStorage.setItem("theme", "dark");
        } else {
          themeSwitcher.textContent = "🌞";
          localStorage.setItem("theme", "light");
        }
      });
    }
    
    // ---------------------------
    // Extra Custom Theme Picker Code
    // ---------------------------
    const applyCustomThemeButton = document.getElementById("apply-custom-theme");
    const savedThemeSelector = document.getElementById("saved-theme-selector");
    
    // Function to update the saved theme dropdown.
    function updateSavedThemeSelector() {
      let customThemes = JSON.parse(localStorage.getItem("customThemes") || "[]");
      savedThemeSelector.innerHTML = "";
      if (customThemes.length > 0) {
        customThemes.forEach((theme, index) => {
          let option = document.createElement("option");
          option.value = index;
          option.textContent = theme.name;
          savedThemeSelector.appendChild(option);
        });
        savedThemeSelector.style.display = "block";
      } else {
        savedThemeSelector.style.display = "none";
      }
    }
    
    // Update the saved theme dropdown on page load.
    if (savedThemeSelector) {
      updateSavedThemeSelector();
      
      savedThemeSelector.addEventListener("change", function () {
        let customThemes = JSON.parse(localStorage.getItem("customThemes") || "[]");
        const selectedIndex = parseInt(this.value);
        if (!isNaN(selectedIndex)) {
          let selectedTheme = customThemes[selectedIndex];
          if (selectedTheme) {
            applyTheme(selectedTheme);
            localStorage.setItem("activeCustomTheme", JSON.stringify(selectedTheme));
            localStorage.setItem("theme", "custom");
            themeSwitcher.textContent = "🌞"; // Always show sun icon for custom (light) theme.
            body.classList.remove("dark-theme");
          }
        }
      });
    }
    
    // When user applies a custom theme, save it and update the dropdown.
    if (applyCustomThemeButton) {
      applyCustomThemeButton.addEventListener("click", () => {
        const themeName = document.getElementById("theme-name").value || "Custom Theme";
        const bgColor = document.getElementById("bg-color-picker").value;
        const textColor = document.getElementById("text-color-picker").value;
        const font = document.getElementById("font-picker").value;
    
        const customTheme = {
          name: themeName,
          bgColor: bgColor,
          textColor: textColor,
          font: font
        };
    
        let customThemes = JSON.parse(localStorage.getItem("customThemes") || "[]");
        customThemes.push(customTheme);
        localStorage.setItem("customThemes", JSON.stringify(customThemes));
    
        // Apply the custom theme immediately.
        applyTheme(customTheme);
        body.classList.remove("dark-theme");
        localStorage.setItem("activeCustomTheme", JSON.stringify(customTheme));
        localStorage.setItem("theme", "custom");
        themeSwitcher.textContent = "🌞";
    
        updateSavedThemeSelector();
      });
    }
    
    // Contact Form Validation & Error Logging
    const form = document.getElementById("contact-form");
    if (form) {
      const nameInput = document.getElementById("name");
      const emailInput = document.getElementById("email");
      const commentsInput = document.getElementById("comments");
      const formErrorsInput = document.getElementById("form-errors");
      let form_errors = [];  // Cumulative log of errors
    
      function validateEmail(email) {
        const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        return emailPattern.test(email);
      }
    
      function logError(field, message) {
        form_errors.push({ field: field, message: message });
      }
    
      function showError(outputId, message) {
        const output = document.getElementById(outputId);
        output.textContent = message;
        output.style.color = "red";
        output.style.fontSize = "0.9rem";
        output.classList.add("flash");
        setTimeout(() => {
          output.classList.remove("flash");
          output.textContent = "";
        }, 3000);
      }
    
      nameInput.addEventListener("input", function () {
        const regex = /^[A-Za-z\s]*$/;
        if (!regex.test(this.value)) {
          logError("name", "Illegal character entered in name field.");
          this.value = this.value.replace(/[^A-Za-z\s]/g, "");
          showError("name-error", "Only letters and spaces allowed.");
        }
      });
    
      emailInput.addEventListener("blur", function () {
        if (this.value && !validateEmail(this.value)) {
          logError("email", "Invalid email address entered.");
          showError("email-error", "Enter a valid email address.");
        }
      });
    
      commentsInput.addEventListener("input", function () {
        const maxChars = 500;
        const currentLength = this.value.length;
        const remaining = maxChars - currentLength;
        const counter = document.getElementById("char-count");
        counter.textContent = remaining >= 0 ? `${remaining} characters left` : "0 characters left";
        counter.style.color = remaining < 50 ? "red" : "white";
        if (currentLength > maxChars) {
          logError("comments", "Exceeded maximum characters.");
          if (!counter.classList.contains("flash")) {
            counter.classList.add("flash");
            setTimeout(() => {
              counter.classList.remove("flash");
            }, 1500);
          }
          showError("comments-error", "You have reached the character limit.");
        }
      });
    
      commentsInput.addEventListener("keydown", function (event) {
        const maxChars = 500;
        const allowedKeys = ["Backspace", "Delete", "ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown", "Home", "End"];
        if (this.value.length >= maxChars && event.key.length === 1 && !allowedKeys.includes(event.key)) {
          event.preventDefault();
          const counter = document.getElementById("char-count");
          if (!counter.classList.contains("flash")) {
            counter.classList.add("flash");
            setTimeout(() => {
              counter.classList.remove("flash");
            }, 1500);
          }
          showError("comments-error", "You have reached the character limit.");
          logError("comments", "Reached maximum characters.");
        }
      });
    
      commentsInput.addEventListener("blur", function () {
        if (this.value.length < 10) {
          logError("comments", "Comment too short.");
          showError("comments-error", "Comments must be at least 10 characters.");
        }
      });
    
      form.addEventListener("submit", function (event) {
        if (!nameInput.checkValidity()) {
          showError("name-error", "Name must be at least 2 characters and contain only letters.");
          logError("name", "Invalid Name");
        }
        if (!validateEmail(emailInput.value)) {
          showError("email-error", "Enter a valid email address.");
          logError("email", "Invalid Email");
        }
        if (commentsInput.value.length < 10) {
          showError("comments-error", "Comments must be at least 10 characters.");
          logError("comments", "Comment too short");
        }
        formErrorsInput.value = JSON.stringify(form_errors);
        console.log("Captured Form Errors:", form_errors);
      });
    }
  });
  