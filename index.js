const XLSX = require("xlsx");
const axios = require("axios");

const dataType = ["shopify", "woocommerce", "bigcommerce", "magento"];

// GET THE HTML DATA OF WEBSITE
const getHtmlData = async (website) => {
  let htmlData = "";
  await axios
    .get(website)
    .then(async (html) => {
      htmlData = html.data;
    })
    .catch((err) => console.error(err));
  return htmlData;
};

const getType = async (website) => {
  const htmlData = await getHtmlData(website);
  if (htmlData === "") return "NOT_WORKING";
  let result = "OTHERS";
  dataType.every(async (key) => {
    let position = htmlData.search(key);
    if (position !== -1) {
      result = key.toUpperCase();
      return false;
    }
    return true;
  });

  return result;
};

const writeResult = async (data) => {
  const ws = XLSX.utils.json_to_sheet(data);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, "Responses");
  await XLSX.writeFile(wb, "result.xlsx");
};

const startChecking = async () => {
  var workbook = XLSX.readFile("./input.xlsx");

  var sheet_name_list = workbook.SheetNames;
  let xlData = XLSX.utils.sheet_to_json(workbook.Sheets[sheet_name_list[0]]);

  for await (const res of xlData.map(async (website, indx) => {
    type = await getType(website.Website);
    xlData[indx] = { Website: website.Website, Category: type };
  }))
    writeResult(xlData);
};

startChecking();
