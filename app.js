import puppeteer from "puppeteer";

import * as dotenv from "dotenv";

import { generate, count } from "random-words";

dotenv.config({ path: "./.env" });

(async () => {
  // Launch the browser and open a new blank page

  const browser = await puppeteer.launch({ headless: false });
  const page = await browser.newPage();

  // Navigate the page to a URL
  await page.goto(
    "https://login.live.com/login.srf?wa=wsignin1.0&rpsnv=19&id=264960&wreply=https%3a%2f%2fwww.bing.com%2fsecure%2fPassport.aspx%3fedge_suppress_profile_switch%3d1%26requrl%3dhttps%253a%252f%252fwww.bing.com%252fchrome%252fnewtab%253fwlexpsignin%253d1%26sig%3d2BA5622241766ACF0044762240276B78%26nopa%3d2&wp=MBI_SSL&lc=1033&CSRFToken=9d54bc58-d349-4782-9d7a-2e0653d57eab&cobrandid=c333cba8-c15c-4458-b082-7c8ce81bee85&aadredir=1&nopa=2",
    {
      waitUntil: "domcontentloaded",
      timeout: 0,
    }
  );

  // Set screen size
  await page.setViewport({ width: 1366, height: 768 });

  //bot process
  await page.waitForSelector("input");
  await page.type("input", process.env.USERNAME_ENTRY, { delay: 100 });

  await page.keyboard.press("Enter");

  //password
  await page.waitForSelector("#i0118");
  await page.waitForSelector("input");

  await page.type("#i0118", process.env.PASSWAOR_ENTRY, { delay: 800 });
  await page.keyboard.press("Enter");

  // //after password
  await page.waitForSelector("#idSIButton9");
  await page.keyboard.press("Enter");

  // cookies question
  await page.waitForSelector("#bnp_btn_accept");
  await page.click("#bnp_btn_accept");

  const searchWordsHandler = async () => {
    let numberAttemps = 30; //how many searchs🕵️

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
        //await browser.close();
      }
      numberAttemps -= 1;
    }, 7000);
  };
  await searchWordsHandler();
})();
