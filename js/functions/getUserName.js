import axios from "axios";
import dictionary from "../../dictionaries/dictionary.json";


export default async function getUserName() {
  // Get random index with range 0 - max
  function getRandomInt(max) {
    return Math.floor(Math.random() * max);
  }

  // Capitalize first letter of a string
  function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
  }

  // Get all adj and nouns from dictionaries
  const adjectives = dictionary.adjectives;
  const nouns = dictionary.nouns;

  // Get random adjective and noun
  const adj = adjectives[getRandomInt(adjectives.length)];
  const noun = nouns[getRandomInt(nouns.length)];
  console.log(adj);
  console.log(noun);


  try {
    const grammems = noun[1];
    const key = process.env.HTML_WEB_APIKEY
    const { data } = await axios.get(`https://htmlweb.ru/json/service/inflect?api_key=${key}&inflect=${adj}&partofspeech=П&grammems=${grammems},ИМ&nolimit&html&letter_case=ucfirst`);
    console.log(data)
    console.log(`${capitalizeFirstLetter(data.items[0])} ${noun[0]}`);
    return `${capitalizeFirstLetter(data.items[0])} ${noun[0]}`;
  } catch (e) {
      throw e;

  }
}