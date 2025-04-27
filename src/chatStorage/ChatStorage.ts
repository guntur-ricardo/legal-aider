import { Chat } from '../models/Chat';
import * as fs from 'fs';
import * as path from 'path';

interface LegalChats {
    commercial_contracts: {
        chats: Chat[];
        lastUpdated: string | null;
    };
    privacy: {
        chats: Chat[];
        lastUpdated: string | null;
    };
}

export class ChatStorage {
    private static readonly STORAGE_PATH = path.join(__dirname, 'legalChats.json');

    static async saveChat(chat: Chat): Promise<void> {
        const chats = await this.loadChats();
        const focus = chat.legalFocus as keyof LegalChats;
        
        chats[focus].chats.push(chat);
        chats[focus].lastUpdated = new Date().toISOString();
        
        await fs.promises.writeFile(
            this.STORAGE_PATH,
            JSON.stringify(chats, null, 2)
        );
    }

    static async loadChats(): Promise<LegalChats> {
        try {
            const data = await fs.promises.readFile(this.STORAGE_PATH, 'utf-8');
            return JSON.parse(data);
        } catch (error) {
            // If file doesn't exist or is empty, return default structure
            return {
                commercial_contracts: {
                    chats: [],
                    lastUpdated: null
                },
                privacy: {
                    chats: [],
                    lastUpdated: null
                }
            };
        }
    }

    static async getChatsByFocus(focus: keyof LegalChats): Promise<Chat[]> {
        const chats = await this.loadChats();
        return chats[focus].chats;
    }
} 