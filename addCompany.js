const admin = require("firebase-admin");
const crypto = require("crypto");
var serviceAccount = require("./search-permance-test-kankabu-firebase-adminsdk-6cf4s-383ee62192.json");

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  projectId: "search-permance-test-kankabu",
});

const db = admin.firestore();

function randomString(length) {
  return crypto.randomBytes(length).toString("hex").slice(0, length);
}

function generateSubstrings(input, minLength) {
  const substrings = [];
  for (let i = 0; i < input.length; i++) {
    for (let j = minLength; j <= input.length - i; j++) {
      substrings.push(input.substr(i, j));
    }
  }
  return substrings;
}

async function addCompanies() {
  const BATCH_SIZE = 500;
  let batch = db.batch();
  let batchCount = 0;

  for (let i = 0; i < 10000; i++) {
    const companyName = "会社名" + randomString(10);
    const companyKana = randomString(15);

    const nameIndex = generateSubstrings(companyName, 3);
    const kanaIndex = generateSubstrings(companyKana, 3);

    const company = {
      name: companyName,
      kana: companyKana,
      nameIndex: nameIndex,
      kanaIndex: kanaIndex,
    };

    const docRef = db.collection("companies").doc(i.toString());
    batch.set(docRef, company);

    batchCount++;

    if (batchCount === BATCH_SIZE) {
      await batch.commit();
      batch = db.batch(); // 新しいバッチを作成
      batchCount = 0; // バッチカウントをリセット
    }
  }

  // 残りのドキュメントをコミット
  if (batchCount > 0) {
    await batch.commit();
  }

  console.log("Companies added successfully");
}

addCompanies();
