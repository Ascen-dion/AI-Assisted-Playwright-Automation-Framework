import React, { useEffect, useRef } from 'react';
import './LogViewer.css';

const LogViewer = ({ logs }) => {
  const logEndRef = useRef(null);

  useEffect(() => {
    logEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [logs]);

  // Function to render message with clickable URLs
  const renderMessage = (message) => {
    const urlRegex = /(https?:\/\/[^\s]+)/g;
    const parts = message.split(urlRegex);
    
    return parts.map((part, i) => {
      if (part.match(urlRegex)) {
        return (
          <a 
            key={i} 
            href={part} 
            target="_blank" 
            rel="noopener noreferrer"
            className="log-link"
          >
            {part}
          </a>
        );
      }
      return <span key={i}>{part}</span>;
    });
  };

  if (logs.length === 0) {
    return null;
  }

  return (
    <div className="log-viewer">
      <h3>📝 Execution Logs</h3>
      <div className="log-content">
        {logs.map((log, index) => (
          <div key={index} className={`log-entry ${log.type}`}>
            <span className="log-timestamp">[{log.timestamp}]</span>
            <span className="log-message">{renderMessage(log.message)}</span>
          </div>
        ))}
        <div ref={logEndRef} />
      </div>
    </div>
  );
};

export default LogViewer;
