import { execSync } from 'child_process';

const LEGAL_FOCI = ['commercial_contracts'];
const CHATS_PER_FOCUS = 10;

async function runDemo() {
  console.log('🚀 Starting Legal Aider Demo');
  
  // Step 1: Archive existing chats for each focus
  for (const focus of LEGAL_FOCI) {
    console.log(`\n📦 Archiving existing ${focus} chats...`);
    try {
      execSync(`npm run archive-chats ${focus}`, { stdio: 'inherit' });
    } catch (error) {
      console.log(`No existing chats to archive for ${focus}`);
    }
  }

  // Step 2: Generate new chats for each focus
  for (const focus of LEGAL_FOCI) {
    console.log(`\n💬 Generating ${CHATS_PER_FOCUS} ${focus} chats...`);
    execSync(`npm run generate-chat ${focus} ${CHATS_PER_FOCUS}`, { stdio: 'inherit' });
  }

  // Step 3: Analyze chats for each focus
  for (const focus of LEGAL_FOCI) {
    console.log(`\n🔍 Analyzing ${focus} chats...`);
    execSync(`npm run analyze-chats ${focus}`, { stdio: 'inherit' });
  }

  // Step 4: Generate email reports for each focus
  for (const focus of LEGAL_FOCI) {
    console.log(`\n📧 Generating email report for ${focus}...`);
    execSync(`npm run generate-email ${focus}`, { stdio: 'inherit' });
  }

  console.log('\n✨ Demo completed successfully!');
}

runDemo().catch((error) => {
  console.error('❌ Error during demo:', error);
  process.exit(1);
}); 