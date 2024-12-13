import axios from "axios";
import cheerio from "cheerio";

export const urlPattern =
  /^(https?:\/\/)?((([a-zA-Z\d]([a-zA-Z\d-]*[a-zA-Z\d])*)\.)+[a-zA-Z]{2,}|((\d{1,3}\.){3}\d{1,3}))(:\d+)?(\/[-a-zA-Z\d%_.~+]*)*(\?[;&a-zA-Z\d%_.~+=-]*)?(\#[-a-zA-Z\d_]*)?$/i;


export async function scrapeUrl(url: string) {
  const response = await axios.get(url);
  const textData = cheerio.load(response.data);
  // Once we get the raw html code we need to EXTRACT the TEXT from the most important properties
  const title = textData("title").text();
  console.log(textData);
}
