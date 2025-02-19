import fs from 'fs'
import path from 'path'
import { Util } from '../frontend/src/util.js'
import { ChromaClient } from 'chromadb'
import { copyFile } from 'fs/promises';

const usernameArgument = (process.argv[2]).toLocaleLowerCase();

const client = new ChromaClient();
const collection = await client.getOrCreateCollection({name: usernameArgument });

const ARCHIVE_FILEPATH = `../archives/${usernameArgument}-combined.json`
const archive_basename = path.basename(ARCHIVE_FILEPATH, '.json')

const util = new Util()
const archiveJSON = JSON.parse(fs.readFileSync(ARCHIVE_FILEPATH).toString())
util.accountId = archiveJSON.account[0].account.accountId
util.username = archiveJSON.account[0].account.username
let tweets = util.preprocessTweets(archiveJSON.tweets)
tweets = util.sortAscending(tweets)

// const itemsToEmbed = getAllTweetsUnfiltered()
const itemsToEmbed = getCombinedThreads()

const sliceSize = 10

for (let i = 0; i < itemsToEmbed.length; i+= sliceSize) {
    console.log(`${i} / ${itemsToEmbed.length}`)
    const slice = itemsToEmbed.slice(i, i + sliceSize)
    const ids = slice.map(item => item.id)

    // Check if it's already in there
    const result = await collection.get({ ids, include: ["documents", "embeddings"] })
    console.log(result.documents)
    if (result.documents.length == slice.length) {
        continue
    }
    // If not, embed it
    await collection.add({
        ids: ids,
        documents: slice.map(item => item.text)
      });
}

// Copy the combined archive to the frontend
const sourcePath = `../archives/${usernameArgument}-combined.json`;
const destPath = '../frontend/public/archive-combined.json';
console.log(`Copying ${sourcePath} to ${destPath}`)
await copyFile(sourcePath, destPath);

function getCombinedThreads() {
    // Extracts the threads, each thread is one document
    const threadData = util.getThreads(tweets)
    const threads = []
    let wordCount = 0
    for (let i = 0; i < threadData.tweets.length; i++) {
        const tweet = threadData.tweets[i]
        if (tweet.parent) {
            continue
        }
        const newThread = [tweet]
        let currentTweet = tweet 
        while (currentTweet.nextTweet) {
            wordCount += currentTweet.full_text.split(' ').length
            newThread.push(currentTweet.nextTweet)
            currentTweet = currentTweet.nextTweet
        }
        threads.push(newThread)
    }
    console.log(`Found ${threads.length} threads. Total word count: ${wordCount}`)
    const itemsToEmbed = threads.map(thread => {
        let text = ''
        for (let tweet of thread) {
            text += tweet.full_text
        }

        return { text, id: thread[0].id }
    })

    return itemsToEmbed
}

function getAllTweetsUnfiltered() {
    // Just returns all tweets, including replies and retweets
    const itemsToEmbed = []
    for (let i = 0; i < tweets.length; i++) {
        const { full_text, id } =  tweets[i] 
        itemsToEmbed.push({ text: full_text, id })
    }

    return itemsToEmbed
}