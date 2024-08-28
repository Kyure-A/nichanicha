import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder, type Interaction, InteractionResponse, InteractionType, CommandInteraction } from "discord.js";

export const Kakiko = {
    data: new SlashCommandBuilder()
        .setName("kakiko")
        .setDescription("書き込み")
        .addStringOption(o => o.setName("name").setDescription("名前 (省略可)").setRequired(false))
        .addStringOption(o => o.setName("discordId").setDescription("Discord ID (省略可)").setRequired(false)),

    getModal: (interaction: CommandInteraction): ModalBuilder | undefined  => {
        if (!interaction.isChatInputCommand()) return undefined;
        if (interaction.commandName !== "kakiko") return undefined;

        const name = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId("name").setLabel("名前 (省略可)").setStyle(TextInputStyle.Short));
        const id = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId("discordId").setLabel("Discord ID (省略可)").setStyle(TextInputStyle.Short));
        const body = new ActionRowBuilder<TextInputBuilder>().addComponents(new TextInputBuilder().setCustomId("body").setLabel("内容").setStyle(TextInputStyle.Paragraph));
        
        const modal = new ModalBuilder().setCustomId("kakiko").setTitle("書き込み").addComponents(name, id, body);

        return modal;
    }
}
