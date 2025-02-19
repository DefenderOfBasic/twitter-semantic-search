# Twitter Semantic Search

Basic semantic search for a tweet archive. Part of the [Community Archive](https://www.community-archive.org/) ecosystem.

Live demo: https://defenderofbasic.github.io/twitter-semantic-search/

## Local setup

1. Put your twitter archive in `archives/YOUR_USERNAME.zip`
2. Install [Chroma](https://www.trychroma.com/) for vector embedding & storage, should just be `pip install chroma`
3. Run the setup script with your username (will run a chroma server and generate the local embeddings)

```
./local-setup-zip.sh YOUR_USERNAME
```

4. Run the frontend

```
cd frontend/
pnpm install
pnpm dev
```

Open http://localhost:3000/search-local.html

To run the local embedding & search on an archive JSON downloaded from the community archive, instead of a raw zip file, you can do the steps that the `local-setup-zip.sh` performs but manually:

1. Run the Chroma server `chroma run`
2. Put the JSON in `archives/USERNAME-combined.json`
3. Run the embedding script

```
cd generate-embeddings
pnpm install
pnpm local-embed USERNAME
```

Then run the frontend with `pnpm dev` in `frontend/`.

## Self host this for your own tweet archive

The general steps are, create & deploy the CloudFlare worker + vector DB (see instructions in `cloudflare-worker/` directory). Then generate embeddings (run the script in `generate-embeddings/` with your archive JSON in `archives/`). Finally run the `frontend/` and replace the [cloudflare URL](https://github.com/DefenderOfBasic/twitter-semantic-search/blob/main/frontend/index.html#L71-L73) with your own, and a URL where the archive JSON is hosted. 

