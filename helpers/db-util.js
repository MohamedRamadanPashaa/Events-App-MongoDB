import { MongoClient } from "mongodb";

export async function connectDB() {
  const client = await MongoClient.connect(
    "mongodb+srv://MoRam:jNrm1bwQrU9CZOtS@cluster0.avkqief.mongodb.net/events?retryWrites=true&w=majority&appName=Cluster0"
  );

  return client;
}

export async function insertDocument(client, collection, document) {
  const db = client.db();
  const result = await db.collection(collection).insertOne(document);

  return result;
}

export async function getDocuments(client, collection, filterObj, sort) {
  const db = client.db();
  const documents = await db
    .collection(collection)
    .find(filterObj)
    .sort(sort)
    .toArray();

  return documents;
}
