import { model, Schema } from "mongoose";

const schema = new Schema({
  imgSrc: String,
  link: String,
  description: String,
});

export default model("FeaturedCategory", schema);
