// save as: add-missing-main-to-beta.mjs
import { MongoClient } from "mongodb";

const URI = "mongodb+srv://madalgoscosmos:uetrj7%4043LYC@mad-algos-enterprise-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000";
const SRC_DB = "MADAlgos-new-databse";
const DST_DB = "BetaMADAlgos";
const BATCH = 200;

function normalizeEmail(v) {
  return String(v || "").trim().toLowerCase();
}

async function main() {
  const client = new MongoClient(URI);
  await client.connect();

  const srcDb = client.db(SRC_DB);
  const dstDb = client.db(DST_DB);

  const collections = await srcDb.listCollections({}, { nameOnly: true }).toArray();

  for (const { name } of collections) {
    if (name.startsWith("system.")) continue;

    const srcCol = srcDb.collection(name);
    const dstCol = dstDb.collection(name);

    console.log(`\n==> ${name}`);
    const cursor = srcCol.find({});
    let ops = [];
    let added = 0;
    let existed = 0;

    while (await cursor.hasNext()) {
      const doc = await cursor.next();

      // users: avoid unique email conflicts by matching on email
      let filter;
      if (name === "users" && doc?.email) {
        doc.email = normalizeEmail(doc.email);
        filter = { email: doc.email };
      } else {
        filter = { _id: doc._id };
      }

      ops.push({
        updateOne: {
          filter,
          update: { $setOnInsert: doc }, // insert only if not exists
          upsert: true,
        },
      });

      if (ops.length >= BATCH) {
        const r = await dstCol.bulkWrite(ops, { ordered: false });
        added += r.upsertedCount || 0;
        existed += ops.length - (r.upsertedCount || 0);
        ops = [];
      }
    }

    if (ops.length) {
      const r = await dstCol.bulkWrite(ops, { ordered: false });
      added += r.upsertedCount || 0;
      existed += ops.length - (r.upsertedCount || 0);
    }

    console.log(`added=${added}, alreadyExists=${existed}`);
  }

  await client.close();
  console.log("\nDone: missing docs added from source to Beta.");
}

main().catch((err) => {
  console.error("FAILED:", err);
  process.exit(1);
});