// TODO: Implement the chat API with Groq and web scraping with Cheerio and Puppeteer
// Refer to the Next.js Docs on how to read the Request body: https://nextjs.org/docs/app/building-your-application/routing/route-handlers
// Refer to the Groq SDK here on how to use an LLM: https://www.npmjs.com/package/groq-sdk
// Refer to the Cheerio docs here on how to parse HTML: https://cheerio.js.org/docs/basics/loading
// Refer to Puppeteer docs here: https://pptr.dev/guides/what-is-puppeteer
import { getGroqResponse } from "@/app/utils/groqClient";
import { urlPattern, scrapeUrl } from "@/app/utils/scraper";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = body.message;
    
    // this finds url(s) in the message
    const url = message.match(urlPattern);
    let scrapedContent = " ";
    if (url) {
      console.log("url found", url);
      const scraperResponse = await scrapeUrl(url);
      // scrapedContent = scraperResponse.content;
    }
    // seperate the user query from the url
    const userQuery = message.replace(url ? url[0] : "", "").trim();

    const prompt = `
    Answer my question: "${userQuery}"

    based on the following context: "${scrapedContent}"
    `

    const groqResponse = await getGroqResponse(message);
    return new Response(
      JSON.stringify({ message: groqResponse }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      }
    );
  } catch (error) {
    console.error("Error:", error);
    return new Response(
      JSON.stringify({
        error: "An error occurred while processing your request",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      }
    );
  }
}
