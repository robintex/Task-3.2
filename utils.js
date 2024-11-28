async function askQuestion(rl, query) {
    return new Promise((resolve) => rl.question(query, resolve));
  }
  
  async function promptSelection(promptText, validOptions, rl) {
    let selection;
    while (!validOptions.includes(selection)) {
      selection = (await askQuestion(rl, promptText)).trim();
      if (!validOptions.includes(selection)) {
        console.error("Invalid selection. Try again.");
      }
    }
    return selection;
  }
  
  module.exports = { askQuestion, promptSelection };
  
