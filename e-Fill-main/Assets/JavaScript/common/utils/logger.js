// Logger utility for e-Fill application
const LOG_LEVELS = {
    DEBUG: 'DEBUG',
    INFO: 'INFO', 
    WARN: 'WARN',
    ERROR: 'ERROR'
};

class Logger {
    constructor(module) {
        this.module = module;
    }

    _log(level, message, ...args) {
        const timestamp = new Date().toISOString();
        const logMessage = `[${timestamp}] [${level}] [${this.module}] ${message}`;
        
        // In production, we could send logs to a service like Firebase Analytics
        if (args.length > 0) {
            console.log(logMessage, ...args);
        } else {
            console.log(logMessage);
        }
          // Save to localStorage for debugging in browser environment
        if (typeof window !== 'undefined' && window.localStorage) {
            try {
                const logs = JSON.parse(window.localStorage.getItem('app_logs') || '[]');
                logs.push({
                    timestamp,
                    level,
                    module: this.module,
                    message,
                    args
                });
                // Keep only last 100 logs
                if (logs.length > 100) {
                    logs.shift();
                }
                window.localStorage.setItem('app_logs', JSON.stringify(logs));
            } catch (e) {
                console.warn('Failed to save log to localStorage:', e);
            }
        }
    }

    debug(message, ...args) {
        this._log(LOG_LEVELS.DEBUG, message, ...args);
    }

    info(message, ...args) {
        this._log(LOG_LEVELS.INFO, message, ...args);
    }

    warn(message, ...args) {
        this._log(LOG_LEVELS.WARN, message, ...args);
    }

    error(message, ...args) {
        this._log(LOG_LEVELS.ERROR, message, ...args);
    }
}

export const createLogger = (module) => new Logger(module);
