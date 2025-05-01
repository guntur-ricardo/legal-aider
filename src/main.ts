import { ChatGenerator } from './core/ChatGenerator';
import { ChatAnalyzer } from './core/ChatAnalyzer';
import { ReportGenerator } from './core/ReportGenerator';
import { config } from './config/config';

// If standing up the modular functions as endpoints,
//  this is where the server would start
async function main() {
    console.log('Legal Aider starting...');    
}

main().catch(console.error); 
