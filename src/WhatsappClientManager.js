const { Client, LocalAuth } = require('whatsapp-web.js');
const puppeteer = require('puppeteer');

class WhatsappClientManager {
    constructor() {
        this.clients = [];
    }

    async createClient() {
        // Launch a new Puppeteer instance with visible browser window
        const browser = await puppeteer.launch({
            headless: false,
            args: ['--no-sandbox', '--disable-setuid-sandbox']
        });

        // Create a new client instance with the browser
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
            // Fired if session restore was unsuccessful
            console.error('AUTHENTICATION FAILURE : ', msg);
        });
        
        client.on('qr', (qr) => {
            console.log('QR RECEIVED : ', qr);
        });
        
        client.on('ready', () => {
            console.log('Client is ready!');
        });
        
        client.on('message', msg => {
            if (msg.body == 'hi') {
                msg.reply('hello');
            }
            console.log(`Received message: ${msg.body}`);
            // Reply to the message
            msg.reply('Thanks for your message!');
        });
        
        client.on('disconnected', (reason) => {
            console.error('Client was logged out', reason);
            // You can attempt to reconnect here if desired
        });
        
        client.on('error', (error) => {
            console.error('Error encountered:', error);
        });

        // Initialize the client
        await client.initialize();

        // Store the client instance
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
