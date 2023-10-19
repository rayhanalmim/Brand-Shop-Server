const express = require('express');
const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());


const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
const uri = "mongodb+srv://rayhanalmim1:mlRzlTCLnlvrTBil@cluster0.tdvw5wt.mongodb.net/?retryWrites=true&w=majority";

// Create a MongoClient with a MongoClientOptions object to set the Stable API version
const client = new MongoClient(uri, {
  serverApi: {
    version: ServerApiVersion.v1,
    strict: true,
    deprecationErrors: true, 
  }
});

async function run() {
  try {
    // Connect the client to the server	(optional starting in v4.7)
    // await client.connect();

    const productCollection = client.db("collectionDB").collection("product");
    const advisingCollection = client.db("AdvisingDB").collection("Data");
    const cardCollection = client.db("CardDB").collection("card");

    app.get('/product/:name', async (req, res)=>{
        const brandName = req.params.name;
        const data = await productCollection.find({ 'company': brandName }).toArray();
        res.send(data);
    })

    app.get('/productDetails/:id', async(req, res)=>{
        const id = req.params.id;
        const cursor = {_id: new ObjectId(id)};
        const result = await productCollection.findOne(cursor);
        res.send(result);
    })

    app.get('/update/:id', async(req, res)=>{
        const id = req.params.id;
        const cursor = {_id: new ObjectId(id)};
        const result = await productCollection.findOne(cursor);
        res.send(result);
    })

    app.get('/advisig/:name', async (req, res)=>{
        const brandName = req.params.name;
        const data = await advisingCollection.find({ 'company': brandName }).toArray();
        res.send(data);
    })
    
    app.post('/product', async (req, res)=>{
        const data = req.body;
        const result = await productCollection.insertOne(data);
        res.send(result);
    })

    app.get('/card',async (req, res) =>{
        const result = await cardCollection.find().toArray();
        res.send(result)
    })

    app.post('/card', async (req, res)=>{
        const data = req.body;
        const result = await cardCollection.insertOne(data);
        res.send(result);
    })

    
    app.get('/card/:email', async (req, res)=>{
        const email = req.params.email;
        const data = await cardCollection.find({ 'UserEmail': email }).toArray();
        res.send(data);
    })

    app.delete('/card/:id', async(req, res)=>{
        const id = req.params.id;
        typeof(id);
        const user = {_id: (id)}
        const result = await cardCollection.deleteOne(user);
        res.send(result);
    })

    app.put('/product/:id', async(req, res) =>{
        const product = req.body;
        const id = req.params.id;
        const filter = {_id: new ObjectId(id)};
        const options = { upsert: true };
        const updateDoc = {
            $set: {
                 productName: product.productName,
                 category: product.category,
                 company: product.company,
                 price: product.price,
                 photoUrl: product.photoUrl,
                 rating: product.rating,
            },
          };
          const result = await productCollection.updateOne(filter, updateDoc, options);
          res.send(result);
    })



    // Send a ping to confirm a successful connection
    await client.db("admin").command({ ping: 1 });
    console.log("Pinged your deployment. You successfully connected to MongoDB!");
  } finally {
    // Ensures that the client will close when you finish/error
    // await client.close();
  }
}
run().catch(console.dir);


app.get('/',(req, res)=>{
    res.send('server is runnig');
})

app.listen(port, (req, res)=>{
    console.log(`server is running at port`, port);
})