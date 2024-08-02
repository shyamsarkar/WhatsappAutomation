// app/CustomLocalAuth.js
const { LocalAuth } = require('whatsapp-web.js');
const path = require('path');
const fs = require('fs');

class CustomLocalAuth extends LocalAuth {
    constructor(options) {
        super(options);
        this.sessionDir = options.sessionDir || path.resolve(__dirname, 'sessions');
        if (!fs.existsSync(this.sessionDir)) {
            fs.mkdirSync(this.sessionDir, { recursive: true });
        }
    }

    getSessionFilePath(sessionName) {
        return path.join(this.sessionDir, `${sessionName}.json`);
    }

    async saveState(sessionName, state) {
        const sessionFilePath = this.getSessionFilePath(sessionName);
        fs.writeFileSync(sessionFilePath, JSON.stringify(state));
    }

    async loadState(sessionName) {
        const sessionFilePath = this.getSessionFilePath(sessionName);
        if (fs.existsSync(sessionFilePath)) {
            return JSON.parse(fs.readFileSync(sessionFilePath, 'utf8'));
        }
        return null;
    }
}

module.exports = CustomLocalAuth;
