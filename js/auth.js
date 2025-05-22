document.addEventListener("DOMContentLoaded", function () {
  // Elementos de la interfaz
  const loginBtn = document.getElementById("login-btn");
  const userProfile = document.getElementById("user-profile");
  const usernameElement = document.getElementById("username");
  const logoutBtn = document.getElementById("logout-btn");

  const currentUser = JSON.parse(localStorage.getItem("currentUser"));
  if (currentUser) {
    loginBtn.classList.add("hidden");
    userProfile.classList.remove("hidden");
    usernameElement.textContent = currentUser.name;
  }

  if (logoutBtn) {
    logoutBtn.addEventListener("click", function () {
      localStorage.removeItem("currentUser");
      window.location.href = "index.html";
    });
  }

  const authTabs = document.querySelectorAll(".auth-tab");
  const loginForm = document.getElementById("login-form");
  const registerForm = document.getElementById("register-form");
  const loginMessage = document.getElementById("login-message");
  const registerMessage = document.getElementById("register-message");

  if (authTabs) {
    authTabs.forEach((tab) => {
      tab.addEventListener("click", function () {
        const tabType = this.getAttribute("data-tab");

        authTabs.forEach((t) => t.classList.remove("active"));
        this.classList.add("active");

        if (tabType === "login") {
          loginForm.classList.remove("hidden");
          registerForm.classList.add("hidden");
        } else {
          loginForm.classList.add("hidden");
          registerForm.classList.remove("hidden");
        }
      });
    });
  }

  if (loginForm) {
    loginForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const email = document.getElementById("login-email").value;
      const password = document.getElementById("login-password").value;

      const users = JSON.parse(localStorage.getItem("users")) || [];
      const user = users.find(
        (u) => u.email === email && u.password === password
      );

      if (user) {
        loginMessage.textContent = "¡Inicio de sesión exitoso!";
        loginMessage.classList.add("success");

        localStorage.setItem("currentUser", JSON.stringify(user));

        setTimeout(() => {
          window.location.href = "index.html";
        }, 1000);
      } else {
        loginMessage.textContent =
          "Correo electrónico o contraseña incorrectos.";
        loginMessage.classList.add("error");
      }
    });
  }

  if (registerForm) {
    registerForm.addEventListener("submit", function (e) {
      e.preventDefault();

      const name = document.getElementById("register-name").value;
      const email = document.getElementById("register-email").value;
      const password = document.getElementById("register-password").value;
      const confirmPassword = document.getElementById(
        "register-password-confirm"
      ).value;

      if (password !== confirmPassword) {
        registerMessage.textContent = "Las contraseñas no coinciden.";
        registerMessage.classList.add("error");
        return;
      }

      const users = JSON.parse(localStorage.getItem("users")) || [];
      if (users.some((u) => u.email === email)) {
        registerMessage.textContent =
          "Este correo electrónico ya está registrado.";
        registerMessage.classList.add("error");
        return;
      }

      const newUser = {
        id: Date.now().toString(),
        name,
        email,
        password,
      };

      users.push(newUser);
      localStorage.setItem("users", JSON.stringify(users));

      registerMessage.textContent =
        "¡Registro exitoso! Ahora puedes iniciar sesión.";
      registerMessage.classList.add("success");

      registerForm.reset();

      setTimeout(() => {
        document.querySelector('[data-tab="login"]').click();
      }, 1500);
    });
  }
});
