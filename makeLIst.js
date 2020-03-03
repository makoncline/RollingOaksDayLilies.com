import fs from "fs";
import pg from "pg";
const Client = pg.Client;

main();
async function main() {
  const ahsData = await getAhsData();
  const ahsDataObj = {};
  ahsData.forEach(data => (ahsDataObj[data.id] = data));
  const userData = await getUserData(3);
  const userDataObjs = userData.map(data => {
    let obj = {};
    obj = { ...obj, ...data, slug: slugify(data.cultivar) };
    if (data.price) {
      const price = "$" + parseFloat(data.price).toFixed(2);
      obj.price = price;
    }
    if (data.ahsid) {
      const ahsData = ahsDataObj[`${data.ahsid}`];
      obj = {
        ...obj,
        ...ahsData,
        url: `https://daylilies.org/DaylilyDB/detail.php?id=${data.ahsid}`
      };
    }
    return obj;
  });
  const fields = [
    "slug",
    "cultivar",
    "price",
    "note",
    "url",
    "image",
    "hybridizer",
    "year",
    "parentage",
    "color",
    "branches",
    "budcount",
    "form",
    "foliagetype",
    "seedlingnum",
    "bloomhabit",
    "fragrance",
    "scapeheight",
    "bloomseason",
    "rebloom",
    "bloomsize",
    "ploidy",
    "sculpting",
    "id"
  ];
  let output = "";
  let header = fields.join("\t");
  output += header + "\r\n";
  const lines = userDataObjs.map(data => {
    return fields.map(field => data[field]).join("\t");
  });
  lines.forEach((line, i) => {
    output += line;
    if (i !== lines.length - 1) {
      output += "\r\n";
    }
  });
  fs.writeFileSync("testOut.txt", output);
}

async function getAhsData() {
  const client = new Client({
    user: "makon",
    host: "makon-pg-db.ceywqhmw6rov.us-east-1.rds.amazonaws.com",
    database: "ahsData",
    password: "Ss0g3E5hCR2AgqWLH77j",
    port: 5432
  });
  client.connect();
  try {
    const res = await client.query(`SELECT * FROM ahsdata2`);
    client.end();
    return res.rows;
  } catch (err) {
    client.end();
    console.log(err.stack);
  }
}
async function getUserData(userId) {
  const client = new Client({
    user: "makon",
    host: "makon-pg-db.ceywqhmw6rov.us-east-1.rds.amazonaws.com",
    database: "daylily_catalog",
    password: "Ss0g3E5hCR2AgqWLH77j",
    port: 5432
  });
  client.connect();
  try {
    const res = await client.query(
      `select name as cultivar, price, public_note as note, ahs_id as ahsId from app_public.lilies where user_id = ${userId}`
    );
    client.end();
    return res.rows;
  } catch (err) {
    client.end();
    console.log(err.stack);
  }
}

function slugify(string) {
  const a =
    "àáäâãåăæąçćčđďèéěėëêęğǵḧìíïîįłḿǹńňñòóöôœøṕŕřßşśšșťțùúüûǘůűūųẃẍÿýźžż·/_,:;";
  const b =
    "aaaaaaaaacccddeeeeeeegghiiiiilmnnnnooooooprrsssssttuuuuuuuuuwxyyzzz------";
  const p = new RegExp(a.split("").join("|"), "g");

  return string
    .toString()
    .toLowerCase()
    .replace(/\s+/g, "-") // Replace spaces with -
    .replace(p, c => b.charAt(a.indexOf(c))) // Replace special characters
    .replace(/&/g, "-and-") // Replace & with 'and'
    .replace(/[^\w\-]+/g, "") // Remove all non-word characters
    .replace(/\-\-+/g, "-") // Replace multiple - with single -
    .replace(/^-+/, "") // Trim - from start of text
    .replace(/-+$/, ""); // Trim - from end of text
}
