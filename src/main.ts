import { Client, Events, GatewayIntentBits, type Interaction, type CacheType } from "discord.js";
import { Kakiko } from "./commands/kakiko";

const client: Client = new Client({ intents: [GatewayIntentBits.Guilds, GatewayIntentBits.GuildMessages, GatewayIntentBits.MessageContent] });

const onClientReady = () => {
    console.log("Client is ready.")
}

const onKakiko = async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return;
    
    try {
        const modal = Kakiko.getModal(interaction);

        if (modal === undefined) throw Error("Interaction is unvalid.")
        
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

const onInteractionCreate = async (interaction: Interaction<CacheType>) => {
    if (!interaction.isChatInputCommand()) return;
    if (interaction.commandName !== Kakiko.data.name) await onKakiko(interaction);
}

client.once(Events.ClientReady, onClientReady);
client.on(Events.InteractionCreate, onInteractionCreate);
