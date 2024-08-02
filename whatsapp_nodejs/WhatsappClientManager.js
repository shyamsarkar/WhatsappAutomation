const { Client } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');
const CustomLocalAuth = require('./CustomLocalAuth');

class WhatsappClientManager {
    constructor() {
        console.log("-------------WhatsappClientManager-----------");
        if (WhatsappClientManager.instance)
            return WhatsappClientManager.instance;

        this.clients = [];
        WhatsappClientManager.instance = this;
    }

    async createClient(clientId) {
        if (!clientId)
            return;

        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const client = new Client({
            authStrategy: new CustomLocalAuth({ sessionDir: 'sessions', clientId: clientId }),
            puppeteer: {
                browser
            }
        });

        client.on('authenticated', () => {
            console.log(`Client ${clientId} authenticated`);
        });

        client.on('auth_failure', msg => {
            console.error(`Client ${clientId} authentication failure: `, msg);
        });

        client.on('qr', (qr) => {
            console.log(`Client ${clientId} QR received: `, qr);
        });

        client.on('ready', () => {
            console.log(`Client ${clientId} is ready!`);
        });

        client.on('message', message => {
            if (message.body == 'hi')
                message.reply('Thanks for contacting us. We will get back to you!');
            console.log(`Client ${clientId} received message: ${message.body}`);
        });

        client.on('disconnected', (reason) => {
            console.error(`Client ${clientId} was logged out: `, reason);
        });

        client.on('error', (error) => {
            console.error(`Client ${clientId} encountered an error: `, error);
        });

        await client.initialize();

        this.clients.push(client);
        return client;
    }

    async closeClients() {
        for (const client of this.clients) {
            await client.destroy();
        }
        this.clients = [];
    }

    getClients() {
        return this.clients.map((client) => client.authStrategy.clientId);
    }

    getClientById(clientId) {
        const clientObj = this.clients.find(client => client.authStrategy.clientId == clientId);
        return clientObj ? clientObj : null;
    }

    async getAuthenticatedClient() {
        const authenticatedClients = this.clients.filter(client => client.isReady);
        // return authenticatedClients;
        return authenticatedClients.map((client) => client.authStrategy.clientId);
    }

}

module.exports = new WhatsappClientManager();
