import React, { useState } from 'react';
import './WorkflowUI.css';
import StepProgress from './StepProgress';
import LogViewer from './LogViewer';

const WorkflowUI = () => {
  const [mode, setMode] = useState('jira-id'); // 'jira-id' or 'plain-english'
  const [storyId, setStoryId] = useState('');
  const [plainEnglish, setPlainEnglish] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState(null);

  const steps = [
    { id: 1, name: 'Fetch/Create Story', icon: '📋' },
    { id: 2, name: 'Generate Test Cases', icon: '🤖' },
    { id: 3, name: 'Push to TestRail', icon: '📊' },
    { id: 4, name: 'Generate Test Scripts', icon: '⚙️' },
    { id: 5, name: 'Execute Tests', icon: '🚀' },
    { id: 6, name: 'Update Results', icon: '✅' }
  ];

  const addLog = (message, type = 'info') => {
    const timestamp = new Date().toLocaleTimeString();
    setLogs(prev => [...prev, { timestamp, message, type }]);
  };

  const runWorkflow = async () => {
    // Validate input based on mode
    if (mode === 'jira-id' && !storyId.trim()) {
      addLog('Please enter a valid Story ID', 'error');
      return;
    }
    if (mode === 'plain-english' && !plainEnglish.trim()) {
      addLog('Please enter your requirements', 'error');
      return;
    }

    setIsRunning(true);
    setCurrentStep(0);
    setLogs([]);
    setResults(null);

    let actualStoryId = storyId;

    try {
      // Step 0: Create Jira Story (if in plain-english mode)
      if (mode === 'plain-english') {
        setCurrentStep(1);
        addLog('Creating Jira story from your requirements...', 'info');
        
        const createResponse = await fetch('http://localhost:3001/api/workflow/create-story', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requirements: plainEnglish })
        });
        const createData = await createResponse.json();
        
        if (!createData.success) {
          throw new Error(createData.error || 'Failed to create Jira story');
        }
        
        actualStoryId = createData.storyId;
        addLog(`✓ Created Jira story: ${actualStoryId}`, 'success');
        addLog(`📋 Jira: ${createData.story.url}`, 'info');
        addLog(`   Title: ${createData.story.title}`, 'info');
        addLog(`   Status: ${createData.story.status}`, 'info');
      }

      // Step 1: Fetch Jira Story
      setCurrentStep(1);
      addLog(mode === 'plain-english' ? 'Fetching created story details...' : 'Fetching user story from Jira...', 'info');
      const jiraResponse = await fetch('http://localhost:3001/api/workflow/fetch-jira', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId: actualStoryId })
      });
      const jiraData = await jiraResponse.json();
      addLog(`✓ Fetched: ${jiraData.story.title}`, 'success');
      addLog(`📋 Jira: ${jiraData.jiraUrl}`, 'info');
      addLog(`Acceptance Criteria: ${jiraData.story.acceptanceCriteria?.length || 0} items`, 'info');

      // Step 2: Generate Test Cases
      setCurrentStep(2);
      addLog('AI generating test cases...', 'info');
      const testCasesResponse = await fetch('http://localhost:3001/api/workflow/generate-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story: jiraData.story })
      });
      const testCasesData = await testCasesResponse.json();
      addLog(`✓ Generated ${testCasesData.testCases.length} test cases`, 'success');

      // Step 3: Push to TestRail
      setCurrentStep(3);
      addLog('Syncing test cases to TestRail...', 'info');
      const testrailResponse = await fetch('http://localhost:3001/api/workflow/push-testrail', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testCases: testCasesData.testCases, storyId: actualStoryId })
      });
      const testrailData = await testrailResponse.json();
      addLog(`✓ TestRail: ${testrailData.created} created, ${testrailData.updated} updated`, 'success');
      
      // Show detailed test case information
      if (testrailData.createdCases && testrailData.createdCases.length > 0) {
        addLog(`   Created test cases:`, 'info');
        testrailData.createdCases.forEach((tc, idx) => {
          addLog(`     ${idx + 1}. ${tc.title}`, 'info');
        });
      }
      
      if (testrailData.updatedCases && testrailData.updatedCases.length > 0) {
        addLog(`   Updated test cases:`, 'info');
        testrailData.updatedCases.forEach((tc, idx) => {
          addLog(`     ${idx + 1}. C${tc.id} - ${tc.title}`, 'info');
        });
      }
      
      addLog(`📊 TestRail: ${testrailData.testrailUrl}`, 'info');

      // Step 4: Generate Test Scripts
      setCurrentStep(4);
      addLog('Generating Playwright test scripts...', 'info');
      const scriptsResponse = await fetch('http://localhost:3001/api/workflow/generate-scripts', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testCases: testCasesData.testCases, storyId: actualStoryId })
      });
      const scriptsData = await scriptsResponse.json();
      addLog(`✓ Generated test script: ${scriptsData.filename}`, 'success');

      // Step 5: Execute Tests
      setCurrentStep(5);
      addLog('Executing Playwright tests with self-healing...', 'info');
      const executionResponse = await fetch('http://localhost:3001/api/workflow/execute-tests', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          filename: scriptsData.filename,
          testCases: testCasesData.testCases,
          storyId: actualStoryId
        })
      });
      const executionData = await executionResponse.json();
      
      // Show detailed execution results
      if (executionData.testResults && executionData.testResults.length > 0) {
        addLog(`   Test Results:`, 'info');
        executionData.testResults.forEach((test, idx) => {
          const icon = test.status === 'passed' ? '✓' : '✗';
          const logType = test.status === 'passed' ? 'success' : 'error';
          addLog(`     ${icon} ${test.title} (${test.duration}ms)`, logType);
        });
      }
      
      // Show healing status if applied
      if (executionData.healingApplied && executionData.healingDetails) {
        const details = executionData.healingDetails;
        addLog(`🔧 Self-healing applied after attempt ${executionData.attempts - 1}`, 'warning');
        
        if (details.errorAnalysis) {
          addLog(`   Error Analysis:`, 'warning');
          const analysis = details.errorAnalysis;
          if (analysis.strictModeViolations > 0) {
            addLog(`     - Strict mode violations: ${analysis.strictModeViolations}`, 'warning');
          }
          if (analysis.selectorIssues > 0) {
            addLog(`     - Selector issues: ${analysis.selectorIssues}`, 'warning');
          }
          if (analysis.navigationIssues) {
            addLog(`     - Navigation timeout detected`, 'warning');
          }
          if (analysis.cssIssues > 0) {
            addLog(`     - CSS assertion issues: ${analysis.cssIssues}`, 'warning');
          }
          if (analysis.textMismatches > 0) {
            addLog(`     - Text mismatch issues: ${analysis.textMismatches}`, 'warning');
          }
        }
        
        if (details.fixesApplied && details.fixesApplied.length > 0) {
          addLog(`   Fixes Applied:`, 'success');
          details.fixesApplied.forEach(fix => {
            addLog(`     ✓ ${fix}`, 'success');
          });
        }
        
        addLog(`   Agent: ${details.agentUsed} (MCP: ${details.mcpEnabled ? 'enabled' : 'disabled'})`, 'info');
      }
      
      if (executionData.attempts > 1) {
        addLog(`♻️ Test execution took ${executionData.attempts} attempt(s)`, 'info');
      }
      
      addLog(`✓ Tests completed: ${executionData.passed}/${executionData.total} passed`, 'success');

      // Step 6: Update Results
      setCurrentStep(6);
      addLog('Updating results in Jira...', 'info');
      const updateResponse = await fetch('http://localhost:3001/api/workflow/update-results', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          storyId: actualStoryId, 
          results: executionData 
        })
      });
      const updateData = await updateResponse.json();
      addLog(`✓ Results posted to Jira ticket ${actualStoryId}`, 'success');

      // Store final results
      setResults({
        storyId: actualStoryId,
        testCases: testCasesData.testCases.length,
        passed: executionData.passed,
        failed: executionData.failed,
        duration: executionData.duration,
        testrailCreated: testrailData.created,
        testrailUpdated: testrailData.updated,
        healingApplied: executionData.healingApplied || false,
        attempts: executionData.attempts || 1
      });

      addLog('🎉 Workflow completed successfully!', 'success');
    } catch (error) {
      addLog(`❌ Error: ${error.message}`, 'error');
      console.error('Workflow error:', error);
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="workflow-container">
      <div className="input-section">
        {/* Mode Selector */}
        <div className="mode-selector">
          <button 
            className={`mode-button ${mode === 'jira-id' ? 'active' : ''}`}
            onClick={() => setMode('jira-id')}
            disabled={isRunning}
          >
            📋 Use Jira ID
          </button>
          <button 
            className={`mode-button ${mode === 'plain-english' ? 'active' : ''}`}
            onClick={() => setMode('plain-english')}
            disabled={isRunning}
          >
            ✍️ Write Requirements
          </button>
        </div>

        {/* Mode 1: Jira ID Input */}
        {mode === 'jira-id' && (
          <div className="input-group">
            <label htmlFor="storyId">Jira Story ID</label>
            <input
              id="storyId"
              type="text"
              placeholder="e.g., ED-2, PROJ-123"
              value={storyId}
              onChange={(e) => setStoryId(e.target.value)}
              disabled={isRunning}
              onKeyPress={(e) => e.key === 'Enter' && !isRunning && runWorkflow()}
            />
          </div>
        )}

        {/* Mode 2: Plain English Input */}
        {mode === 'plain-english' && (
          <div className="input-group">
            <label htmlFor="plainEnglish">Describe Your Requirements or Scenario</label>
            <textarea
              id="plainEnglish"
              placeholder={`Example:

As a user, I want to see a headline 'Your hidden advantage in RTSM' on the homepage.

Acceptance Criteria:
- The headline should be visible without scrolling
- It should display on desktop, tablet, and mobile
- The text should be clear and prominent`}
              value={plainEnglish}
              onChange={(e) => setPlainEnglish(e.target.value)}
              disabled={isRunning}
              rows={8}
            />
          </div>
        )}

        <button 
          className="run-button" 
          onClick={runWorkflow}
          disabled={isRunning || (mode === 'jira-id' ? !storyId.trim() : !plainEnglish.trim())}
        >
          {isRunning ? '⏳ Running...' : (mode === 'plain-english' ? '🚀 Create Story & Run Tests' : '🚀 Run Workflow')}
        </button>
      </div>

      <StepProgress steps={steps} currentStep={currentStep} />

      {results && (
        <div className="results-summary">
          <h3>📊 Workflow Results</h3>
          <div className="results-grid">
            <div className="result-item">
              <span className="result-label">Story ID:</span>
              <span className="result-value">{results.storyId}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Test Cases Generated:</span>
              <span className="result-value">{results.testCases}</span>
            </div>
            <div className="result-item">
              <span className="result-label">TestRail Created:</span>
              <span className="result-value">{results.testrailCreated}</span>
            </div>
            <div className="result-item">
              <span className="result-label">TestRail Updated:</span>
              <span className="result-value">{results.testrailUpdated}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Tests Passed:</span>
              <span className="result-value success">{results.passed}/{results.passed + results.failed}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Duration:</span>
              <span className="result-value">{results.duration}s</span>
            </div>
            {results.healingApplied && (
              <div className="result-item">
                <span className="result-label">Self-Healing:</span>
                <span className="result-value warning">Applied ({results.attempts} attempts)</span>
              </div>
            )}
          </div>
        </div>
      )}

      <LogViewer logs={logs} />
    </div>
  );
};

export default WorkflowUI;
