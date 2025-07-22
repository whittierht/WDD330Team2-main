export function showWelcomeModal() {
  const lastVisit = localStorage.getItem("lastVisit");
  const now = new Date();
  const oneWeek = 7 * 24 * 60 * 60 * 1000;

  if (!lastVisit || now - new Date(lastVisit) > oneWeek) {
    const modalHTML = `
      <div id="registerModal" class="active">
        <div class="modal-content">
          <h2>Join Us & Win!</h2>
          <p>Register now and enter our giveaway to win amazing prizes!</p>
          <button id="registerBtn">Register Now</button>
        </div>
      </div>
    `;
    document.body.insertAdjacentHTML("beforeend", modalHTML);
    localStorage.setItem("lastVisit", now.toISOString());
    document.getElementById("registerBtn").addEventListener("click", () => {
      document.getElementById("registerModal").remove();

    });
  }
}
