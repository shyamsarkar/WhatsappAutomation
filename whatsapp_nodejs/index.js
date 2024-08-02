const whatsappClientManager = require('./WhatsappClientManager');
const sessionName1 = 'client1';
const sessionName2 = 'client2';
const phoneNumber = '91';

async function main() {
    try {
        console.log("--------------Calling Client 1 Initiated------------");
        await whatsappClientManager.createClient(sessionName1);
        console.log("--------------Calling Client 2 Initiated------------");
        await whatsappClientManager.createClient(sessionName2);
        console.log("--------------Calling Done------------");
        const clients = whatsappClientManager.getClients();
        console.log("SESSIONS = ", clients);
        const selectedClient = whatsappClientManager.getClientById(sessionName2);
        console.log("Selected Client: ", selectedClient.authStrategy.clientId);
        setTimeout(()=>{
            const now = new Date();
            const textMessage = `Hello, Sent on ${now.toString()}`;
            selectedClient.sendMessage(`${phoneNumber}@c.us`, textMessage)
                .then(resp => console.log('Message sent:', resp.id))
                .catch(err => console.error('Error sending message:', err));
            const authenticatedClients = whatsappClientManager.getAuthenticatedClient();
            console.log("Authenticated Clients: ", authenticatedClients);
        },5000);
    } catch (error) {
        console.error('Error creating client:', error);
    }
}

main();