import { loadHeaderFooter, getLocalStorage, setLocalStorage } from "./utils.mjs";

export default function signup() {
  loadHeaderFooter().then(() => {
    setupFormSubmission();
  });
}

function setupFormSubmission() {
  const form = document.getElementById("signup-form");
  if (form) {
    form.addEventListener("submit", async (e) => {
      e.preventDefault();
      
      // Validate passwords match
      const password = form.password.value;
      const confirmPassword = form.confirmPassword.value;
      
      if (password !== confirmPassword) {
        alert("Passwords do not match!");
        return;
      }
      
      // Create user object
      const user = {
        id: Date.now().toString(),
        firstName: form.firstName.value,
        lastName: form.lastName.value,
        email: form.email.value.toLowerCase(), // normalize email to lowercase
        password: password, // Note: In production, you would hash this
        address: form.address.value,
        city: form.city.value,
        state: form.state.value,
        zip: form.zip.value,
        createdAt: new Date().toISOString()
      };
      
      try {
        // Get existing users or initialize empty array
        const users = getLocalStorage("so-users") || [];
        
        // Check if user already exists
        const userExists = users.some(u => u.email.toLowerCase() === user.email.toLowerCase());
        
        if (userExists) {
          alert("Email already in use");
          return;
        }
        
        // Add new user
        users.push(user);
        setLocalStorage("so-users", users);
        
        // Log the user in automatically
        setLocalStorage("so-user", user);
        
        alert("Account created successfully!");
        window.location.href = "/";
      } catch (err) {
        console.error("Signup error:", err);
        alert("Error creating account. Please try again.");
      }
    });
  }
}

// Initialize signup
signup();
