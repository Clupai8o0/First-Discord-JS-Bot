const { SlashCommandBuilder } = require("@discordjs/builders");
const { REST } = require("@discordjs/rest");
const { Routes } = require("discord-api-types/v9");
const fs = require("fs");

const colors = require("colors");
const dotenv = require("dotenv");
dotenv.config(); //.env

const guildId = "777936966418956308";
const clientId = "904663647119368213";

const commands = [];
const commandFiles = fs
	.readdirSync("./src/commands")
	.filter((file) => file.endsWith(".js"));

for (const file of commandFiles) {
	const command = require(`./commands/${file}`);
	commands.push(command.data.toJSON());
}

const rest = new REST({ version: "9" }).setToken(process.env.TOKEN || "");

rest
	.put(Routes.applicationGuildCommands(clientId, guildId), {
		body: commands,
	})
	.then(() => console.log(colors.green("Successfully registered commands")))
	.catch(console.error);

// todo: run node deploy-commands.js everytime changes are made
