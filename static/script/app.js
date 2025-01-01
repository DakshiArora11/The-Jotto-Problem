// document.addEventListener("DOMContentLoaded", () => {
//   const startGameButton = document.getElementById("startGame");
//   const submitFeedbackButton = document.getElementById("submitFeedback");

//   startGameButton.addEventListener("click", () => {
//     const wordLength = document.getElementById("wordLength").value;
//     const uniqueOnly = document.getElementById("uniqueOnly").checked;

//     fetch("/start_game", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ wordLength, uniqueOnly }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.error) {
//           alert(data.error);
//         } else {
//           alert(data.message);
//           document.getElementById("suggestion").innerText =
//             data.suggestion || "";
//         }
//       });
//   });

//   submitFeedbackButton.addEventListener("click", () => {
//     const feedback = document.getElementById("feedback").value;

//     fetch("/submit_feedback", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ feedback }),
//     })
//       .then((response) => response.json())
//       .then((data) => {
//         if (data.word) {
//           alert(data.message + " " + data.word);
//         } else {
//           alert(data.message);
//           document.getElementById("suggestion").innerText =
//             data.suggestion || "";
//         }
//       });
//   });
// });
document.addEventListener("DOMContentLoaded", () => {
  const startGameButton = document.getElementById("startGame");
  const submitFeedbackButton = document.getElementById("submitFeedback");
  const possibleWordsDiv = document.getElementById("possibleWords");
  const wordList = document.getElementById("wordList");

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
      })
      .catch((error) => {
        console.error("Error starting the game:", error);
        alert("An error occurred while starting the game.");
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
          possibleWordsDiv.style.display = "none";
        } else if (data.words) {
          alert(data.message + "\nSee the possible words below.");
          displayPossibleWords(data.words);
        } else {
          alert(data.message);
          document.getElementById("suggestion").innerText =
            data.suggestion || "";
          possibleWordsDiv.style.display = "none";
        }
      })
      .catch((error) => {
        console.error("Error submitting feedback:", error);
        alert("An error occurred while submitting feedback.");
      });
  });

  function displayPossibleWords(words) {
    wordList.innerHTML = ""; // Clear any existing words
    words.forEach((word) => {
      const li = document.createElement("li");
      li.textContent = word;
      li.className = "possible-word";

      // Add click handler to let user select a word as their next guess
      li.addEventListener("click", () => {
        document.getElementById("suggestion").innerText = word;
        alert(`Your secret word was "${word}" .`);
        possibleWordsDiv.style.display = "none";
      });

      wordList.appendChild(li);
    });

    possibleWordsDiv.style.display = "block";
  }
});
