// Temporaty changes


const WhatsappClientManager = require('./WhatsappClientManager');

// Create an instance of the manager
const manager = new WhatsappClientManager();

// Create a new client and generate a QR code
(async () => {
    const client1 = await manager.createClient();
    // You can create additional clients as needed
    const client2 = await manager.createClient();
})();
