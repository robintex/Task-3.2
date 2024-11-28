const crypto = require("crypto");
const readline = require("readline");
const { promptSelection } = require("./utils");

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

async function playDiceGame(dice1, dice2) {
  console.log(`I make the first move and choose the [${dice2.join(",")}] dice.`);

  const userDiceChoice = await promptSelection(
    `Choose your dice:\n0 - ${dice1.join(",")}\n1 - ${dice2.join(",")}\nX - exit\n? - help\n> `,
    ["0", "1", "X", "?"],
    rl
  );

  if (userDiceChoice === "X") {
    console.log("Exiting the game. Goodbye!");
    rl.close();
    return;
  } else if (userDiceChoice === "?") {
    console.log("Help: Choose a dice by entering 0 or 1. X exits the game.");
    rl.close();
    return;
  }

  const userDice = userDiceChoice === "0" ? dice1 : dice2;
  console.log(`You choose the [${userDice.join(",")}] dice.`);

  const computerThrow1 = crypto.randomInt(0, 6);
  console.log(`It's time for my throw.`);
  console.log(`I selected a random value in the range 0..5.`);

  const userInput1 = parseInt(
    await promptSelection(
      `Add your number modulo 6.\n0 - 0\n1 - 1\n2 - 2\n3 - 3\n4 - 4\n5 - 5\nX - exit\n? - help\n> `,
      ["0", "1", "2", "3", "4", "5", "X", "?"],
      rl
    ),
    10
  );

  console.log(`My number is ${computerThrow1}.`);
  const result1 = (computerThrow1 + userInput1) % 6;
  console.log(`The result is ${computerThrow1} + ${userInput1} = ${result1} (mod 6).`);
  const computerResult1 = dice2[computerThrow1];
  console.log(`My throw is ${computerResult1}.`);

  const computerThrow2 = crypto.randomInt(0, 6);
  console.log(`It's time for your throw.`);

  const userInput2 = parseInt(
    await promptSelection(
      `Add your number modulo 6.\n0 - 0\n1 - 1\n2 - 2\n3 - 3\n4 - 4\n5 - 5\nX - exit\n? - help\n> `,
      ["0", "1", "2", "3", "4", "5", "X", "?"],
      rl
    ),
    10
  );

  console.log(`My number is ${computerThrow2}.`);
  const result2 = (computerThrow2 + userInput2) % 6;
  console.log(`The result is ${computerThrow2} + ${userInput2} = ${result2} (mod 6).`);
  const userResult2 = dice1[userInput2];
  console.log(`Your throw is ${userResult2}.`);

  if (userResult2 > computerResult1) {
    console.log(`You win (${userResult2} > ${computerResult1})!`);
  } else if (userResult2 < computerResult1) {
    console.log(`I win (${computerResult1} > ${userResult2})!`);
  } else {
    console.log(`It's a tie (${userResult2} = ${computerResult1})!`);
  }

  rl.close();
}

async function main() {
  const diceConfigs = process.argv.slice(2).map((arg) =>
    arg.split(",").map((num) => parseInt(num.trim(), 10))
  );

  if (diceConfigs.length < 2) {
    console.error("Error: Please provide at least two dice configurations.");
    console.error("Example: node dice-game.js 2,2,4,4,9,9 6,8,1,1,8,6");
    process.exit(1);
  }

  console.log("Let's determine who makes the first move.");
  const firstMove = crypto.randomInt(0, 2);
  console.log(`I selected a random value in the range 0..1.`);

  const userGuess = await promptSelection(
    `Try to guess my selection.\n0 - 0\n1 - 1\nX - exit\n? - help\n> `,
    ["0", "1", "X", "?"],
    rl
  );

  if (userGuess === "X") {
    console.log("Exiting the game. Goodbye!");
    rl.close();
    return;
  } else if (userGuess === "?") {
    console.log("Help: Guess my number by entering 0 or 1. X exits the game.");
    rl.close();
    return;
  }

  const userWin = parseInt(userGuess, 10) === firstMove;
  console.log(`My selection: ${firstMove}.`);
  console.log(userWin ? "You win the first move!" : "I make the first move!");

  const computerDice = diceConfigs[1];
  const userDice = diceConfigs[0];

  await playDiceGame(userDice, computerDice);
}

module.exports = { main };
