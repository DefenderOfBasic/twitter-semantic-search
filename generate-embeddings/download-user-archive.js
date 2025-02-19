import { promises as fs } from 'fs';
import { existsSync } from 'fs';
import { join } from 'path';
import fetch from 'node-fetch';
import ProgressBar from 'progress';
import { fileURLToPath } from 'url';
import { dirname } from 'path';

// Get current file's directory (needed for ES modules)
const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const usernameArgument = process.argv[2];

async function downloadArchives() {
    // Create output directory if it doesn't exist
    const outputDir = join(__dirname, '../archives/');
    try {
        await fs.mkdir(outputDir, { recursive: true });
    } catch (err) {
        if (err.code !== 'EEXIST') throw err;
    }

    const total = 1
    
    // Setup progress bar
    const bar = new ProgressBar('Downloading [:bar] :current/:total :percent :etas :username', {
        complete: '=',
        incomplete: ' ',
        width: 30,
        total
    });

    const username = usernameArgument.toLowerCase()
    const outputFile = join(outputDir, `${username}-combined.json`);

    try {
        const url = `https://fabxmporizzqflnftavs.supabase.co/storage/v1/object/public/archives/${username}/archive.json`
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const content = await response.text();
        await fs.writeFile(outputFile, content);
        bar.tick({ username });
    } catch (error) {
        console.error(`\nError downloading ${username}: ${error.message}`);
        bar.tick({ username: `${username} (error)` });
    }

    console.log('\nDownload complete!');
}

if (usernameArgument == null) {
    console.error("\n\nMissing username argument\n\n")
} else {
    downloadArchives().catch(console.error);
}


