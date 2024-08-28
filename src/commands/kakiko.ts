import { fetch } from "bun";
import { ActionRowBuilder, ModalBuilder, TextInputBuilder, TextInputStyle, SlashCommandBuilder, type Interaction, InteractionResponse, InteractionType, CommandInteraction, ModalSubmitInteraction } from "discord.js";
import { WEBHOOK_URL } from "../../secret";

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
    },

    postModal: async (interaction: ModalSubmitInteraction) => {
        if (!interaction.isModalSubmit()) return;
        if (interaction.channelId === null) return;
        
        const name = interaction.fields.getTextInputValue("name");
        const id = interaction.fields.getTextInputValue("discordId");
        const body = interaction.fields.getTextInputValue("body");

        const rawName = interaction.user.username;
        const rawId = interaction.user.id;

        const fusianaOrName = ((name: string) => {
            const fusianaStr = ["fusianasan", "山崎渉"]
            const isFusiana = !!fusianaStr.filter(x => x === name).length;

            return isFusiana ? rawName : name;
        })(name);

        const fusianaOrId = ((name: string) => {
            const fusianaStr = ["fusianasan", "山崎渉"]
            const isFusiana = !!fusianaStr.filter(x => x === name).length;

            return isFusiana ? rawId : id;
        })(name);
        
        const url = (() => {
            const u = new URL(WEBHOOK_URL);

            const threadId = (() => {
                if (!interaction.channel || !interaction.channel.isThread()) return "";
                return interaction.channel.id;
            })();
            
            u.searchParams.set("thread_id", threadId)
            return u.href;
        })(); 

        try {
            await fetch(url, {
                method: "POST",
                body: JSON.stringify({
                    username: `${fusianaOrName || "名無しさん"} ID: ${fusianaOrId}`,
                    content: body
                })
            })
            
        } catch (e) {
            console.error("Webhook error")
            console.error(e);
        }
    }
}
