const {
    SlashCommandBuilder,
    EmbedBuilder
} = require("discord.js");

const CHIEF_OF_STAFF_ROLE = "1530874760110805082";

const STRIKE_1_ROLE = "1511597383983829093";
const STRIKE_2_ROLE = "1511597454573961316";
const STRIKE_3_ROLE = "1511597513822572644";
const FIRED_ROLE = "1526290329270223008";

const LOG_CHANNEL_ID = "1530207356552482896";

module.exports = {
    data: new SlashCommandBuilder()
        .setName("staffpunish")
        .setDescription("Punish a staff member.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("Staff member to punish.")
                .setRequired(true)
        )
        .addStringOption(option =>
            option
                .setName("action")
                .setDescription("Choose the punishment.")
                .setRequired(true)
                .addChoices(
                    {
                        name: "Strike 1",
                        value: "strike1"
                    },
                    {
                        name: "Strike 2",
                        value: "strike2"
                    },
                    {
                        name: "Strike 3",
                        value: "strike3"
                    },
                    {
                        name: "Fired",
                        value: "fired"
                    }
                )
        )
        .addStringOption(option =>
            option
                .setName("reason")
                .setDescription("Reason for the punishment.")
                .setRequired(true)
        )
        .addAttachmentOption(option =>
            option
                .setName("proof")
                .setDescription("Optional proof.")
                .setRequired(false)
        ),

    async execute(interaction) {

        // CHIEF OF STAFF ONLY
        if (
            !interaction.member.roles.cache.has(
                CHIEF_OF_STAFF_ROLE
            )
        ) {
            return interaction.reply({
                content:
                    "You do not have permission to use this command.",
                ephemeral: true
            });
        }

        const user =
            interaction.options.getUser("user");

        const action =
            interaction.options.getString("action");

        const reason =
            interaction.options.getString("reason");

        const proof =
            interaction.options.getAttachment("proof");

        // GET MEMBER
        let member;

        try {
            member =
                await interaction.guild.members.fetch(
                    user.id
                );
        } catch {
            return interaction.reply({
                content:
                    "That user is not in this server.",
                ephemeral: true
            });
        }

        // REMOVE OLD PUNISHMENT ROLES
        try {
            await member.roles.remove([
                STRIKE_1_ROLE,
                STRIKE_2_ROLE,
                STRIKE_3_ROLE,
                FIRED_ROLE
            ]);
        } catch (error) {
            console.error(
                "Failed to remove old punishment roles:",
                error
            );

            return interaction.reply({
                content:
                    "I could not remove the previous punishment roles. Check the bot's role hierarchy.",
                ephemeral: true
            });
        }

        // SELECT NEW ROLE
        let punishmentRole;
        let punishmentName;

        switch (action) {

            case "strike1":
                punishmentRole = STRIKE_1_ROLE;
                punishmentName = "Strike 1";
                break;

            case "strike2":
                punishmentRole = STRIKE_2_ROLE;
                punishmentName = "Strike 2";
                break;

            case "strike3":
                punishmentRole = STRIKE_3_ROLE;
                punishmentName = "Strike 3";
                break;

            case "fired":
                punishmentRole = FIRED_ROLE;
                punishmentName = "Fired";
                break;

            default:
                return interaction.reply({
                    content:
                        "Invalid punishment.",
                    ephemeral: true
                });
        }

        // ADD NEW ROLE
        try {
            await member.roles.add(
                punishmentRole
            );
        } catch (error) {
            console.error(
                "Failed to add punishment role:",
                error
            );

            return interaction.reply({
                content:
                    "I could not add the punishment role. Make sure the bot's role is above the punishment roles.",
                ephemeral: true
            });
        }

        // CREATE LOG EMBED
        const embed =
            new EmbedBuilder()
                .setTitle("STAFF PUNISHMENT")
                .setDescription(
                    "A staff punishment has been issued."
                )
                .addFields(
                    {
                        name: "Staff Member",
                        value:
                            `${user}\n\`${user.id}\``,
                        inline: false
                    },
                    {
                        name: "Punishment",
                        value:
                            punishmentName,
                        inline: true
                    },
                    {
                        name: "Issued By",
                        value:
                            `${interaction.user}`,
                        inline: true
                    },
                    {
                        name: "Reason",
                        value:
                            reason,
                        inline: false
                    }
                )
                .setTimestamp()
                .setFooter({
                    text:
                        "NSC Staff Punishment System"
                });

        // ADD PROOF
        if (proof) {

            embed.addFields({
                name: "Proof",
                value:
                    `[View Proof](${proof.url})`,
                inline: false
            });

            if (
                proof.contentType &&
                proof.contentType.startsWith("image/")
            ) {
                embed.setImage(proof.url);
            }
        }

        // GET LOG CHANNEL
        const logChannel =
            interaction.guild.channels.cache.get(
                LOG_CHANNEL_ID
            );

        if (!logChannel) {
            return interaction.reply({
                content:
                    "Punishment applied, but the punishment log channel was not found.",
                ephemeral: true
            });
        }

        // SEND LOG
        try {
            await logChannel.send({
                embeds: [embed]
            });
        } catch (error) {
            console.error(
                "Failed to send punishment log:",
                error
            );
        }

        // CONFIRMATION
        return interaction.reply({
            content:
                `Successfully applied **${punishmentName}** to ${user}.\nReason: ${reason}`,
            ephemeral: true
        });
    }
};
