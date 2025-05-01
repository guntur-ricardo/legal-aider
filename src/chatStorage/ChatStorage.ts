import { Chat } from '../models/Chat';
import * as fs from 'fs/promises';
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
    private static readonly STORAGE_PATH = path.join(__dirname, '..', '..', 'src', 'chatStorage');

    constructor() {}

    static async saveChat(chat: Chat): Promise<void> {
        const chats = await this.loadChats();
        const focus = chat.legalFocus as keyof LegalChats;
        
        chats[focus].chats.push(chat);
        chats[focus].lastUpdated = new Date().toISOString();
        
        await fs.writeFile(
            path.join(this.STORAGE_PATH, 'legalChats.json'),
            JSON.stringify(chats, null, 2),
            'utf-8'
        );
    }

    static async loadChats(): Promise<LegalChats> {
        try {
            const data = await fs.readFile(path.join(this.STORAGE_PATH, 'legalChats.json'), 'utf-8');
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

    async loadChats(focus: 'commercial_contracts' | 'privacy'): Promise<Chat[]> {
        const filePath = this.getFilePath(focus);
        console.log(`Attempting to load chats from: ${filePath}`);
        
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            const legalChats = JSON.parse(data);
            const chats = legalChats[focus]?.chats || [];
            console.log(`Loading chats`);
            return chats;
        } catch (error) {
            if ((error as NodeJS.ErrnoException).code === 'ENOENT') {
                console.log(`No chat file found at ${filePath}`);
                return [];
            }
            console.error('Error loading chats:', error);
            throw error;
        }
    }

    async updateChat(focus: 'commercial_contracts' | 'privacy', chatId: string, updateData: Partial<Chat>): Promise<void> {
        const chats = await this.loadChats(focus);
        const chatIndex = chats.findIndex(chat => chat.id === chatId);
        
        if (chatIndex === -1) {
            throw new Error(`Chat with ID ${chatId} not found`);
        }
        
        // Update the chat with new data
        chats[chatIndex] = {
            ...chats[chatIndex],
            ...updateData
        };
        
        // Save the updated chats
        await this.saveChats(focus, chats);
    }

    private getFilePath(focus: 'commercial_contracts' | 'privacy'): string {
        return path.join(ChatStorage.STORAGE_PATH, 'legalChats.json');
    }

    private async saveChats(focus: 'commercial_contracts' | 'privacy', chats: Chat[]): Promise<void> {
        const filePath = this.getFilePath(focus);
        
        // Load the entire file first to maintain structure
        let legalChats: LegalChats;
        try {
            const data = await fs.readFile(filePath, 'utf-8');
            legalChats = JSON.parse(data);
        } catch (error) {
            // If file doesn't exist or is empty, initialize with default structure
            legalChats = {
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
        
        // Update only the specific focus's chats
        legalChats[focus].chats = chats;
        legalChats[focus].lastUpdated = new Date().toISOString();
        
        // Save the entire structure back to file
        await fs.writeFile(filePath, JSON.stringify(legalChats, null, 2), 'utf-8');
    }
} 