import {
  connectDB,
  getDocuments,
  insertDocument,
} from "../../../helpers/db-util";

async function handler(req, res) {
  const eventId = req.query.eventId;

  // connect with db
  let client;
  try {
    client = await connectDB();
  } catch (error) {
    res.status(500).json({ message: "connecting to the database failed!" });
    return;
  }

  if (req.method === "POST") {
    const { email, name, text } = req.body;

    if (
      !email.includes("@") ||
      !name ||
      name.trim() === "" ||
      !text ||
      text.trim() === ""
    ) {
      res.status(422).json({ message: "Invalid input." });
      client.close();
      return;
    }

    const newComment = {
      email,
      name,
      text,
      eventId,
    };

    try {
      const result = await insertDocument(client, "comments", newComment);

      // insertedId is unique id created by mongoDB
      newComment._id = result.insertedId;

      res.status(201).json({ message: "Added Comment", comment: newComment });
    } catch (error) {
      res
        .status(500)
        .json({ message: "can not add your comment, Please try again later!" });
    }
  }

  if (req.method === "GET") {
    let documents = [];
    try {
      documents = await getDocuments(
        client,
        "comments",
        { eventId },
        { _id: -1 }
      );

      res.status(200).json({
        message: "success",
        comments: documents,
      });
    } catch (error) {
      res.status(500).json({ message: "couldn't fetch comments!" });
    }
  }

  client.close();
}

export default handler;
