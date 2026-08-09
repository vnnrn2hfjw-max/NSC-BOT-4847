require("dotenv").config();

const {
  Client,
  GatewayIntentBits,
  Collection
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMembers,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent
  ]
});

client.commands = new Collection();


// ======================
// COMMANDS
// ======================

const commandsPath = path.join(__dirname, "Commands");

if (fs.existsSync(commandsPath)) {
  const commandFiles = fs.readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {
    try {
      const command = require(
        path.join(commandsPath, file)
      );

      if (command.data && command.execute) {
        client.commands.set(
          command.data.name,
          command
        );

        console.log(
          `✅ Loaded command: ${command.data.name}`
        );
      }

    } catch (error) {
      console.error(
        `❌ Failed to load command ${file}:`,
        error
      );
    }
  }
}


// ======================
// EVENTS
// ======================

const eventsPath = path.join(__dirname, "Events");

if (fs.existsSync(eventsPath)) {
  const eventFiles = fs.readdirSync(eventsPath)
    .filter(file => file.endsWith(".js"));

  for (const file of eventFiles) {
    try {
      const event = require(
        path.join(eventsPath, file)
      );

      if (!event.name || !event.execute) {
        continue;
      }

      if (event.once) {
        client.once(
          event.name,
          (...args) => event.execute(...args, client)
        );
      } else {
        client.on(
          event.name,
          (...args) => event.execute(...args, client)
        );
      }

      console.log(
        `✅ Loaded event: ${event.name}`
      );

    } catch (error) {
      console.error(
        `❌ Failed to load event ${file}:`,
        error
      );
    }
  }
}


// ======================
// LOGIN
// ======================

if (!process.env.TOKEN) {
  console.error("❌ TOKEN is missing from .env");
  process.exit(1);
}

client.login(process.env.TOKEN);
