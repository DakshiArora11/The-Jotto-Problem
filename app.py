from flask import Flask, request, jsonify, render_template
import os
from game.wordSolver import load_words, filter_possible_words, heuristic_guess

app = Flask(__name__)

# Global variables for game state
current_words = []
possible_words = []
current_guess = ""
word_length = 3
unique_only = False

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/start_game", methods=["POST"])
def start_game():
    global current_words, possible_words, current_guess, word_length, unique_only
    data = request.json
    word_length = int(data["wordLength"])
    unique_only = data["uniqueOnly"]

    try:
        current_words = load_words(word_length, unique_only)
        possible_words = current_words.copy()
        current_guess = heuristic_guess(possible_words)
        return jsonify({"message": "Game started!", "suggestion": current_guess})
    except FileNotFoundError as e:
        return jsonify({"error": str(e)}), 400


@app.route("/submit_feedback", methods=["POST"])
def submit_feedback():
    global possible_words, current_guess

    data = request.json
    feedback = int(data["feedback"])

    # Update possible words based on feedback
    possible_words = filter_possible_words(possible_words, current_guess, feedback)

    if len(possible_words) == 0:
        return jsonify({"message": "No possible words remain. Please check your inputs."})
    elif len(possible_words) == 1:
        return jsonify({"message": "The secret word is:", "word": possible_words[0]})
    elif len(possible_words) <= 3:
        # Return all possible words for user to decide
        return jsonify({"message": f"{len(possible_words)} possible words remain.", "words": possible_words})
    else:
        # Continue with a heuristic guess
        current_guess = heuristic_guess(possible_words)
        return jsonify({"message": f"{len(possible_words)} possible words remain.", "suggestion": current_guess})

# @app.route("/submit_feedback", methods=["POST"])
# def submit_feedback():
#     global possible_words, current_guess

#     data = request.json
#     feedback = int(data["feedback"])

#     possible_words = filter_possible_words(possible_words, current_guess, feedback)

#     if len(possible_words) == 0:
#         return jsonify({"message": "No possible words remain. Please check your inputs."})
#     elif len(possible_words) == 1:
#         return jsonify({"message": "The secret word is:", "word": possible_words[0]})
#     else:
#         current_guess = heuristic_guess(possible_words)
#         return jsonify({"message": f"{len(possible_words)} possible words remain.", "suggestion": current_guess})

if __name__ == "__main__":
    app.run(debug=True)
