document.addEventListener("DOMContentLoaded", () => {
  const startGameButton = document.getElementById("startGame");
  const submitFeedbackButton = document.getElementById("submitFeedback");

  startGameButton.addEventListener("click", () => {
    const wordLength = document.getElementById("wordLength").value;
    const uniqueOnly = document.getElementById("uniqueOnly").checked;

    fetch("/start_game", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ wordLength, uniqueOnly }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.error) {
          alert(data.error);
        } else {
          alert(data.message);
          document.getElementById("suggestion").innerText =
            data.suggestion || "";
        }
      });
  });

  submitFeedbackButton.addEventListener("click", () => {
    const feedback = document.getElementById("feedback").value;

    fetch("/submit_feedback", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ feedback }),
    })
      .then((response) => response.json())
      .then((data) => {
        if (data.word) {
          alert(data.message + " " + data.word);
        } else {
          alert(data.message);
          document.getElementById("suggestion").innerText =
            data.suggestion || "";
        }
      });
  });
});
