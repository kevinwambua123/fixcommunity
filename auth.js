function showMessage(form, message, success = false) {
  let output = form.querySelector(".auth-message");

  if (!output) {
    output = document.createElement("p");
    output.className = "auth-message";
    output.setAttribute("role", "status");
    form.appendChild(output);
  }

  output.textContent = message;
  output.style.color = success ? "green" : "crimson";
}

const signupForm = document.getElementById("signup-form");

if (signupForm) {
  signupForm.addEventListener("submit", function (event) {
    event.preventDefault();

    const username = signupForm.querySelector("#username").value.trim();
    const email = signupForm.querySelector("#email").value.trim();
    const password = signupForm.querySelector("#password").value;

    if (!username || !email || !password) {
      showMessage(signupForm, "Please fill in all fields.");
      return;
    }

    if (password.length < 8) {
      showMessage(
        signupForm,
        "Your password must contain at least 8 characters.",
      );
      return;
    }

    showMessage(signupForm, "you've successfully signed up", true);
  });
}

const loginForm = document.getElementById("login-form");

if (loginForm) {
  loginForm.addEventListener("submit", function (event) {
    event.preventDefault();

    showMessage(loginForm, "you've successfully logged in");
  });
}
