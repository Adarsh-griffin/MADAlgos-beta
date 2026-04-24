import { MongoClient } from "mongodb";

const SRC_URI = "mongodb+srv://madalgoscosmos:uetrj7%4043LYC@mad-algos-enterprise-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000";
const SRC_DB = "MADAlgos-new-databse";

const DST_URI = "mongodb+srv://madalgoscosmos:uetrj7%4043LYC@mad-algos-enterprise-cosmos.global.mongocluster.cosmos.azure.com/?tls=true&authMechanism=SCRAM-SHA-256&retrywrites=false&maxIdleTimeMS=120000";
const DST_DB = "BetaMADAlgos";

const BATCH = 200;

async function main() {
  const srcClient = new MongoClient(SRC_URI);
  const dstClient = new MongoClient(DST_URI);

  await srcClient.connect();
  await dstClient.connect();

  const srcDb = srcClient.db(SRC_DB);
  const dstDb = dstClient.db(DST_DB);

  const cols = await srcDb.listCollections({}, { nameOnly: true }).toArray();

  for (const { name } of cols) {
    if (name.startsWith("system.")) continue;

    const srcCol = srcDb.collection(name);
    const dstCol = dstDb.collection(name);

    console.log(`\n==> ${name}`);
    const cursor = srcCol.find({});
    let ops = [];
    let inserted = 0;
    let skipped = 0;

    while (await cursor.hasNext()) {
      const doc = await cursor.next();

      ops.push({
        updateOne: {
          filter: { _id: doc._id },
          update: { $setOnInsert: doc }, // add only if missing
          upsert: true,
        },
      });

      if (ops.length >= BATCH) {
        const r = await dstCol.bulkWrite(ops, { ordered: false });
        inserted += r.upsertedCount || 0;
        skipped += ops.length - (r.upsertedCount || 0);
        ops = [];
      }
    }

    if (ops.length) {
      const r = await dstCol.bulkWrite(ops, { ordered: false });
      inserted += r.upsertedCount || 0;
      skipped += ops.length - (r.upsertedCount || 0);
    }

    console.log(`added=${inserted}, alreadyExists=${skipped}`);
  }

  await srcClient.close();
  await dstClient.close();
  console.log("\nDone.");
}

main().catch((e) => {
  console.error("FAILED:", e);
  process.exit(1);
});