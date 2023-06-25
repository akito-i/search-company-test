const admin = require("firebase-admin");
var serviceAccount = require("./search-permance-test-kankabu-firebase-adminsdk-6cf4s-383ee62192.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "search-permance-test-kankabu",
});
const db = admin.firestore();

async function searchCompanies(queryString) {
  // Record the start time
  const startTime = process.hrtime();

  const nameQuery = db
    .collection("companies")
    .where("nameIndex", "array-contains", queryString);
  const kanaQuery = db
    .collection("companies")
    .where("kanaIndex", "array-contains", queryString);

  const nameResults = await nameQuery.get();
  const kanaResults = await kanaQuery.get();

  console.log("Matching company names:");
  nameResults.forEach((doc) => {
    console.log(doc.data());
  });

  console.log("Matching company kana:");
  kanaResults.forEach((doc) => {
    console.log(doc.data());
  });

  // Record the end time and calculate the elapsed time in seconds
  const elapsedTime = process.hrtime(startTime);
  const elapsedTimeInSec = elapsedTime[0] + elapsedTime[1] / 1e9;
  console.log(`Elapsed time: ${elapsedTimeInSec.toFixed(3)} seconds`);
}

// Get the search string from the command line arguments
const searchString = process.argv[2];

if (!searchString) {
  console.error("Please provide a search string as an argument.");
  process.exit(1);
}

// Pass the search string to the searchCompanies function
searchCompanies(searchString);
