import React, { useState, useEffect, useRef } from 'react';
import './WorkflowUI.css';
import StepProgress from './StepProgress';
import LogViewer from './LogViewer';

// Backend API URLs
const BACKEND_OPTIONS = {
  cloud: 'https://ai-assisted-playwright-automation-framework-production.up.railway.app',
  local: 'http://localhost:3001'
};
const DEFAULT_BROWNFIELD_URL = 'https://ecomm-frontend-dvcdhygrandkdyhm.eastus-01.azurewebsites.net/';

const WorkflowUI = () => {
  // Load backend preference from localStorage, default to cloud
  const [backendType, setBackendType] = useState(() => {
    return localStorage.getItem('backendType') || 'cloud';
  });
  
  const [mode, setMode] = useState('jira-id'); // 'jira-id' or 'plain-english'
  const [storyId, setStoryId] = useState('');
  const [plainEnglish, setPlainEnglish] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);
  const [logs, setLogs] = useState([]);
  const [results, setResults] = useState(null);
  const [backendStatus, setBackendStatus] = useState('unknown'); // 'connected', 'disconnected', 'unknown'
  const [elapsedTime, setElapsedTime] = useState(0);
  const [projectContext, setProjectContext] = useState({
    targetUrl: DEFAULT_BROWNFIELD_URL,
    projectPrompt: '',
    applicationKnowledge: '',
    frameworkKnowledge: '',
    domainKnowledge: '',
    jiraStoryIds: '',
    wikiLinks: '',
    additionalContext: '',
    documents: []
  });
  const [documentUploadError, setDocumentUploadError] = useState('');
  const workflowStartTime = useRef(null);
  const timerInterval = useRef(null);
  
  // Get current API URL based on selection
  const API_BASE_URL = BACKEND_OPTIONS[backendType];
  
  // Save backend preference to localStorage whenever it changes
  useEffect(() => {
    localStorage.setItem('backendType', backendType);
    setBackendStatus('unknown'); // Reset status when switching
    addLog(`Switched to ${backendType === 'cloud' ? 'Cloud' : 'Local'} backend: ${API_BASE_URL}`, 'info');
  }, [backendType]);

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

  const handleContextChange = (field, value) => {
    setProjectContext(prev => ({ ...prev, [field]: value }));
  };

  const parseMultiLineInput = (value) => {
    if (!value) return [];
    return value
      .split(/[,\n]/)
      .map(item => item.trim())
      .filter(Boolean);
  };

  const getProjectContextPayload = () => ({
    targetUrl: projectContext.targetUrl || DEFAULT_BROWNFIELD_URL,
    projectPrompt: projectContext.projectPrompt,
    applicationKnowledge: projectContext.applicationKnowledge,
    frameworkKnowledge: projectContext.frameworkKnowledge,
    domainKnowledge: projectContext.domainKnowledge,
    jiraStoryIds: parseMultiLineInput(projectContext.jiraStoryIds),
    wikiLinks: parseMultiLineInput(projectContext.wikiLinks),
    additionalContext: projectContext.additionalContext,
    documents: projectContext.documents
  });

  const handleDocumentUpload = async (event) => {
    setDocumentUploadError('');
    const files = Array.from(event.target.files || []);
    if (files.length === 0) return;

    try {
      const docs = await Promise.all(
        files.slice(0, 5).map(async (file) => ({
          name: file.name,
          content: (await file.text()).slice(0, 12000)
        }))
      );

      setProjectContext(prev => ({
        ...prev,
        documents: [...prev.documents, ...docs].slice(0, 5)
      }));
    } catch (error) {
      setDocumentUploadError('Could not read one or more files. Please upload text-based files.');
    } finally {
      event.target.value = '';
    }
  };

  const removeDocument = (docName) => {
    setProjectContext(prev => ({
      ...prev,
      documents: prev.documents.filter(doc => doc.name !== docName)
    }));
  };

  // Check backend connectivity
  const checkBackend = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/api/health`, { 
        method: 'GET',
        signal: AbortSignal.timeout(5000) // 5 second timeout
      });
      if (response.ok) {
        setBackendStatus('connected');
        return true;
      }
      setBackendStatus('disconnected');
      return false;
    } catch (error) {
      setBackendStatus('disconnected');
      return false;
    }
  };

  const runWorkflow = async () => {
    const contextPayload = getProjectContextPayload();

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
    setElapsedTime(0);
    workflowStartTime.current = Date.now();
    // Start live timer
    timerInterval.current = setInterval(() => {
      setElapsedTime(Math.floor((Date.now() - workflowStartTime.current) / 1000));
    }, 1000);

    // Check backend connectivity first
    addLog('Connecting to backend API...', 'info');
    addLog(`Target app: ${contextPayload.targetUrl}`, 'info');
    if (contextPayload.documents.length > 0) {
      addLog(`Context docs attached: ${contextPayload.documents.length}`, 'info');
    }
    const isBackendAvailable = await checkBackend();
    
    if (!isBackendAvailable) {
      addLog('❌ Cannot connect to backend API', 'error');
      addLog(`   API URL: ${API_BASE_URL}`, 'error');
      addLog('   ', 'error');
      addLog('   ⚠️ Backend API is not running or not accessible', 'warning');
      addLog('   ', 'warning');
      if (API_BASE_URL.includes('localhost')) {
        addLog('   💡 For local development:', 'info');
        addLog('      1. Open a terminal', 'info');
        addLog('      2. cd server', 'info');
        addLog('      3. node workflow-api.js', 'info');
      } else {
        addLog('   💡 The backend API needs to be deployed separately', 'info');
        addLog('      GitHub Pages only hosts the frontend (static files)', 'info');
        addLog('      Deploy backend to: Azure, AWS, Heroku, Railway, etc.', 'info');
        addLog('      See DEPLOYMENT_FIX.md for details', 'info');
      }
      if (timerInterval.current) clearInterval(timerInterval.current);
      setIsRunning(false);
      return;
    }

    addLog('✓ Connected to backend API', 'success');

    let actualStoryId = storyId;

    try {
      // Step 0: Create Jira Story (if in plain-english mode)
      if (mode === 'plain-english') {
        setCurrentStep(1);
        addLog('Creating Jira story from your requirements...', 'info');
        
        const createResponse = await fetch(`${API_BASE_URL}/api/workflow/create-story`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ requirements: plainEnglish, projectContext: contextPayload })
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
      const jiraResponse = await fetch(`${API_BASE_URL}/api/workflow/fetch-jira`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ storyId: actualStoryId, projectContext: contextPayload })
      });
      const jiraData = await jiraResponse.json();
      addLog(`✓ Fetched: ${jiraData.story.title}`, 'success');
      addLog(`📋 Jira: ${jiraData.jiraUrl}`, 'info');
      addLog(`Acceptance Criteria: ${jiraData.story.acceptanceCriteria?.length || 0} items`, 'info');

      // Step 2: Generate Test Cases
      setCurrentStep(2);
      addLog('AI generating test cases...', 'info');
      const testCasesResponse = await fetch(`${API_BASE_URL}/api/workflow/generate-tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ story: jiraData.story, projectContext: contextPayload })
      });
      const testCasesData = await testCasesResponse.json();
      addLog(`✓ Generated ${testCasesData.testCases.length} test cases`, 'success');

      // Step 3: Push to TestRail
      setCurrentStep(3);
      addLog('Syncing test cases to TestRail...', 'info');
      const testrailResponse = await fetch(`${API_BASE_URL}/api/workflow/push-testrail`, {
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
      const scriptsResponse = await fetch(`${API_BASE_URL}/api/workflow/generate-scripts`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ testCases: testCasesData.testCases, storyId: actualStoryId, story: jiraData.story, projectContext: contextPayload })
      });
      const scriptsData = await scriptsResponse.json();
      addLog(`✓ Generated test script: ${scriptsData.filename}`, 'success');

      // Step 5: Execute Tests
      setCurrentStep(5);
      addLog('Executing Playwright tests with self-healing...', 'info');
      const executionResponse = await fetch(`${API_BASE_URL}/api/workflow/execute-tests`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          filename: scriptsData.filename,
          testCases: testCasesData.testCases,
          storyId: actualStoryId,
          story: jiraData.story,
          projectContext: contextPayload
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
      
      // Show video links if available (right after test results)
      if (executionData.videos && executionData.videos.length > 0) {
        addLog('', 'info'); // Empty line for spacing
        addLog('📹 Test Execution Videos (click to open):', 'info');
        executionData.videos.forEach(videoPath => {
          // Convert file path to clickable URL
          const videoUrl = `${API_BASE_URL}/${videoPath}`;
          addLog(`   🎬 ${videoUrl}`, 'info');
        });
        addLog('', 'info'); // Empty line for spacing
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
      const updateResponse = await fetch(`${API_BASE_URL}/api/workflow/update-results`, {
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
      const totalWorkflowTime = ((Date.now() - workflowStartTime.current) / 1000).toFixed(1);
      addLog(`⏱️ Total workflow time: ${Math.floor(totalWorkflowTime / 60)}m ${Math.round(totalWorkflowTime % 60)}s`, 'info');
      setResults({
        storyId: actualStoryId,
        testCases: testCasesData.testCases.length,
        passed: executionData.passed,
        failed: executionData.failed,
        duration: executionData.duration,
        totalDuration: totalWorkflowTime,
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
      if (timerInterval.current) clearInterval(timerInterval.current);
      setIsRunning(false);
    }
  };

  return (
    <div className="workflow-container">
      <div className="input-section">
        {/* Backend Switcher */}
        <div className="backend-switcher">
          <label htmlFor="backendSelect">
            <span className="backend-label">🔌 Backend API:</span>
          </label>
          <select 
            id="backendSelect"
            value={backendType} 
            onChange={(e) => setBackendType(e.target.value)}
            disabled={isRunning}
            className="backend-select"
          >
            <option value="cloud">☁️ Cloud (Railway) - {BACKEND_OPTIONS.cloud}</option>
            <option value="local">💻 Local (Development) - {BACKEND_OPTIONS.local}</option>
          </select>
        </div>
        
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

        {/* Backend Status Indicator */}
        {backendStatus !== 'unknown' && (
          <div className={`backend-status ${backendStatus}`}>
            {backendStatus === 'connected' ? (
              <>
                <span className="status-dot"></span>
                <span>Backend API Connected</span>
                <span className="status-url">{API_BASE_URL}</span>
              </>
            ) : (
              <>
                <span className="status-dot"></span>
                <span>⚠️ Backend API Not Available</span>
                <span className="status-url">{API_BASE_URL}</span>
              </>
            )}
          </div>
        )}

        {/* Mode 1: Jira ID Input */}
        {mode === 'jira-id' && (
          <div className="input-group">
            <label htmlFor="storyId">Jira Story ID</label>
            <input
              id="storyId"
              type="text"
              placeholder="e.g., ECOM-101"
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

As a shopper, I want to search and open product details quickly.

Acceptance Criteria:
- Search input accepts product keywords
- Product list renders relevant items
- Product details page opens with price and add-to-cart action`}
              value={plainEnglish}
              onChange={(e) => setPlainEnglish(e.target.value)}
              disabled={isRunning}
              rows={8}
            />
          </div>
        )}

        <div className="project-context-panel">
          <h3>Project Context (Brownfield POM)</h3>
          <p>Keep this branch focused on your e-commerce app by supplying project knowledge and references.</p>

          <div className="input-group">
            <label htmlFor="targetUrl">Target Application URL</label>
            <input
              id="targetUrl"
              type="text"
              value={projectContext.targetUrl}
              onChange={(e) => handleContextChange('targetUrl', e.target.value)}
              disabled={isRunning}
            />
          </div>

          <div className="input-group">
            <label htmlFor="projectPrompt">Project-Specific Prompt</label>
            <textarea
              id="projectPrompt"
              rows={3}
              placeholder="Add guidance for deterministic output, coding conventions, and priorities for this app"
              value={projectContext.projectPrompt}
              onChange={(e) => handleContextChange('projectPrompt', e.target.value)}
              disabled={isRunning}
            />
          </div>

          <div className="context-grid">
            <div className="input-group">
              <label htmlFor="applicationKnowledge">Application Knowledge</label>
              <textarea
                id="applicationKnowledge"
                rows={4}
                value={projectContext.applicationKnowledge}
                onChange={(e) => handleContextChange('applicationKnowledge', e.target.value)}
                disabled={isRunning}
              />
            </div>

            <div className="input-group">
              <label htmlFor="frameworkKnowledge">Framework Knowledge</label>
              <textarea
                id="frameworkKnowledge"
                rows={4}
                value={projectContext.frameworkKnowledge}
                onChange={(e) => handleContextChange('frameworkKnowledge', e.target.value)}
                disabled={isRunning}
              />
            </div>

            <div className="input-group">
              <label htmlFor="domainKnowledge">Domain Knowledge</label>
              <textarea
                id="domainKnowledge"
                rows={4}
                value={projectContext.domainKnowledge}
                onChange={(e) => handleContextChange('domainKnowledge', e.target.value)}
                disabled={isRunning}
              />
            </div>

            <div className="input-group">
              <label htmlFor="jiraStoryIds">Related Jira Story IDs (comma/new line)</label>
              <textarea
                id="jiraStoryIds"
                rows={4}
                placeholder="ECOM-101, ECOM-102"
                value={projectContext.jiraStoryIds}
                onChange={(e) => handleContextChange('jiraStoryIds', e.target.value)}
                disabled={isRunning}
              />
            </div>

            <div className="input-group">
              <label htmlFor="wikiLinks">Wiki Links (comma/new line)</label>
              <textarea
                id="wikiLinks"
                rows={4}
                placeholder="https://wiki.company.com/ecomm-checkout"
                value={projectContext.wikiLinks}
                onChange={(e) => handleContextChange('wikiLinks', e.target.value)}
                disabled={isRunning}
              />
            </div>

            <div className="input-group">
              <label htmlFor="additionalContext">Additional Context</label>
              <textarea
                id="additionalContext"
                rows={4}
                value={projectContext.additionalContext}
                onChange={(e) => handleContextChange('additionalContext', e.target.value)}
                disabled={isRunning}
              />
            </div>
          </div>

          <div className="input-group">
            <label htmlFor="projectDocs">Upload Project Documents (text, md, json, csv)</label>
            <input
              id="projectDocs"
              type="file"
              multiple
              accept=".txt,.md,.json,.csv,.log"
              onChange={handleDocumentUpload}
              disabled={isRunning}
            />
            {documentUploadError && <span className="upload-error">{documentUploadError}</span>}
            {projectContext.documents.length > 0 && (
              <div className="document-chips">
                {projectContext.documents.map((doc) => (
                  <button
                    key={doc.name}
                    type="button"
                    className="document-chip"
                    onClick={() => removeDocument(doc.name)}
                    disabled={isRunning}
                  >
                    {doc.name} ×
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>

        <button 
          className="run-button" 
          onClick={runWorkflow}
          disabled={isRunning || (mode === 'jira-id' ? !storyId.trim() : !plainEnglish.trim())}
        >
          {isRunning ? `⏳ Running... (${Math.floor(elapsedTime / 60)}:${String(elapsedTime % 60).padStart(2, '0')})` : (mode === 'plain-english' ? '🚀 Create Story & Run Tests' : '🚀 Run Workflow')}
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
              <span className="result-label">Total Duration:</span>
              <span className="result-value">{results.totalDuration ? `${Math.floor(results.totalDuration / 60)}m ${Math.round(results.totalDuration % 60)}s` : `${results.duration}s`}</span>
            </div>
            <div className="result-item">
              <span className="result-label">Test Execution:</span>
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
