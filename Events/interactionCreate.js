const {
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(
    __dirname,
    "..",
    "Data",
    "giveaways.json"
);


// ==========================================
// DATA
// ==========================================

function loadGiveaways() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, "{}");
    }

    try {
        return JSON.parse(
            fs.readFileSync(DATA_FILE, "utf8")
        );
    } catch {
        return {};
    }
}

function saveGiveaways(data) {
    fs.writeFileSync(
        DATA_FILE,
        JSON.stringify(data, null, 2)
    );
}


// ==========================================
// RANDOM WINNERS
// ==========================================

function pickWinners(participants, amount) {

    const shuffled =
        [...participants].sort(
            () => Math.random() - 0.5
        );

    return shuffled.slice(
        0,
        Math.min(amount, shuffled.length)
    );
}


// ==========================================
// INTERACTION
// ==========================================

module.exports = {

    name: "interactionCreate",

    async execute(interaction) {

        // ======================================
        // SLASH COMMANDS
        // ======================================

        if (interaction.isChatInputCommand()) {

            const command =
                interaction.client.commands.get(
                    interaction.commandName
                );

            if (!command) return;

            try {

                await command.execute(interaction);

            } catch (error) {

                console.error(
                    `❌ Command error: ${interaction.commandName}`,
                    error
                );

                if (interaction.replied || interaction.deferred) {

                    await interaction.followUp({
                        content:
                            "❌ Something went wrong while running this command.",
                        ephemeral: true
                    });

                } else {

                    await interaction.reply({
                        content:
                            "❌ Something went wrong while running this command.",
                        ephemeral: true
                    });

                }
            }

            return;
        }


        // ======================================
        // GIVEAWAY BUTTON
        // ======================================

        if (!interaction.isButton()) return;

        if (
            !interaction.customId.startsWith(
                "giveaway_enter_"
            )
        ) {
            return;
        }


        const giveawayId =
            interaction.customId.replace(
                "giveaway_enter_",
                ""
            );


        const giveaways =
            loadGiveaways();

        const giveaway =
            giveaways[giveawayId];


        if (!giveaway) {

            return interaction.reply({
                content:
                    "❌ This giveaway no longer exists.",
                ephemeral: true
            });

        }


        if (giveaway.ended) {

            return interaction.reply({
                content:
                    "❌ This giveaway has already ended.",
                ephemeral: true
            });

        }


        // ======================================
        // ALREADY ENTERED
        // ======================================

        if (
            giveaway.participants.includes(
                interaction.user.id
            )
        ) {

            return interaction.reply({
                content:
                    "❌ You are already entered in this giveaway!",
                ephemeral: true
            });

        }


        // ======================================
        // ADD PARTICIPANT
        // ======================================

        giveaway.participants.push(
            interaction.user.id
        );

        saveGiveaways(giveaways);


        return interaction.reply({
            content:
                "🎉 You have successfully entered the giveaway!",
            ephemeral: true
        });
    }
};
