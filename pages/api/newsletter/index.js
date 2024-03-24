import { connectDB, insertDocument } from "../../../helpers/db-util";

async function handler(req, res) {
  if (req.method === "POST") {
    const { email } = req.body;

    if (!email || !email.includes("@")) {
      res.status(422).json({ message: "Invalid email address." });
      return;
    }

    // connect with db
    let client;
    try {
      client = await connectDB();
    } catch (error) {
      res
        .status(500)
        .json({ message: "Connecting to the database has failed!" });
      return;
    }

    try {
      await insertDocument(client, "newsletter", { email });
      client.close();
    } catch (error) {
      res.status(500).json({ message: "Inserting data failed!" });
      return;
    }

    res.status(200).json({ message: "success" });
  }
}

export default handler;
