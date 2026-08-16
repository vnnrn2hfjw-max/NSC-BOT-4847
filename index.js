require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
    Client,
    Collection,
    GatewayIntentBits,
    REST,
    Routes
} = require("discord.js");

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();


// ==========================================
// LOAD COMMANDS
// ==========================================

const commandsPath = path.join(
    __dirname,
    "Commands"
);

const commands = [];

if (!fs.existsSync(commandsPath)) {

    console.error("Commands folder does not exist!");

} else {

    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith(".js"));

    console.log(
        `Commands: ${commandFiles.length} file(s)`
    );

    for (const file of commandFiles) {

        try {

            const command = require(
                path.join(commandsPath, file)
            );

            if (!command.data || !command.execute) {

                console.log(
                    `Skipping invalid command: ${file}`
                );

                continue;
            }

            client.commands.set(
                command.data.name,
                command
            );

            commands.push(
                command.data.toJSON()
            );

            console.log(
                `Command loaded: ${command.data.name}`
            );

        } catch (error) {

            console.error(
                `Command error (${file}):`,
                error
            );
        }
    }
}


// ==========================================
// LOAD EVENTS
// ==========================================

const eventsPath = path.join(
    __dirname,
    "Events"
);

if (!fs.existsSync(eventsPath)) {

    console.error(
        "Events folder does not exist!"
    );

} else {

    const eventFiles = fs
        .readdirSync(eventsPath)
        .filter(file => file.endsWith(".js"));

    console.log(
        `Events: ${eventFiles.length} file(s)`
    );

    for (const file of eventFiles) {

        try {

            const event = require(
                path.join(eventsPath, file)
            );

            if (!event.name || !event.execute) {

                console.log(
                    `Skipping invalid event: ${file}`
                );

                continue;
            }

            if (event.once) {

                client.once(
                    event.name,
                    (...args) =>
                        event.execute(
                            ...args,
                            client
                        )
                );

            } else {

                client.on(
                    event.name,
                    (...args) =>
                        event.execute(
                            ...args,
                            client
                        )
                );
            }

            console.log(
                `Event loaded: ${event.name}`
            );

        } catch (error) {

            console.error(
                `Event error (${file}):`,
                error
            );
        }
    }
}


// ==========================================
// REGISTER SLASH COMMANDS
// ==========================================

async function registerCommands() {

    if (!process.env.TOKEN) {
        console.error("TOKEN is missing!");
        return;
    }

    if (!process.env.CLIENT_ID) {
        console.error("CLIENT_ID is missing!");
        return;
    }

    if (!process.env.GUILD_ID) {
        console.error("GUILD_ID is missing!");
        return;
    }

    try {

        const rest = new REST({
            version: "10"
        }).setToken(
            process.env.TOKEN
        );

        console.log(
            `Registering ${commands.length} slash command(s)...`
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
            "Slash commands registered successfully!"
        );

        for (const command of commands) {

            console.log(
                `Registered: /${command.name}`
            );
        }

    } catch (error) {

        console.error(
            "Slash command registration failed:"
        );

        console.error(error);
    }
}


// ==========================================
// READY
// ==========================================

client.once(
    "ready",
    async () => {

        console.log(
            "======================================"
        );

        console.log(
            `NSC BOT ONLINE`
        );

        console.log(
            `${client.user.tag}`
        );

        console.log(
            `Servers: ${client.guilds.cache.size}`
        );

        console.log(
            `Commands: ${client.commands.size}`
        );

        console.log(
            "======================================"
        );

        await registerCommands();
    }
);


// ==========================================
// LOGIN
// ==========================================

if (!process.env.TOKEN) {

    console.error(
        "TOKEN is missing from environment variables!"
    );

    process.exit(1);
}

client.login(
    process.env.TOKEN
).catch(error => {

    console.error(
        "Discord login failed:"
    );

    console.error(error);

});
