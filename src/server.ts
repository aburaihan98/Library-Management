const { MongoClient, ServerApiVersion } = require("mongodb");
const uri =
  "mongodb+srv://aburaihanrahmani:gDng3596DSYKVjpz@raihan.0p9bes0.mongodb.net/?retryWrites=true&w=majority&appName=Raihan";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true,
  },
});

async function main() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    await client.connect();
    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log(
      "Pinged your deployment. You successfully connected to MongoDB!"
    );
  } catch (error) {
    // Ensures that the client will close when you finish/error
    console.log(error);
  }
}
main();
