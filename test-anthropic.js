const Anthropic = require('@anthropic-ai/sdk');
const path = require('path');
require('dotenv').config({ path: path.resolve(__dirname, '.env') });

/**
 * Simple test to verify Anthropic API integration
 */
async function testAnthropicConnection() {
  console.log('🔍 Testing Anthropic API Connection...\n');

  // Check if API key is loaded
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error('❌ ANTHROPIC_API_KEY not found in environment');
    process.exit(1);
  }

  console.log('✓ API Key loaded from .env');
  console.log(`✓ Key length: ${apiKey.length} characters\n`);

  try {
    // Initialize Anthropic client
    const client = new Anthropic({
      apiKey: apiKey,
    });

    console.log('🤖 Sending test request to Claude...');

    // Send a simple test message
    const response = await client.messages.create({
      model: 'claude-sonnet-4-20250514',
      max_tokens: 100,
      messages: [
        {
          role: 'user',
          content: 'Please respond with a simple message confirming you are working. Just say "AI integration is working!"'
        }
      ]
    });

    console.log('\n✅ SUCCESS! Anthropic AI is working!\n');
    console.log('📩 Response from Claude:');
    console.log('─'.repeat(50));
    console.log(response.content[0].text);
    console.log('─'.repeat(50));
    console.log(`\nModel: ${response.model}`);
    console.log(`Tokens used: ${response.usage.input_tokens} input, ${response.usage.output_tokens} output\n`);

    return true;
  } catch (error) {
    console.error('\n❌ FAILED! Anthropic API Error:\n');
    console.error('Error type:', error.constructor.name);
    console.error('Error message:', error.message);
    
    if (error.status) {
      console.error('HTTP Status:', error.status);
    }
    
    if (error.error?.message) {
      console.error('API Error:', error.error.message);
    }
    
    process.exit(1);
  }
}

// Run the test
testAnthropicConnection()
  .then(() => {
    console.log('✅ Anthropic integration test completed successfully!');
    process.exit(0);
  })
  .catch((error) => {
    console.error('❌ Test failed:', error);
    process.exit(1);
  });
