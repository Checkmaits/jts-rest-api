import { connect } from "mongoose";

export function connectToMongoDB(callback) {
  connect(process.env.MONGO_URI, {})
    .then(() => callback())
    .catch((error) => console.error(`JT's REST API >> Failed to connect to MongoDB: ${error.message}`));
}
