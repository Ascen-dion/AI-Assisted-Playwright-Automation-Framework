/**
 * Logger utility for framework
 * Provides consistent logging across all test files
 */

const fs = require('fs');
const path = require('path');

class Logger {
  constructor() {
    this.logDir = path.join(process.cwd(), 'logs');
    this.logFile = path.join(this.logDir, 'test-execution.log');
    this.ensureLogDirectory();
  }

  ensureLogDirectory() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  getTimestamp() {
    return new Date().toISOString();
  }

  formatMessage(level, message) {
    return `[${this.getTimestamp()}] [${level}] ${message}`;
  }

  writeToFile(message) {
    try {
      fs.appendFileSync(this.logFile, message + '\n');
    } catch (error) {
      console.error('Failed to write to log file:', error);
    }
  }

  info(message) {
    const formattedMessage = this.formatMessage('INFO', message);
    console.log(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  error(message) {
    const formattedMessage = this.formatMessage('ERROR', message);
    console.error(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  warn(message) {
    const formattedMessage = this.formatMessage('WARN', message);
    console.warn(formattedMessage);
    this.writeToFile(formattedMessage);
  }

  debug(message) {
    const formattedMessage = this.formatMessage('DEBUG', message);
    console.log(formattedMessage);
    this.writeToFile(formattedMessage);
  }
}

module.exports = new Logger();