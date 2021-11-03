const { Client, Intents, Collection } =  require("discord.js");
const colors = require("colors");
const fs = require("fs");

const dotenv = require("dotenv");
dotenv.config(); //.env

//? creating new client instance
const client = new Client({
	intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

//? once bot is ready
client.once("ready", () => {
	console.log(colors.blue("Discord JS is ready"));
});

client.on("messageCreate", (msg) => {
	if (msg.content.toLowerCase() === "hi")
		msg.reply({
			content: "Hello!",
		});
});

client.on("interactionCreate", async (interaction) => {
	if (!interaction.isCommand()) return;

	const command = client.commands.get(interaction.commandName);
  if (!command) return;

  try {
    await command.execute(interaction);
  } catch (err) {
    console.error(colors.red(err));
    await interaction.reply({ 
      content: "There was an error while executing this command",
      ephemeral: true
    })
  }
});

client.commands = new Collection();
const commandFiles = fs
	.readdirSync("./src/commands")
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	client.commands.set(command.data.name, command);
}

client.login(process.env.TOKEN);
