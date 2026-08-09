require("dotenv").config();

const fs = require("fs");
const path = require("path");

const {
    Client,
    Collection,
    GatewayIntentBits
} = require("discord.js");

console.log("🟢 NSC BOT: Starting...");

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

if (fs.existsSync(commandsPath)) {

    const commandFiles = fs
        .readdirSync(commandsPath)
        .filter(file => file.endsWith(".js"));

    console.log(`📂 Commands: ${commandFiles.length} file(s)`);

    for (const file of commandFiles) {

        try {

            const command = require(
                path.join(commandsPath, file)
            );

            if (
                !command.data ||
                !command.execute
            ) {
                console.log(
                    `⚠️ Skipped command: ${file}`
                );
                continue;
            }

            client.commands.set(
                command.data.name,
                command
            );

            console.log(
                `✅ Command loaded: ${command.data.name}`
            );

        } catch (error) {

            console.error(
                `❌ Command error (${file}):`,
                error
            );
        }
    }

} else {

    console.log(
        "⚠️ Commands folder does not exist."
    );
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
        "❌ Events folder does NOT exist!"
    );

} else {

    const eventFiles = fs
        .readdirSync(eventsPath)
        .filter(file => file.endsWith(".js"));

    console.log(
        `📂 Events: ${eventFiles.length} file(s)`
    );

    for (const file of eventFiles) {

        try {

            const event = require(
                path.join(eventsPath, file)
            );

            if (
                !event.name ||
                typeof event.execute !== "function"
            ) {

                console.log(
                    `⚠️ Skipped event: ${file}`
                );

                continue;
            }

            if (event.once) {

                client.once(
                    event.name,
                    (...args) => {
                        event.execute(
                            ...args,
                            client
                        );
                    }
                );

            } else {

                client.on(
                    event.name,
                    (...args) => {
                        event.execute(
                            ...args,
                            client
                        );
                    }
                );
            }

            console.log(
                `✅ Event loaded: ${event.name}`
            );

        } catch (error) {

            console.error(
                `❌ Event error (${file}):`,
                error
            );
        }
    }
}


// ==========================================
// GIVEAWAY DATA
// ==========================================

const dataFolder = path.join(
    __dirname,
    "Data"
);

const giveawayPath = path.join(
    dataFolder,
    "giveaways.json"
);

function ensureGiveawayFile() {

    if (!fs.existsSync(dataFolder)) {

        fs.mkdirSync(
            dataFolder,
            {
                recursive: true
            }
        );
    }

    if (!fs.existsSync(giveawayPath)) {

        fs.writeFileSync(
            giveawayPath,
            "{}"
        );
    }
}

function loadGiveaways() {

    ensureGiveawayFile();

    try {

        const data = fs.readFileSync(
            giveawayPath,
            "utf8"
        );

        return JSON.parse(data);

    } catch (error) {

        console.error(
            "❌ Invalid giveaways.json:",
            error
        );

        return {};
    }
}

function saveGiveaways(data) {

    ensureGiveawayFile();

    fs.writeFileSync(
        giveawayPath,
        JSON.stringify(
            data,
            null,
            2
        )
    );
}


// ==========================================
// PICK WINNERS
// ==========================================

function pickWinners(
    participants,
    amount
) {

    const shuffled = [
        ...participants
    ];

    for (
        let i = shuffled.length - 1;
        i > 0;
        i--
    ) {

        const j =
            Math.floor(
                Math.random() *
                (i + 1)
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
            Number(amount) || 1,
            shuffled.length
        )
    );
}


// ==========================================
// CHECK GIVEAWAYS
// ==========================================

async function checkGiveaways() {

    const giveaways =
        loadGiveaways();

    let changed = false;

    for (
        const [id, giveaway]
        of Object.entries(giveaways)
    ) {

        if (giveaway.ended) {
            continue;
        }

        if (!giveaway.endTime) {
            continue;
        }

        if (
            Date.now() <
            Number(giveaway.endTime)
        ) {
            continue;
        }

        try {

            giveaway.ended = true;

            const participants =
                Array.isArray(
                    giveaway.participants
                )
                    ? giveaway.participants
                    : [];

            const winners =
                pickWinners(
                    participants,
                    giveaway.winners || 1
                );

            giveaway.winnerIds =
                winners;

            changed = true;

            const channel =
                await client.channels.fetch(
                    giveaway.channelId
                );

            if (!channel) {
                continue;
            }

            const winnerText =
                winners.length
                    ? winners
                        .map(
                            userId =>
                                `<@${userId}>`
                        )
                        .join(", ")
                    : "Nobody";

            // Edit original giveaway message

            if (giveaway.messageId) {

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
            }

            // Announce winners

            if (winners.length > 0) {

                await channel.send({
                    content:
                        `🎉 Congratulations ${winnerText}! ` +
                        `You won **${giveaway.prize}**!`,

                    allowedMentions: {
                        users: winners
                    }
                });

            } else {

                await channel.send(
                    `❌ The giveaway for **${giveaway.prize}** ended with no participants.`
                );
            }

            console.log(
                `🎉 Giveaway ended: ${id}`
            );

        } catch (error) {

            console.error(
                `❌ Giveaway ${id} error:`,
                error
            );
        }
    }

    if (changed) {
        saveGiveaways(giveaways);
    }
}


// ==========================================
// GIVEAWAY CHECKER
// ==========================================

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
            "======================================"
        );

        console.log(
            `🟢 NSC BOT ONLINE`
        );

        console.log(
            `🤖 ${client.user.tag}`
        );

        console.log(
            `📊 Servers: ${client.guilds.cache.size}`
        );

        console.log(
            `⚡ Commands: ${client.commands.size}`
        );

        console.log(
            "======================================"
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
).then(() => {

    console.log(
        "🔐 Login request sent..."
    );

}).catch(error => {

    console.error(
        "❌ Discord login failed:",
        error
    );

});
