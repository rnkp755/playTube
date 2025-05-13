import mongoose from "mongoose";
import { DB_NAME } from "../constants.js";

const connectToMongo = async () => {
      try {
            const connectionInstance = await mongoose.connect(`mongodb+srv://rnkp755:playtubeByrnkp755@cluster0.kv1qgfk.mongodb.net/${DB_NAME}`);
            console.log("Connected to MongoDB !!", connectionInstance.connection.host);
      }
      catch (error) {
            console.log("MongoDB connection Failed", error);
            process.exit(1);
      }
}

export default connectToMongo;