// Tutaj są wymagane do Discord.js
const fs = require('node:fs');
const path = require('node:path');
const { Client, Events, Collection, GatewayIntentBits } = require('discord.js');
const { token } = require('./config.json');
const client = new Client({ intents: [GatewayIntentBits.Guilds] });
client.commands = new Collection();
// ODPALIC TEN KOD TYLKO RAZ
client.once(Events.ClientReady, c => {
	console.log(`Bot dziala ${c.user.tag}`);
});

client.login(token);

client.commands = new Collection();

client.commands = new Collection();

const commandsPath = path.join(__dirname, 'commands');
const commandFiles = fs.readdirSync(commandsPath).filter(file => file.endsWith('.js'));

for (const file of commandFiles) {
	const filePath = path.join(commandsPath, file);
	const command = require(filePath);
	// Set a new item in the Collection with the key as the command name and the value as the exported module
	if ('data' in command && 'execute' in command) {
		client.commands.set(command.data.name, command);
	}
	else {
		console.log(`[UWAGA] W komendzie ${filePath} brakuje potrzebnych cech "data" albo "execute"`);
	}
}


client.on(Events.InteractionCreate, interaction => {
	console.log(interaction);
});


client.on(Events.InteractionCreate, interaction => {
	if (!interaction.isChatInputCommand()) return;
	console.log(interaction);
});

client.on(Events.InteractionCreate, async interaction => {
	if (!interaction.isChatInputCommand()) return;

	const command = interaction.client.commands.get(interaction.commandName);

	if (!command) {
		console.error(`Nie znaleziono komendy odpowiadajacej ${interaction.commandName} .`);
		return;
	}

	try {
		await command.execute(interaction);
	}
	catch (error) {
		console.error(error);
		await interaction.reply({ content: 'Wystapil problem podczas wykonywania komendy!', ephemeral: true });
	}
});

