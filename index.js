const XLSX = require("xlsx");
const axios = require("axios");
require("dotenv").config();

const dataType = process.env.BRAND_NAME.split(",");
const INTPUT_URL = process.env.INTPUT_URL;
const OUTPUT_URL = process.env.OUTPUT_URL;

// GET THE HTML DATA OF WEBSITE
const getHtmlData = async (website) => {
  let htmlData = "";
  try {
    // AXIOS REQ FOR HTML
    await axios.get(website).then(async (html) => {
      htmlData = html.data;
    });
  } catch {
    (err) => console.error(err);
  }

  return htmlData;
};

// SEARCH KEYWORD IN HTML STRING
const getType = async (website) => {
  try {
    const htmlData = await getHtmlData(website);
    if (htmlData === "") return "NOT_WORKING";
    let result = "OTHERS";
    // CHECKING WITH EACH KEYWORD
    dataType.every(async (key) => {
      let position = htmlData.search(key);
      if (position !== -1) {
        result = key.toUpperCase();
        return false;
      }
      return true;
    });

    return result;
  } catch {
    (err) => console.error(err);
  }
};

// WRITE RESULT FILE
const writeResult = async (data) => {
  try {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Responses");
    await XLSX.writeFile(wb, OUTPUT_URL);
  } catch {
    (err) => console.error(err);
  }
};

const startChecking = async () => {
  try {
    // READ INPUT DATA
    var workbook = XLSX.readFile(INTPUT_URL);
    var sheet_name_list = workbook.SheetNames;
    let xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

    // CHECKING ONCE  BY ONCE WEBSITE
    for await (const res of xlData.map(async (website, indx) => {
      type = await getType(website.Website);
      xlData[indx] = { Website: website.Website, Category: type };
    }))
      writeResult(xlData);
  } catch {
    (err) => console.error(err);
  }
};

startChecking();
