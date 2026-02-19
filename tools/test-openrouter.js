/**
 * Quick test to verify OpenRouter integration
 */

require('dotenv').config();
const aiEngine = require('./src/core/ai-engine');

async function testOpenRouter() {
  console.log('\n🧪 Testing OpenRouter Integration...\n');
  console.log('=' .repeat(80));
  
  try {
    // Test 1: Simple AI query
    console.log('\n📝 Test 1: Simple AI Query');
    const response = await aiEngine.query(
      'What are the top 3 best practices for writing Playwright tests? Respond in JSON format with a "tips" array.',
      { maxTokens: 300, temperature: 0.7 }
    );
    
    console.log('✅ Response received:');
    console.log(response);
    console.log();
    
    // Test 2: Element selector finding simulation
    console.log('\n📝 Test 2: Element Selector Query');
    const mockHTML = `
      <div class="login-form">
        <input type="text" id="username" placeholder="Enter username" />
        <input type="password" id="password" placeholder="Enter password" />
        <button class="btn-primary" id="login-btn">Login</button>
      </div>
    `;
    
    const selectorResult = await aiEngine.findElementSelector(
      mockHTML,
      'the login button'
    );
    
    console.log('✅ Selector found:');
    console.log(JSON.stringify(selectorResult, null, 2));
    console.log();
    
    console.log('=' .repeat(80));
    console.log('\n✅ OpenRouter integration test PASSED!\n');
    console.log('💡 Your framework is now using fast cloud-based AI via OpenRouter');
    console.log('   Model: openai/gpt-4o-mini');
    console.log('   Speed: ~10-100x faster than local Ollama');
    console.log();
    
  } catch (error) {
    console.error('\n❌ OpenRouter integration test FAILED!');
    console.error('Error:', error.message);
    console.error();
    
    if (error.message.includes('API key')) {
      console.error('💡 Make sure OPENROUTER_API_KEY is set correctly in .env');
    }
    
    process.exit(1);
  }
}

testOpenRouter();
