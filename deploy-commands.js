require("dotenv").config();

const {
    REST,
    Routes
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const commandsPath = path.join(
    __dirname,
    "Commands"
);

const commands = [];

console.log("Starting command deployment...");

if (!fs.existsSync(commandsPath)) {
    console.error("Commands folder not found!");
    process.exit(1);
}

const commandFiles = fs
    .readdirSync(commandsPath)
    .filter(file => file.endsWith(".js"));

console.log(
    `Found ${commandFiles.length} command files.`
);

for (const file of commandFiles) {

    try {

        const command = require(
            path.join(commandsPath, file)
        );

        if (!command.data) {
            console.log(
                `Skipping ${file} - no command data.`
            );
            continue;
        }

        commands.push(
            command.data.toJSON()
        );

        console.log(
            `Loaded command: ${command.data.name}`
        );

    } catch (error) {

        console.error(
            `Failed to load ${file}:`
        );

        console.error(error);
    }
}

if (!process.env.TOKEN) {
    console.error("TOKEN is missing from .env");
    process.exit(1);
}

if (!process.env.CLIENT_ID) {
    console.error("CLIENT_ID is missing from .env");
    process.exit(1);
}

if (!process.env.GUILD_ID) {
    console.error("GUILD_ID is missing from .env");
    process.exit(1);
}

const rest = new REST({
    version: "10"
}).setToken(
    process.env.TOKEN
);

(async () => {

    try {

        console.log(
            `Deploying ${commands.length} commands...`
        );

        const result =
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
            `Successfully deployed ${result.length} commands.`
        );

        for (const command of result) {
            console.log(
                `Registered: /${command.name}`
            );
        }

    } catch (error) {

        console.error(
            "Command deployment failed:"
        );

        console.error(error);
    }

})();
