const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder,
    ActionRowBuilder,
    ButtonBuilder,
    ButtonStyle
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
// COMMAND
// ==========================================

module.exports = {

    data: new SlashCommandBuilder()
        .setName("giveaway")
        .setDescription("Create a giveaway")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageGuild
        )

        .addStringOption(option =>
            option
                .setName("prize")
                .setDescription("What is being given away?")
                .setRequired(true)
        )

        .addStringOption(option =>
            option
                .setName("duration")
                .setDescription("Example: 10m, 1h, 2d")
                .setRequired(true)
        )

        .addIntegerOption(option =>
            option
                .setName("winners")
                .setDescription("Number of winners")
                .setMinValue(1)
                .setMaxValue(20)
                .setRequired(true)
        ),

    async execute(interaction) {

        const prize =
            interaction.options.getString("prize");

        const duration =
            interaction.options.getString("duration");

        const winners =
            interaction.options.getInteger("winners");


        // ==========================================
        // DURATION PARSER
        // ==========================================

        const match =
            duration.match(/^(\d+)(s|m|h|d|w)$/i);

        if (!match) {

            return interaction.reply({
                content:
                    "❌ Invalid duration. Use `10s`, `10m`, `1h`, `1d`, or `1w`.",
                ephemeral: true
            });

        }

        const amount =
            Number(match[1]);

        const unit =
            match[2].toLowerCase();

        const multipliers = {
            s: 1000,
            m: 60 * 1000,
            h: 60 * 60 * 1000,
            d: 24 * 60 * 60 * 1000,
            w: 7 * 24 * 60 * 60 * 1000
        };

        const durationMs =
            amount * multipliers[unit];


        if (durationMs < 5000) {

            return interaction.reply({
                content:
                    "❌ Giveaway duration must be at least **5 seconds**.",
                ephemeral: true
            });

        }


        // ==========================================
        // CREATE GIVEAWAY
        // ==========================================

        const giveawayId =
            `${Date.now()}-${Math.random()
                .toString(36)
                .substring(2, 8)}`;

        const endTime =
            Date.now() + durationMs;


        const embed =
            new EmbedBuilder()

                .setColor("#8B0000")

                .setTitle("🎉 NSC GIVEAWAY 🎉")

                .setDescription(
                    `## 🎁 ${prize}\n\n` +
                    `🏆 **Winners:** ${winners}\n` +
                    `⏰ **Ends:** <t:${Math.floor(endTime / 1000)}:R>\n\n` +
                    `Click **🎉 Enter** below to participate!`
                )

                .addFields({
                    name: "Hosted By",
                    value: `${interaction.user}`,
                    inline: true
                })

                .setFooter({
                    text: "NSC | Giveaway System"
                })

                .setTimestamp();


        const button =
            new ButtonBuilder()
                .setCustomId(`giveaway_enter_${giveawayId}`)
                .setLabel("🎉 Enter")
                .setStyle(ButtonStyle.Danger);


        const row =
            new ActionRowBuilder()
                .addComponents(button);


        const message =
            await interaction.channel.send({
                embeds: [embed],
                components: [row]
            });


        // ==========================================
        // SAVE
        // ==========================================

        const giveaways =
            loadGiveaways();

        giveaways[giveawayId] = {

            id: giveawayId,

            messageId: message.id,

            channelId: interaction.channel.id,

            guildId: interaction.guild.id,

            prize: prize,

            winners: winners,

            endTime: endTime,

            hostId: interaction.user.id,

            participants: [],

            ended: false
        };


        saveGiveaways(giveaways);


        await interaction.reply({
            content:
                `✅ Giveaway created successfully!`,
            ephemeral: true
        });
    }
};
