const { Client, LocalAuth } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');

class WhatsappClientManager {
    constructor() {
        this.clients = [];
    }

    async createClient() {
        const browser = await puppeteer.launch({
            headless: true,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        const client = new Client({
            authStrategy: new LocalAuth(),
            puppeteer: {
                browser
            }
        });

        client.on('authenticated', () => {
            console.log('AUTHENTICATED');
        });
        
        client.on('auth_failure', msg => {
            console.error('AUTHENTICATION FAILURE : ', msg);
        });
        
        client.on('qr', (qr) => {
            console.log('QR RECEIVED : ', qr);
        });
        
        client.on('ready', () => {
            console.log('Client is ready!');
        });
        
        client.on('message', message => {
            if (message.body == 'hi')
                message.reply('hello');
            console.log(`Received message: ${message.body}`);
        });
        
        client.on('disconnected', (reason) => {
            console.error('Client was logged out', reason);
        });
        
        client.on('error', (error) => {
            console.error('Error encountered:', error);
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
}

module.exports = WhatsappClientManager;
