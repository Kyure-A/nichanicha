import { Client, Events, GatewayIntentBits, type Interaction, type CacheType } from "discord.js";
import { Kakiko } from "./commands/kakiko";
import { DISCORD_TOKEN } from "../secret";

const client: Client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent, GatewayIntentBits.GuildWebhooks, GatewayIntentBits.GuildMembers] });

const onClientReady = () => {
    console.log("Client is ready.")
}

const onKakiko = async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return;

    try {
        const modal = Kakiko.getModal(interaction);

        if (modal === undefined) throw Error("Interaction is invalid.")
        
        await interaction.showModal(modal);
    } catch (e) {
        console.error(e);
        
        if (interaction.replied || interaction.deferred) {
            await interaction.followUp({ content: "返信または応答準備中にエラーが発生しました", ephemeral: true });
        }

        else {
            await interaction.reply({ content: "何もできませんでした", ephemeral: true });
        }
    }
}

const onKakikoModal = async (interaction: Interaction<CacheType>) => {
    if (!interaction.isModalSubmit()) return;
    
    try {
        await Kakiko.postModal(interaction);
        
    } catch (e) {
        console.error(e);
    }
}

const onInteractionCreate = async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName === Kakiko.data.name) await onKakiko(interaction);
}

const onModalCreate = async (interaction: Interaction<CacheType>) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.customId === Kakiko.data.name) await onKakikoModal(interaction);
}

client.once(Events.ClientReady, onClientReady);

// Slash commands
client.on(Events.InteractionCreate, onInteractionCreate);

// Modal
client.on(Events.InteractionCreate, onModalCreate)

client.login(DISCORD_TOKEN)
