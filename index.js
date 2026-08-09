require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
    Client,
    Collection,
    GatewayIntentBits
} = require("discord.js");

console.log("🟢 NSC BOT: index.js started");
console.log("🟢 Discord.js loaded");

// ==========================================
// CLIENT
// ==========================================

const client = new Client({
    intents: [
        GatewayIntentBits.Guilds,
        GatewayIntentBits.GuildMessages,
        GatewayIntentBits.MessageContent,
        GatewayIntentBits.GuildMembers
    ]
});

client.commands = new Collection();

console.log("✅ Client created");
console.log("✅ Message Content Intent enabled");


// ==========================================
// LOAD COMMANDS
// ==========================================

const commandsPath = path.join(__dirname, "Commands");

console.log(`📂 Commands path: ${commandsPath}`);

if (!fs.existsSync(commandsPath)) {

    console.error("❌ Commands folder does NOT exist!");

} else {

    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith(".js"));

    console.log(`📋 Found ${commandFiles.length} command files.`);

    for (const file of commandFiles) {

        try {

            const command = require(
                path.join(commandsPath, file)
            );

            if (!command.data || !command.execute) {

                console.log(
                    `⚠️ Skipping ${file} — invalid command format.`
                );

                continue;
            }

            client.commands.set(
                command.data.name,
                command
            );

            console.log(
                `✅ Loaded command: ${command.data.name}`
            );

        } catch (error) {

            console.error(
                `❌ Error loading ${file}:`,
                error
            );
        }
    }
}


// ==========================================
// LOAD EVENTS
// ==========================================

const eventsPath = path.join(__dirname, "Events");

console.log(`📂 Events path: ${eventsPath}`);

if (!fs.existsSync(eventsPath)) {

    console.error("❌ Events folder does NOT exist!");

} else {

    const eventFiles = fs
        .readdirSync(eventsPath)
        .filter(file => file.endsWith(".js"));

    console.log(`📋 Found ${eventFiles.length} event files.`);

    for (const file of eventFiles) {

        try {

            const event = require(
                path.join(eventsPath, file)
            );

            if (!event.name || !event.execute) {

                console.log(
                    `⚠️ Skipping ${file} — invalid event format.`
                );

                continue;
            }

            if (event.once) {

                client.once(
                    event.name,
                    (...args) =>
                        event.execute(...args, client)
                );

            } else {

                client.on(
                    event.name,
                    (...args) =>
                        event.execute(...args, client)
                );
            }

            console.log(
                `✅ Loaded event: ${event.name}`
            );

        } catch (error) {

            console.error(
                `❌ Error loading event ${file}:`,
                error
            );
        }
    }
}


// ==========================================
// TEST MESSAGE LISTENER
// ==========================================

client.on("messageCreate", message => {

    console.log(
        `📨 MESSAGE RECEIVED: "${message.content}" from ${message.author.tag}`
    );

});


// ==========================================
// GIVEAWAY DATA
// ==========================================

const giveawayPath = path.join(
    __dirname,
    "Data",
    "giveaways.json"
);

function loadGiveaways() {

    const folder = path.dirname(giveawayPath);

    if (!fs.existsSync(folder)) {

        fs.mkdirSync(folder, {
            recursive: true
        });
    }

    if (!fs.existsSync(giveawayPath)) {

        fs.writeFileSync(
            giveawayPath,
            "{}"
        );
    }

    try {

        return JSON.parse(
            fs.readFileSync(
                giveawayPath,
                "utf8"
            )
        );

    } catch (error) {

        console.error(
            "❌ giveaways.json is invalid:",
            error
        );

        return {};
    }
}

function saveGiveaways(data) {

    fs.writeFileSync(
        giveawayPath,
        JSON.stringify(
            data,
            null,
            2
        )
    );
}

function pickWinners(
    participants,
    amount
) {

    const shuffled = [...participants];

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() * (i + 1)
            );

        [
            shuffled[i],
            shuffled[j]
        ] = [
            shuffled[j],
            shuffled[i]
        ];
    }

    return shuffled.slice(
        0,
        Math.min(
            amount,
            shuffled.length
        )
    );
}


// ==========================================
// GIVEAWAY AUTO END
// ==========================================

async function checkGiveaways() {

    const giveaways = loadGiveaways();

    let changed = false;

    for (
        const giveaway
        of Object.values(giveaways)
    ) {

        if (giveaway.ended) continue;

        if (!giveaway.endTime) continue;

        if (
            Date.now() <
            Number(giveaway.endTime)
        ) {
            continue;
        }

        try {

            giveaway.ended = true;

            const participants =
                giveaway.participants || [];

            const winners =
                pickWinners(
                    participants,
                    Number(giveaway.winners) || 1
                );

            giveaway.winnerIds = winners;

            changed = true;

            const channel =
                await client.channels.fetch(
                    giveaway.channelId
                );

            if (!channel) continue;

            const winnerText =
                winners.length > 0
                    ? winners
                        .map(
                            id => `<@${id}>`
                        )
                        .join(", ")
                    : "Nobody";

            try {

                const giveawayMessage =
                    await channel.messages.fetch(
                        giveaway.messageId
                    );

                await giveawayMessage.edit({
                    content:
                        `🎉 **GIVEAWAY ENDED!**\n\n` +
                        `🎁 **Prize:** ${giveaway.prize}\n` +
                        `🏆 **Winner${winners.length === 1 ? "" : "s"}:** ${winnerText}`,

                    components: []
                });

            } catch (error) {

                console.error(
                    "⚠️ Could not edit giveaway message:",
                    error.message
                );
            }

            if (winners.length > 0) {

                await channel.send({
                    content:
                        `🎉 Congratulations ${winnerText}! You won **${giveaway.prize}**!`,

                    allowedMentions: {
                        users: winners
                    }
                });

            } else {

                await channel.send(
                    `❌ The giveaway for **${giveaway.prize}** ended with no participants.`
                );
            }

        } catch (error) {

            console.error(
                "❌ Giveaway error:",
                error
            );
        }
    }

    if (changed) {
        saveGiveaways(giveaways);
    }
}

setInterval(
    checkGiveaways,
    5000
);


// ==========================================
// READY
// ==========================================

client.once(
    "ready",
    async () => {

        console.log("");
        console.log(
            "=================================="
        );

        console.log(
            `🟢 NSC BOT ONLINE: ${client.user.tag}`
        );

        console.log(
            `📊 Servers: ${client.guilds.cache.size}`
        );

        console.log(
            `⚡ Commands: ${client.commands.size}`
        );

        console.log(
            "=================================="
        );

        await checkGiveaways();
    }
);


// ==========================================
// LOGIN
// ==========================================

if (!process.env.TOKEN) {

    console.error(
        "❌ TOKEN is missing from .env!"
    );

    process.exit(1);
}

client.login(
    process.env.TOKEN
).catch(error => {

    console.error(
        "❌ Discord login failed:",
        error
    );
});
