const { test } = require('../../core/ai-test-runner');
const testAgents = require('../../core/test-agents');
const fs = require('fs');
const path = require('path');

/**
 * 🎯 Plan to Executable Code Converter
 * This script converts test plans into executable automation scripts
 */

test.describe('📝 Convert Plan to Executable Code', () => {
  
  test('Quick: Generate executable code from description', async () => {
    test.setTimeout(180000); // 3 minutes for AI operations
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🎯 INSTANT CODE GENERATOR');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Direct conversion: Description → Executable Code
    const testDescription = 'Navigate to saucedemo.com and verify page title is visible';
    
    console.log('📝 Input:');
    console.log(`   "${testDescription}"\n`);
    console.log('⚙️  Generating executable code...');
    console.log('   (This may take 30-90 seconds with local LLM)\n');
    
    const generated = await testAgents.generateTest(testDescription, {
      framework: 'playwright',
      language: 'javascript',
      useAIPage: true,
      includeComments: true,
      filename: 'saucedemo-title-verification.spec.js'
    });
    
    // Display the generated code
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ GENERATED EXECUTABLE CODE');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log(`📄 Filename: ${generated.filename}`);
    console.log(`📦 Dependencies: ${generated.dependencies?.join(', ') || 'playwright'}`);
    console.log(`📝 Description: ${generated.description || 'Generated test'}\n`);
    
    console.log('━━━━ GENERATED CODE ━━━━━\n');
    console.log(generated.code || generated.text);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Save to file
    const outputDir = path.join(__dirname, '../../test-results/agents/generated');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, generated.filename);
    fs.writeFileSync(outputPath, generated.code || generated.text, 'utf8');
    
    console.log(`💾 Code saved to: ${outputPath}`);
    console.log('\n✅ Text → Executable Code in one step!\n');
  });

  test('Create new plan and generate code in one go', async () => {
    test.setTimeout(240000); // 4 minutes for AI operations
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('🚀 PLAN + GENERATE WORKFLOW');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Step 1: Create a new test plan
    const testDescription = 'Login to saucedemo.com with standard_user and verify successful login';
    
    console.log('📝 Creating test plan...');
    console.log(`   Description: ${testDescription}\n`);
    
    const plan = await testAgents.planTest(testDescription, {
      detailLevel: 'detailed',
      includeAssertions: true
    });
    
    console.log('✅ Plan created:');
    console.log(`   Test Name: ${plan.testName}`);
    console.log(`   Steps: ${plan.steps?.length || 'N/A'}`);
    
    // Step 2: Generate code from the plan
    console.log('\n⚙️  Generating executable code...\n');
    
    const generated = await testAgents.generateTest(plan, {
      framework: 'playwright',
      language: 'javascript',
      useAIPage: true,
      includeComments: true,
      filename: 'saucedemo-login.spec.js'
    });
    
    // Step 3: Display the result
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('✅ COMPLETE WORKFLOW RESULT');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    console.log(`📄 Filename: ${generated.filename}\n`);
    console.log('━━━━ GENERATED CODE ━━━━━\n');
    console.log(generated.code || generated.text);
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Save the code
    const outputDir = path.join(__dirname, '../../test-results/agents/generated');
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }
    
    const outputPath = path.join(outputDir, generated.filename);
    fs.writeFileSync(outputPath, generated.code || generated.text, 'utf8');
    
    console.log(`💾 Code saved to: ${outputPath}`);
    console.log('\n✅ Complete workflow: Plan → Generate → Save!\n');
  });

  test('Batch convert multiple plans to code', async () => {
    test.setTimeout(360000); // 6 minutes for AI operations
    
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📦 BATCH PLAN TO CODE CONVERTER');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    // Load all saved plans
    const plansDir = path.join(__dirname, '../../test-results/agents/plans');
    const planFiles = fs.readdirSync(plansDir).filter(f => f.endsWith('.json'));
    
    console.log(`📋 Found ${planFiles.length} saved plans\n`);
    
    const results = [];
    
    for (const planFile of planFiles) {
      console.log(`━━━━ Processing: ${planFile} ━━━━`);
      
      const planPath = path.join(plansDir, planFile);
      const plan = JSON.parse(fs.readFileSync(planPath, 'utf8'));
      
      console.log(`   Test: ${plan.testName || 'Unnamed'}`);
      console.log(`   Generating code...`);
      
      const generated = await testAgents.generateTest(plan, {
        framework: 'playwright',
        language: 'javascript',
        useAIPage: true,
        filename: `generated-${planFile.replace('.json', '.spec.js')}`
      });
      
      // Save the generated code
      const outputDir = path.join(__dirname, '../../test-results/agents/generated');
      if (!fs.existsSync(outputDir)) {
        fs.mkdirSync(outputDir, { recursive: true });
      }
      
      const outputPath = path.join(outputDir, generated.filename);
      fs.writeFileSync(outputPath, generated.code || generated.text, 'utf8');
      
      results.push({
        planFile,
        generatedFile: generated.filename,
        outputPath
      });
      
      console.log(`   ✅ Saved: ${generated.filename}\n`);
    }
    
    // Summary
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
    console.log('📊 BATCH CONVERSION SUMMARY');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    
    results.forEach((result, i) => {
      console.log(`${i + 1}. ${result.planFile} → ${result.generatedFile}`);
    });
    
    console.log(`\n✅ Successfully converted ${results.length} plans to executable code!\n`);
  });
});
