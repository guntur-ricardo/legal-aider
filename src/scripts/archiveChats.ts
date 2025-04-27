import * as fs from 'fs';
import * as path from 'path';
import { ChatStorage } from '../chatStorage/ChatStorage';

async function main() {
    const focus = process.argv[2] as 'commercial_contracts' | 'privacy';
    if (!focus || !['commercial_contracts', 'privacy'].includes(focus)) {
        console.error('Error: Please provide a valid legal focus (commercial_contracts or privacy)');
        process.exit(1);
    }

    const storagePath = path.join(__dirname, '../chatStorage/legalChats.json');
    const archivePath = path.join(__dirname, '../chatStorage/archivedLegalChats.json');

    try {
        // Read current chats
        const currentData = await fs.promises.readFile(storagePath, 'utf-8');
        const currentChats = JSON.parse(currentData);

        // Read or initialize archive
        let archivedChats;
        try {
            const archiveData = await fs.promises.readFile(archivePath, 'utf-8');
            archivedChats = JSON.parse(archiveData);
        } catch {
            archivedChats = {
                commercial_contracts: { chats: [], lastUpdated: null },
                privacy: { chats: [], lastUpdated: null }
            };
        }

        // Move chats to archive
        archivedChats[focus].chats.push(...currentChats[focus].chats);
        archivedChats[focus].lastUpdated = new Date().toISOString();

        // Clear current chats for the focus
        currentChats[focus].chats = [];
        currentChats[focus].lastUpdated = null;

        // Save both files
        await fs.promises.writeFile(storagePath, JSON.stringify(currentChats, null, 2));
        await fs.promises.writeFile(archivePath, JSON.stringify(archivedChats, null, 2));

        console.log(`Successfully archived and cleared ${focus} chats`);
    } catch (error) {
        console.error('Error:', error);
        process.exit(1);
    }
}

main(); 