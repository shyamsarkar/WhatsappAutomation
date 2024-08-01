const WhatsappClientManager = require('./WhatsappClientManager');

const manager = new WhatsappClientManager();

(async () => {
    const client1 = await manager.createClient();
    const client2 = await manager.createClient();
})();
