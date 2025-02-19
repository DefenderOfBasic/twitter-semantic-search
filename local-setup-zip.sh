username=$1
# This script expects a twitter zip file in `archives/<USERNAME>.zip`
# Assumes you have installed chroma (https://www.trychroma.com/)

# Unzip the archive and combine the tweets & account info 
# into one `archives/<USERNAME>-combined.json` file
cd generate-embeddings $username
pnpm install
pnpm convert-archive $username

# Run the Chroma server
chroma run & 
CHROMA_SERVER_PID=$! 
sleep 3

# Generate embeddings
pnpm local-embed $username

# Shut down Chroma server
kill $CHROMA_SERVER_PID

# Copy the combined archive to the frontend directory
cp "archives/${username}-combined.json" frontend/public/archive-combined.json
