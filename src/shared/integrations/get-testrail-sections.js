/**
 * TestRail Section Helper
 * Lists all sections in a suite and helps create new ones
 */

require('dotenv').config();
const axios = require('axios');

class TestRailSectionHelper {
  constructor() {
    this.host = process.env.TESTRAIL_HOST;
    this.user = process.env.TESTRAIL_USER;
    this.apiKey = process.env.TESTRAIL_API_KEY;
    
    this.client = axios.create({
      baseURL: `${this.host}/index.php?/api/v2`,
      auth: {
        username: this.user,
        password: this.apiKey
      },
      headers: { 'Content-Type': 'application/json' }
    });
  }

  /**
   * Get all sections in a project/suite
   */
  async getSections(projectId, suiteId) {
    try {
      const url = suiteId 
        ? `/get_sections/${projectId}&suite_id=${suiteId}`
        : `/get_sections/${projectId}`;
        
      const response = await this.client.get(url);
      return response.data.sections || response.data;
    } catch (error) {
      console.error('❌ Failed to get sections:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Create a new section
   */
  async createSection(projectId, suiteId, name, description = '') {
    try {
      const payload = {
        name: name,
        description: description,
        suite_id: suiteId
      };

      const response = await this.client.post(
        `/add_section/${projectId}`,
        payload
      );

      console.log(`✅ Section created: ${response.data.id} - ${response.data.name}`);
      return response.data;
    } catch (error) {
      console.error('❌ Failed to create section:', error.response?.data || error.message);
      throw error;
    }
  }

  /**
   * Display sections in a readable format
   */
  displaySections(sections) {
    if (!sections || sections.length === 0) {
      console.log('   📭 No sections found in this suite\n');
      return;
    }

    console.log(`\n📁 Found ${sections.length} section(s):\n`);
    sections.forEach(section => {
      console.log(`   ID: ${section.id}`);
      console.log(`   Name: ${section.name}`);
      console.log(`   Suite ID: ${section.suite_id}`);
      if (section.description) {
        console.log(`   Description: ${section.description}`);
      }
      console.log(`   Depth: ${section.depth || 0}`);
      if (section.parent_id) {
        console.log(`   Parent ID: ${section.parent_id}`);
      }
      console.log('');
    });
  }
}

async function main() {
  console.log('\n🔍 TestRail Section Helper\n');
  
  const projectId = process.env.TESTRAIL_PROJECT_ID || process.argv[2];
  const suiteId = process.env.TESTRAIL_SUITE_ID || process.argv[3];
  const createNew = process.argv[4] === '--create';
  const newSectionName = process.argv[5];

  if (!projectId) {
    console.error('❌ Missing PROJECT_ID');
    console.log('\nUsage:');
    console.log('  node get-testrail-sections.js [PROJECT_ID] [SUITE_ID]');
    console.log('  node get-testrail-sections.js [PROJECT_ID] [SUITE_ID] --create "Section Name"');
    console.log('\nOr set in .env:');
    console.log('  TESTRAIL_PROJECT_ID=7');
    console.log('  TESTRAIL_SUITE_ID=14');
    console.log('\nThen run: node get-testrail-sections.js\n');
    return;
  }

  const helper = new TestRailSectionHelper();

  console.log('📋 Configuration:');
  console.log(`   Host: ${process.env.TESTRAIL_HOST}`);
  console.log(`   User: ${process.env.TESTRAIL_USER}`);
  console.log(`   Project ID: ${projectId}`);
  console.log(`   Suite ID: ${suiteId || 'Not specified'}`);

  try {
    if (createNew && newSectionName) {
      // Create a new section
      console.log(`\n➕ Creating new section: "${newSectionName}"...\n`);
      const newSection = await helper.createSection(projectId, suiteId, newSectionName, 'Created by Playwright AI Framework');
      
      console.log('✅ Section created successfully!');
      console.log(`\n💡 Add this to your .env file:`);
      console.log(`TESTRAIL_SECTION_ID=${newSection.id}\n`);
      
    } else {
      // List existing sections
      console.log('\n🔍 Fetching sections...\n');
      const sections = await helper.getSections(projectId, suiteId);
      helper.displaySections(sections);
      
      if (sections && sections.length > 0) {
        console.log('💡 To use a section, add this to your .env file:');
        console.log(`TESTRAIL_SECTION_ID=${sections[0].id}`);
        console.log('\nOr create a new section:');
        console.log(`node get-testrail-sections.js ${projectId} ${suiteId} --create "My Section"\n`);
      } else {
        console.log('💡 No sections found. Create one:');
        console.log(`node get-testrail-sections.js ${projectId} ${suiteId} --create "Automated Tests"\n`);
      }
    }

    // Show how to access in browser
    console.log('🌐 View in browser:');
    console.log(`   ${process.env.TESTRAIL_HOST}/index.php?/suites/view/${suiteId}`);
    console.log(`   ${process.env.TESTRAIL_HOST}/index.php?/projects/overview/${projectId}\n`);

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    
    if (error.response?.status === 401) {
      console.log('\n💡 Check your TestRail credentials in .env file');
    } else if (error.response?.status === 400) {
      console.log('\n💡 Make sure the Project ID and Suite ID are correct');
    }
    console.log('');
  }
}

main();
