const {
    SlashCommandBuilder,
    PermissionFlagsBits,
    EmbedBuilder
} = require("discord.js");

// ==========================================
// ROLE IDS
// ==========================================

const CHIEF_OF_STAFF_ROLE = "1530874760110805082";

const STRIKE_1_ROLE = "1511597383983829093";
const STRIKE_2_ROLE = "1511597454573961316";
const STRIKE_3_ROLE = "1511597513822572644";

const FIRED_ROLE = "1526290329270223008";

// ==========================================
// LOG CHANNEL
// ==========================================

const PUNISHMENT_LOG_CHANNEL =
    "1530207356552482896";

// ==========================================
// COMMAND
// ==========================================

module.exports = {

    data: new SlashCommandBuilder()
        .setName("staffpunish")
        .setDescription("Punish a staff member.")
        .addUserOption(option =>
            option
                .setName("user")
                .setDescription("The staff member being punished.")
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
                .setDescription("Optional proof or evidence.")
                .setRequired(false)
        ),

    async execute(interaction) {

        // ==========================================
        // CHIEF OF STAFF CHECK
        // ==========================================

        if (
           
