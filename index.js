const express = require('express');
const cors = require('cors');
const { MongoClient, ServerApiVersion, ObjectId } = require('mongodb');
require('dotenv').config();


const app = express();
const port = process.env.PORT || 5000;

// middle ware--
app.use(cors());
app.use(express.json());

const uri = `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASSWORD}@cluster0.lhckmem.mongodb.net/?retryWrites=true&w=majority`;
const client = new MongoClient(uri, { useNewUrlParser: true, useUnifiedTopology: true, serverApi: ServerApiVersion.v1 });

async function run() {
    try {
        const addTaskCollection = client.db("To-do-List").collection("addTask");

        // add task data save---
        app.post('/addTask', async (req, res) => {
            const addTask = req.body;
            const result = await addTaskCollection.insertOne(addTask);
            res.send(result);
        });

        // get my task data ---
        app.get('/myTask/:email', async (req, res) => {
            const email = req.params.email;
            console.log(email);
            const query = { email };
            const result = await addTaskCollection.find(query).toArray();
            res.send(result);
        });

        // get my task single data ---
        app.get('/myTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) }
            const result = await addTaskCollection.findOne(query)
            res.send(result);
        });

        // delete my task-----------
        app.delete('/myTask/:id', async (req, res) => {
            const id = req.params.id;
            const query = { _id: ObjectId(id) };
            const result = await addTaskCollection.deleteOne(query);
            res.send(result);
        });

        // update task  ------------------------------
        app.put('/addTask/:id', async (req, res) => {
            const id = req.params.id;
            const addTask = req.body;
            const filter = { _id: ObjectId(id) }
            const options = { upsert: true }
            const updateDoc = {
                $set: addTask,
            }
            const result = await addTaskCollection.updateOne(filter, updateDoc, options)
            res.send(result)
        });







    }
    catch (err) {
        console.log(err);
    }
}

run().catch(err => console.log(err))



app.get('/', (req, res) => {
    res.send('To-do list server is running')
});

app.listen(port, () => {
    console.log('server listening on port', port);

})