import fs from "fs";
import path from "path";

const [inputPath, usernameArgument, outputPathArgument] = process.argv.slice(2);

if (!inputPath || !usernameArgument) {
  console.error(
    "Usage: node flat-tweets-to-archive-json.js <input.json> <username> [output.json]",
  );
  process.exit(1);
}

const source = JSON.parse(fs.readFileSync(inputPath, "utf8"));
const username = usernameArgument.replace(/^@/, "").toLowerCase();
const outputPath =
  outputPathArgument || `../archives/${username}-combined.json`;
const rawTweets = getTweetArray(source);
const tweets = rawTweets.map(normalizeTweet).filter(Boolean);

if (tweets.length === 0) {
  console.error(
    "No tweets found. Expected an array or an object with tweets, data, results, or items.",
  );
  process.exit(1);
}

const archiveJson = {
  account: [
    {
      account: {
        accountId: getFirstValue(source, ["accountId", "userId"]) || username,
        username,
        accountDisplayName:
          getFirstValue(source, ["accountDisplayName", "name"]) || username,
      },
    },
  ],
  profile: [
    {
      profile: {
        avatarMediaUrl:
          getFirstValue(source, ["avatarMediaUrl", "avatarUrl"]) || "",
      },
    },
  ],
  tweets,
};

fs.mkdirSync(path.dirname(outputPath), { recursive: true });
fs.writeFileSync(outputPath, JSON.stringify(archiveJson, null, 2));
console.log(`Wrote ${tweets.length} tweets to ${outputPath}`);

function getTweetArray(value) {
  if (Array.isArray(value)) {
    return value;
  }

  for (const key of ["tweets", "data", "results", "items"]) {
    if (Array.isArray(value[key])) {
      return value[key];
    }
  }

  return [];
}

function normalizeTweet(value) {
  const tweet = value.tweet || value;
  const id = getTweetId(tweet);
  const fullText = getFirstValue(tweet, [
    "full_text",
    "fullText",
    "text",
    "content",
    "body",
  ]);

  if (!id || !fullText) {
    return null;
  }

  return {
    tweet: {
      id: String(id),
      full_text: String(fullText),
      created_at:
        getFirstValue(tweet, [
          "created_at",
          "createdAt",
          "date",
          "timestamp",
        ]) || new Date(0).toISOString(),
      favorite_count: String(
        getFirstValue(tweet, [
          "favorite_count",
          "favoriteCount",
          "like_count",
          "likeCount",
          "likes",
        ]) || 0,
      ),
      retweet_count: String(
        getFirstValue(tweet, [
          "retweet_count",
          "retweetCount",
          "repost_count",
          "repostCount",
          "retweets",
        ]) || 0,
      ),
      in_reply_to_user_id:
        getFirstValue(tweet, ["in_reply_to_user_id", "inReplyToUserId"]) ||
        null,
      in_reply_to_user_id_str:
        getFirstValue(tweet, [
          "in_reply_to_user_id_str",
          "inReplyToUserIdStr",
        ]) || null,
      in_reply_to_status_id:
        getFirstValue(tweet, ["in_reply_to_status_id", "inReplyToStatusId"]) ||
        null,
      entities: normalizeEntities(tweet.entities),
    },
  };
}

function getTweetId(tweet) {
  const id = getFirstValue(tweet, ["id", "id_str", "tweet_id", "tweetId"]);
  if (id) {
    return id;
  }

  const url = getFirstValue(tweet, ["url", "tweet_url", "tweetUrl"]);
  const match = typeof url === "string" ? url.match(/status\/(\d+)/) : null;
  return match ? match[1] : null;
}

function normalizeEntities(entities) {
  if (entities && Array.isArray(entities.user_mentions)) {
    return entities;
  }

  return { user_mentions: [] };
}

function getFirstValue(object, keys) {
  for (const key of keys) {
    if (object && object[key] != null && object[key] !== "") {
      return object[key];
    }
  }

  return null;
}
