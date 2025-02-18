import express from 'express';
import cors from 'cors';
import { ChromaClient } from 'chromadb'
const client = new ChromaClient();
const collection = await client.getOrCreateCollection({name: "tweets"});

const count = await collection.count()

const app = express();
const port = 3005;

app.use(express.json());
app.use(cors());

app.post('/query', async (req, res) => {
    const { searchTerm } = req.body;

    const { ids, documents, distances } = await collection.query({
        queryTexts: searchTerm,
        nResults: 20, 
    });

    const results = []

    for (let i = 0; i < documents[0].length; i++) {
        const text = documents[0][i]
        const tweetId = ids[0][i]
        const score = distances[0][i]

        results.push({ tweetId, score, text })    
    }
    
    res.json(results);
});

// Start server
app.listen(port, () => {
    console.log(`Found ${count} embedded items in Chroma`)
    console.log(`Server running at http://localhost:${port}`);
});