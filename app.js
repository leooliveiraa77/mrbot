import puppeteer from "puppeteer";

import * as dotenv from "dotenv";

import { generate } from "random-words";

import * as readline from "readline";

dotenv.config({ path: "./.env" });

let userName;
let userPassword;
let userAtemmpsNumber;

// create the IO interface
// also specify the input and output sources
const commandLineIO = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

// show a question to the user
commandLineIO.question(
  "Wich user do you wanna get Microsoft reward points with Mr.Bot? (1: main or 2: secondary)",
  (answer) => {
    answer === "1"
      ? loginUserHandler(1)
      : answer === "2"
      ? loginUserHandler(2)
      : console.log("There's no such user!");
  }
);

const howManyQuestion = () => {
  commandLineIO.question(
    "How many search do you wanna do with Mr.bot? (10, 20, 30): ",
    (answer) => {
      userAtemmpsNumber = Math.floor(answer);
      commandLineIO.close();
      botInit();
    }
  );
};

const loginUserHandler = (account) => {
  if (account === 1) {
    userName = process.env.USERNAME_ENTRY_MAIN;
    userPassword = process.env.PASSWORD_ENTRY_MAIN;
  } else {
    userName = process.env.USERNAME_ENTRY_SECONDARY;
    userPassword = process.env.PASSWORD_ENTRY_SECONDARY;
  }
  howManyQuestion();
};

const botInit = async () => {
  // Launch the browser and open a new blank page
  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();
  await page.setViewport({ width: 1366, height: 768 });

  // Navigate the Microsoft reward page
  await page.goto(
    "https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=19&id=264960&wreply=https%3a%2f%2fwww.bing.com%2fsecure%2fPassport.aspx%3fedge_suppress_profile_switch%3d1%26requrl%3dhttps%253a%252f%252fwww.bing.com%252fchrome%252fnewtab%253fwlexpsignin%253d1%26sig%3d2BA5622241766ACF0044762240276B78%26nopa%3d2&wp=MBI_SSL&lc=1033&CSRFToken=9d54bc58-d349-4782-9d7a-2e0653d57eab&cobrandid=c333cba8-c15c-4458-b082-7c8ce81bee85&aadredir=1&nopa=2",
    {
      waitUntil: "domcontentloaded",
      timeout: 0,
    }
  );

  //bot process
  await page.waitForSelector("input");
  await page.type("input", userName, { delay: 100 });

  await page.keyboard.press("Enter");

  //password
  await page.waitForSelector("#i0118");
  await page.waitForSelector("input");

  await page.type("#i0118", userPassword, { delay: 800 });
  await page.keyboard.press("Enter");

  // //after password
  await page.waitForSelector("#idSIButton9");
  await page.keyboard.press("Enter");

  // cookies question
  await page.waitForSelector("#bnp_btn_accept");
  await page.click("#bnp_btn_accept");

  const searchWordsHandler = async () => {
    let numberAttemps = userAtemmpsNumber; //how many searchs🕵️

    const searchAttemps = setInterval(async () => {
      let amountOfWords = Math.random() * 3; //how many words will be typed

      console.log("Attemp number " + numberAttemps);

      await page.goto(
        `https://www.bing.com/search?FORM=U523DF&PC=U523&q=${generate({
          exactly: 1,
          wordsPerString: Math.ceil(amountOfWords),
        })}`,
        {
          waitUntil: "domcontentloaded",
          timeout: 0,
        }
      );
      if (numberAttemps === 1) {
        clearInterval(searchAttemps);
        console.log("well done");
        await browser.close();
      }
      numberAttemps -= 1;
    }, 7000);
  };
  await searchWordsHandler();
};
