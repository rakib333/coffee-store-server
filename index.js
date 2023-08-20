const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion } = require('mongodb');
const app = express();
require('dotenv').config()
const port = process.env.PORT || 5000;


// middleware
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
    res.send('server is running')
})

// connection with mongoDB

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@pherocluster.znbq6ro.mongodb.net/?retryWrites=true&w=majority`;

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
        await client.connect();

        // Send a ping to confirm a successful connection
        await client.db("admin").command({ ping: 1 });
        console.log("Pinged your deployment. You successfully connected to MongoDB!");

        const coffeeCollection = client.db('coffeeDB').collection('coffees');

        // creating rest-api
        // quality of of coffees api
        const qualityCollection = client.db('coffeeDB').collection('quality');
        app.get('/qualities', async (req, res) => {
            const qualities = qualityCollection.find({});
            const result = await qualities.toArray();
            res.send(result)
        })

        // create and add  new coffee to db
        app.post('/coffees', async (req, res) => {
            const newCoffee = req.body;
            const result = await coffeeCollection.insertOne(newCoffee);
            res.send(result)
        })



    }

    finally {
        // Ensures that the client will close when you finish/error
        // await client.close();
    }
}
run().catch(console.dir);






app.listen(port, () => {
    console.log(`Coffee store server is running at port: ${port}`)
})