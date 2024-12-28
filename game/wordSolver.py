import itertools
from collections import defaultdict, Counter
import concurrent.futures
import string
import os

THRESHOLD = 1000  # Threshold for building the graph

def load_words(word_length, unique_only):
    """Load words from the appropriate text file."""
    filename = f"{word_length}_letter_words{'_unique' if unique_only else ''}.txt"
    try:
        filepath = os.path.join(os.path.dirname(__file__), filename)
        with open(filepath, 'r', encoding='utf-8') as f:
            words = [
                line.strip().lower() for line in f
                if len(line.strip()) == word_length and line.strip().isalpha()
            ]
            words = list(set(words))  # Ensure words are unique
            return words
    except FileNotFoundError:
        raise FileNotFoundError(f"Word list file '{filename}' not found.")

def count_common_letters(word1, word2):
    """Count the number of common letters between two words."""
    c1 = Counter(word1)
    c2 = Counter(word2)
    common = c1 & c2
    return sum(common.values())

def filter_possible_words(possible_words, guess, feedback):
    """Filter possible words based on feedback."""
    return [w for w in possible_words if count_common_letters(w, guess) == feedback]

def heuristic_guess(possible_words):
    """Select a guess using a heuristic (maximum unique letters)."""
    max_unique = -1
    best_word = None
    for w in possible_words:
        unique_letters = len(set(w))
        if unique_letters > max_unique:
            max_unique = unique_letters
            best_word = w
    return best_word

def main():
    # Example to test the functionality
    word_length = 3  # Change as needed
    unique_only = True  # Change as needed

    words = load_words(word_length, unique_only)
    print(f"Loaded {len(words)} words of length {word_length} (unique_only={unique_only}).")

    guess = words[0]
    possible_words = words.copy()
    feedback = None

    while True:
        if len(possible_words) == 0:
            print("No possible words remain. Please check your inputs.")
            break
        elif len(possible_words) == 1:
            print(f"The secret word is: {possible_words[0]}")
            break
        else:
            print(f"Suggested guess: {guess}")
            feedback = int(input("Enter the number of matching letters: "))
            possible_words = filter_possible_words(possible_words, guess, feedback)
            print(f"{len(possible_words)} possible words remain.")
            if len(possible_words) <= 10:
                print("Possible words:", possible_words)
            guess = heuristic_guess(possible_words)

if __name__ == "__main__":
    main()
