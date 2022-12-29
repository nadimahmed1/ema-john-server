const express = require('express');
const { MongoClient, ServerApiVersion, ObjectId, } = require('mongodb');

const cors = require('cors');
const app = express();
const port = process.env.PORT || 5000;
require('dotenv').config();

// MiddleWare

app.use(cors());
app.use(express.json());



const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.lowferz.mongodb.net/?retryWrites=true&w=majority`;
console.log('db connected');
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        await client.connect();

        const productCollection = client.db('emaJohn').collection('product');

        app.get('/product', async (req, res) => {
            const page = parseInt(req.query.page);
            const size = parseInt(req.query.size);
            const query = {};
            const cursor = productCollection.find(query);
            let products;

            if (page || size) {
                products = await cursor.skip(page * size).limit(size).toArray();
            }
            else {
                products = await cursor.toArray();
            }



            res.send(products)
        });

        // Post paiganation
        app.post('/productByKeys', async (req, res) => {
            const keys = req.body;

            const ids = keys.map(id => ObjectId(id))
            console.log(ids);
            const query = { _id: { $in: ids } };
            const cursor = productCollection.find(query);
            const products = await cursor.toArray();

            res.send(products)

        });

        // Paiganation

        app.get('/productCount', async (req, res) => {

            const count = await productCollection.estimatedDocumentCount();
            res.send({ count })
        })
    }
    finally {

    }
};

run().catch(console.dir);


app.get('/', (req, res) => {
    res.send('John is waiting to Ema')
});

app.listen(port, () => {
    console.log('Ema John server is Running');
})