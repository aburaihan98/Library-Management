import mongoose from "mongoose";
import app from "./app";

const PORT = process.env.PORT || 5000;

let server;

async function main() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await mongoose.connect(
      "mongodb+srv://aburaihanrahmani:gDng3596DSYKVjpz@raihan.0p9bes0.mongodb.net/Minimal-Library-Management-System?retryWrites=true&w=majority&appName=Raihan"
    );

    server = app.listen(PORT, () => {
      console.log(`✅ Server is running on port ${PORT}`);
    });
  } catch (error) {
    console.error("❌ Failed to connect MongoDB", error);
  }
}
main();
