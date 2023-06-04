// Helper function to generate a random number
export function secureRandom(maxValue: number): number {
  return Math.floor(crypto.getRandomValues(new Uint32Array(1))[0] / (0xffffffff + 1) * maxValue);
}

// Function to randomly format a word
export function formatWord(word: string): string {
  const format = secureRandom(3);
  switch (format) {
    case 0: // All lowercase
      return word.toLowerCase();
    case 1: // All uppercase
      return word.toUpperCase();
    case 2: // Capitalize first letter
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    default:
      return word;
  }
}

// Function to randomly generate a padding string
export function generatePadding(): string {
  const symbols = ['!', '@', '#', '$', '%', '^', '&', '*'];
  const paddingLength = secureRandom(3) + 1; // Padding length between 1 and 3
  let padding = '';
  for (let i = 0; i < paddingLength; i++) {
    if (i % 2 === 0) { // Alternate between numbers and symbols
      padding += secureRandom(10); // Add a random number
    } else {
      padding += symbols[secureRandom(symbols.length)]; // Add a random symbol
    }
  }
  return padding;
}
