const express = require("express");
const app = express();

const morgan = require("morgan");
app.use(morgan("dev"));

//function that responds with text to GET request to the root URL (/)
app.get("/", (req, res) => {
  res.send("Hello Express!");
});

app.listen(8000, () => {
  console.log("Express server is listening on port 8000! woooooo!!!!");
});

app.get("/burgers", (req, res) => {
  res.send("We have juicy cheese burgers! BURGERS!");
});

app.get("/pizza/epperoni", (req, res) => {
  res.send("Your pizza is on the way!");
});

// app.get("/sum", (a, b) => {
//   let c = parseInt(a, 10);
//   let d = parseInt(b, 10);
//   let numSum = c + d;
//   res.send(`The sum of ${a} and ${b} is ${numSum}`);
// });

// app.get("/cipher", (text, cipher) => {
//   cipher = cipher % 26;
//   let lowerCaseStr = text.toLowerCase();
//   let alphabet = "abcdefghijklmnopqrstuvwxyz".split("");
//   let finalStr = "";
//   for (let i = 0; i < lowerCaseStr.length; i++) {
//     let currentLetter = lowerCaseStr[i];
//     if (currentLetter === " ") {
//       finalStr += currentLetter;
//     }
//     let currentIndex = alphabet.indexOf(currentLetter);
//     let newIndex = currentIndex + cipher;
//     if (newIndex > 25) {
//       newIndex = newIndex - 26;
//     }
//     if (newIndex < 0) {
//       newIndex = newIndex + 26;
//     }
//     if (text[i] === text[i].toUpperCase()) {
//       finalStr += alphabet[newIndex].toUpperCase();
//     } else finalStr += alphabet[newIndex];
//   }
// });
// Drill 2
app.get("/cipher", (req, res) => {
  const { text, shift } = req.query;

  // validation: both values are required, shift must be a number
  if (!text) {
    return res.status(400).send("text is required");
  }

  if (!shift) {
    return res.status(400).send("shift is required");
  }

  const numShift = parseFloat(shift);

  if (Number.isNaN(numShift)) {
    return res.status(400).send("shift must be a number");
  }

  // all valid, perform the task
  // Make the text uppercase for convenience
  // the question did not say what to do with punctuation marks
  // and numbers so we will ignore them and only convert letters.
  // Also just the 26 letters of the alphabet in typical use in the US
  // and UK today. To support an international audience we will have to
  // do more
  // Create a loop over the characters, for each letter, covert
  // using the shift

  const base = "A".charCodeAt(0); // get char code

  const cipher = text
    .toUpperCase()
    .split("") // create an array of characters
    .map(char => {
      // map each original char to a converted char
      const code = char.charCodeAt(0); //get the char code

      // if it is not one of the 26 letters ignore it
      if (code < base || code > base + 26) {
        return char;
      }

      // otherwise convert it
      // get the distance from A
      let diff = code - base;
      diff = diff + numShift;

      // in case shift takes the value past Z, cycle back to the beginning
      diff = diff % 26;

      // convert back to a character
      const shiftedChar = String.fromCharCode(base + diff);
      return shiftedChar;
    })
    .join(""); // construct a String from the array

  // Return the response
  res.status(200).send(cipher);
});

app.get("/pizza/pineapple", (req, res) => {
  res.send(
    "I'm tired of people having really passionate responses about pineapple on pizza."
  );
});

app.get("/echo", (req, res) => {
  const responseText = `Here are some details of your request:
      Base URL: ${req.baseUrl}
      Host: ${req.hostname}
      Path: ${req.path}
      subdomain: ${req.subdomains}
    `;
  res.send(responseText);
});

app.get("/queryViewer", (req, res) => {
  console.log(req.query);
  res.end(); //do not send any data back to the client
});

app.get("/greetings", (req, res) => {
  //1. get values from the request
  const name = req.query.name;
  const race = req.query.race;

  //2. validate the values
  if (!name) {
    //3. name was not provided
    return res.status(400).send("Please provide a name");
  }

  if (!race) {
    //3. race was not provided
    return res.status(400).send("Please provide a race");
  }

  //4. and 5. both name and race are valid so do the processing.
  const greeting = `Greetings ${name} the ${race}, welcome to our kingdom.`;

  //6. send the response
  res.send(greeting);
});

// Drill 3
app.get("/lotto", (req, res) => {
  const { numbers } = req.query;

  // validation:
  // 1. the numbers array must exist
  // 2. must be an array
  // 3. must be 6 numbers
  // 4. numbers must be between 1 and 20

  if (!numbers) {
    return res.status(200).send("numbers is required");
  }

  if (!Array.isArray(numbers)) {
    return res.status(200).send("numbers must be an array");
  }

  const guesses = numbers
    .map(n => parseInt(n))
    .filter(n => !Number.isNaN(n) && (n >= 1 && n <= 20));

  if (guesses.length != 6) {
    return res
      .status(400)
      .send("numbers must contain 6 integers between 1 and 20");
  }

  // fully validated numbers

  // here are the 20 numbers to choose from
  const stockNumbers = Array(20)
    .fill(1)
    .map((_, i) => i + 1);

  //randomly choose 6
  const winningNumbers = [];
  for (let i = 0; i < 6; i++) {
    const ran = Math.floor(Math.random() * stockNumbers.length);
    winningNumbers.push(stockNumbers[ran]);
    stockNumbers.splice(ran, 1);
  }

  //compare the guesses to the winning number
  let diff = winningNumbers.filter(n => !guesses.includes(n));

  // construct a response
  let responseText;

  switch (diff.length) {
    case 0:
      responseText = "Wow! Unbelievable! You could have won the mega millions!";
      break;
    case 1:
      responseText = "Congratulations! You win $100!";
      break;
    case 2:
      responseText = "Congratulations, you win a free ticket!";
      break;
    default:
      responseText = "Sorry, you lose";
  }

  // uncomment below to see how the results ran

  // res.json({
  //   guesses,
  //   winningNumbers,
  //   diff,
  //   responseText
  // });

  res.send(responseText);
});
