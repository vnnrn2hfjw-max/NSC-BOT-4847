require("dotenv").config();

const {
  REST,
  Routes
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const commands = [];

const commandsPath = path.join(
  __dirname,
  "Commands"
);


// ======================
// LOAD COMMANDS
// ======================

if (fs.existsSync(commandsPath)) {

  const commandFiles = fs.readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

  for (const file of commandFiles) {

    try {

      const command = require(
        path.join(commandsPath, file)
      );

      if (command.data) {

        commands.push(
          command.data.toJSON()
        );

        console.log(
          `✅ Loaded: ${command.data.name}`
        );

      }

    } catch (error) {

      console.error(
        `❌ Could not load ${file}:`,
        error
      );

    }

  }

}


// ======================
// CHECK ENV
// ======================

if (!process.env.TOKEN) {
  console.error("❌ TOKEN is missing.");
  process.exit(1);
}

if (!process.env.CLIENT_ID) {
  console.error("❌ CLIENT_ID is missing.");
  process.exit(1);
}

if (!process.env.GUILD_ID) {
  console.error("❌ GUILD_ID is missing.");
  process.exit(1);
}


// ======================
// DEPLOY
// ======================

const rest = new REST({
  version: "10"
}).setToken(process.env.TOKEN);


(async () => {

  try {

    console.log(
      `🔄 Deploying ${commands.length} command(s)...`
    );

    await rest.put(

      Routes.applicationGuildCommands(
        process.env.CLIENT_ID,
        process.env.GUILD_ID
      ),

      {
        body: commands
      }

    );

    console.log(
      "✅ Commands deployed successfully!"
    );

  } catch (error) {

    console.error(
      "❌ Command deployment failed:"
    );

    console.error(error);

    process.exit(1);

  }

})();
