import React, { useState } from 'react';
import './App.css';
import WorkflowUI from './components/WorkflowUI';

function App() {
  return (
    <div className="App">
      <header className="App-header">
        <div className="brand-logo">AAVA</div>
        <h1>Ascendion QE Studio Playwright AI Framework</h1>
        <p>This is your window for decisive test automation planning and execution</p>
      </header>
      <main className="App-main">
        <WorkflowUI />
      </main>
      <footer className="App-footer">
        <p>© 2026 Ascendion | Powered by Jira, TestRail & Playwright</p>
      </footer>
    </div>
  );
}

export default App;
