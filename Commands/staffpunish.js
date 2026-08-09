const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

const fs = require("fs");
const path = require("path");

const DATA_FILE = path.join(
    __dirname,
    "..",
    "Data",
    "staffpunishments.json"
);


// ==========================================
// DATA
// ==========================================

function loadData() {
    if (!fs.existsSync(DATA_FILE)) {
        fs.writeFileSync(DATA_FILE, "{}");
    }

    try {
        return JSON.parse(
            fs.readFileSync(DATA_FILE, "utf8")
        );
    } catch (error) {
        console.error("❌ Could not read punishment data:", error);
        return {};
    }
}

function saveData(data) {
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
        .setName("staffpunish")
        .setDescription("Manage staff punishments")

        .setDefaultMemberPermissions(
            PermissionFlagsBits.ManageRoles
        )

        // ==================================
        // STRIKE
        // ==================================

        .addSubcommand(subcommand =>
            subcommand
                .setName("strike")
                .setDescription("Give a staff member a strike")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("Staff member")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("reason")
                        .setDescription("Reason for the strike")
                        .setRequired(true)
                )
        )

        // ==================================
        // CLEAR STRIKE
        // ==================================

        .addSubcommand(subcommand =>
            subcommand
                .setName("clearstrike")
                .setDescription("Clear strikes from a staff member")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("Staff member")
                        .setRequired(true)
                )
                .addIntegerOption(option =>
                    option
                        .setName("amount")
                        .setDescription("Number of strikes to clear")
                        .setMinValue(1)
                        .setMaxValue(3)
                        .setRequired(false)
                )
        )

        // ==================================
        // FIRED
        // ==================================

        .addSubcommand(subcommand =>
            subcommand
                .setName("fired")
                .setDescription("Mark a staff member as fired")
                .addUserOption(option =>
                    option
                        .setName("user")
                        .setDescription("Staff member")
                        .setRequired(true)
                )
                .addStringOption(option =>
                    option
                        .setName("reason")
                        .setDescription("Reason for firing")
                        .setRequired(true)
                )
        ),


    async execute(interaction) {

        const subcommand =
            interaction.options.getSubcommand();

        const user =
            interaction.options.getUser("user");

        const data = loadData();

        // Create user record
        if (!data[user.id]) {
            data[user.id] = {
                strikes: 0,
                fired: false,
                history: []
            };
        }

        // Make sure old records have fired
        if (typeof data[user.id].fired !== "boolean") {
            data[user.id].fired = false;
        }

        if (!Array.isArray(data[user.id].history)) {
            data[user.id].history = [];
        }


        // ==========================================
        // STRIKE
        // ==========================================

        if (subcommand === "strike") {

            const reason =
                interaction.options.getString("reason");

            if (data[user.id].fired) {
                return interaction.reply({
                    content:
                        `❌ ${user} is already marked as **FIRED**.`,
                    ephemeral: true
                });
            }

            if (data[user.id].strikes >= 3) {

                return interaction.reply({
                    content:
                        `❌ ${user} already has **3 strikes**. They must be fired.`,
                    ephemeral: true
                });

            }

            data[user.id].strikes++;

            const strikeNumber =
                data[user.id].strikes;


            data[user.id].history.push({
                type: "strike",
                strike: strikeNumber,
                reason: reason,
                moderator: interaction.user.id,
                timestamp: Date.now()
            });


            // Automatically fire after 3rd strike
            if (strikeNumber >= 3) {

                data[user.id].fired = true;

                data[user.id].history.push({
                    type: "fired",
                    reason: "Reached 3 strikes",
                    moderator: interaction.user.id,
                    timestamp: Date.now()
                });

            }


            saveData(data);


            // ======================================
            // 3RD STRIKE / FIRED
            // ======================================

            if (strikeNumber >= 3) {

                const embed = new EmbedBuilder()

                    .setColor("#FF0000")

                    .setTitle("🔴 Staff Fired")

                    .setDescription(
                        `${user} has received **Strike 3/3** and is now **FIRED**.`
                    )

                    .addFields(
                        {
                            name: "👤 Staff Member",
                            value: `${user}`,
                            inline: true
                        },
                        {
                            name: "🔨 Strikes",
                            value: "3/3",
                            inline: true
                        },
                        {
                            name: "📕 Status",
                            value: "🔴 FIRED",
                            inline: true
                        },
                        {
                            name: "📝 Reason",
                            value: reason
                        },
                        {
                            name: "👮 Issued By",
                            value: `${interaction.user}`
                        }
                    )

                    .setTimestamp()

                    .setFooter({
                        text: "NSC | Staff Punishment System"
                    });


                return interaction.reply({
                    embeds: [embed]
                });
            }


            // ======================================
            // NORMAL STRIKE
            // ======================================

            const embed = new EmbedBuilder()

                .setColor("#8B0000")

                .setTitle("🔨 Staff Strike")

                .setDescription(
                    `${user} has received **Strike ${strikeNumber}/3**.`
                )

                .addFields(
                    {
                        name: "👤 Staff Member",
                        value: `${user}`,
                        inline: true
                    },
                    {
                        name: "🔨 Strikes",
                        value: `${strikeNumber}/3`,
                        inline: true
                    },
                    {
                        name: "📕 Status",
                        value: "🟢 Active",
                        inline: true
                    },
                    {
                        name: "📝 Reason",
                        value: reason
                    },
                    {
                        name: "👮 Issued By",
                        value: `${interaction.user}`
                    }
                )

                .setTimestamp()

                .setFooter({
                    text: "NSC | Staff Punishment System"
                });


            return interaction.reply({
                embeds: [embed]
            });
        }


        // ==========================================
        // CLEAR STRIKE
        // ==========================================

        if (subcommand === "clearstrike") {

            const amount =
                interaction.options.getInteger("amount") || 1;

            if (data[user.id].strikes <= 0) {

                return interaction.reply({
                    content:
                        `❌ ${user} has no strikes to clear.`,
                    ephemeral: true
                });

            }


            const oldStrikes =
                data[user.id].strikes;

            const removed =
                Math.min(amount, oldStrikes);

            data[user.id].strikes =
                oldStrikes - removed;


            // If they were fired because of 3 strikes,
            // clearing a strike removes the fired status.
            if (
                data[user.id].fired &&
                data[user.id].strikes < 3
            ) {
                data[user.id].fired = false;
            }


            data[user.id].history.push({
                type: "clearstrike",
                amount: removed,
                moderator: interaction.user.id,
                timestamp: Date.now()
            });


            saveData(data);


            const embed = new EmbedBuilder()

                .setColor("#00AA00")

                .setTitle("🟢 Strike Cleared")

                .setDescription(
                    `${removed} strike(s) have been cleared from ${user}.`
                )

                .addFields(
                    {
                        name: "👤 Staff Member",
                        value: `${user}`,
                        inline: true
                    },
                    {
                        name: "🔨 Remaining Strikes",
                        value: `${data[user.id].strikes}/3`,
                        inline: true
                    },
                    {
                        name: "📕 Status",
                        value: data[user.id].fired
                            ? "🔴 FIRED"
                            : "🟢 Active",
                        inline: true
                    },
                    {
                        name: "👮 Cleared By",
                        value: `${interaction.user}`
                    }
                )

                .setTimestamp()

                .setFooter({
                    text: "NSC | Staff Punishment System"
                });


            return interaction.reply({
                embeds: [embed]
            });
        }


        // ==========================================
        // FIRED
        // ==========================================

        if (subcommand === "fired") {

            const reason =
                interaction.options.getString("reason");


            if (data[user.id].fired) {

                return interaction.reply({
                    content:
                        `❌ ${user} is already marked as **FIRED**.`,
                    ephemeral: true
                });

            }


            data[user.id].fired = true;


            data[user.id].history.push({
                type: "fired",
                reason: reason,
                moderator: interaction.user.id,
                timestamp: Date.now()
            });


            saveData(data);


            const embed = new EmbedBuilder()

                .setColor("#FF0000")

                .setTitle("🔴 Staff Fired")

                .setDescription(
                    `${user} has been marked as **FIRED**.`
                )

                .addFields(
                    {
                        name: "👤 Staff Member",
                        value: `${user}`,
                        inline: true
                    },
                    {
                        name: "📕 Status",
                        value: "🔴 FIRED",
                        inline: true
                    },
                    {
                        name: "📝 Reason",
                        value: reason
                    },
                    {
                        name: "👮 Fired By",
                        value: `${interaction.user}`
                    }
                )

                .setTimestamp()

                .setFooter({
                    text: "NSC | Staff Punishment System"
                });


            return interaction.reply({
                embeds: [embed]
            });
        }
    }
};
