import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  SlashCommandBuilder,
  type CommandInteraction,
  type ModalSubmitInteraction,
  WebhookClient,
} from "discord.js";
import { WEBHOOK_ID, WEBHOOK_TOKEN } from "../../secret";
import { fusianaOrId, fusianaOrName } from "../util/fusiana";
import { generateId } from "../util/genId";

export const Suretate = {
  data: new SlashCommandBuilder()
    .setName("suretate")
    .setDescription("スレ立て"),

  getModal: (interaction: CommandInteraction): ModalBuilder | undefined => {
    if (!interaction.isChatInputCommand()) return undefined;
    if (interaction.commandName !== "suretate") return undefined;

    const threadName = new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId("threadName")
        .setLabel("タイトル")
        .setStyle(TextInputStyle.Short)
        .setRequired(true),
    );
    const name = new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId("name")
        .setLabel("名前 (省略可)")
        .setStyle(TextInputStyle.Short)
        .setRequired(false),
    );
    const id = new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId("discordId")
        .setLabel("Discord ID (省略可)")
        .setStyle(TextInputStyle.Short)
        .setRequired(false),
    );
    const body = new ActionRowBuilder<TextInputBuilder>().addComponents(
      new TextInputBuilder()
        .setCustomId("body")
        .setLabel("内容")
        .setStyle(TextInputStyle.Paragraph),
    );

    const modal = new ModalBuilder()
      .setCustomId("suretate")
      .setTitle("スレッドを立てる")
      .addComponents(threadName, name, id, body);

    return modal;
  },

  postModal: async (interaction: ModalSubmitInteraction) => {
    if (!interaction.isModalSubmit()) return;
    if (interaction.channelId === null) return;

    const threadName = interaction.fields.getTextInputValue("threadName");
    const name = interaction.fields.getTextInputValue("name");
    const id = interaction.fields.getTextInputValue("discordId");
    const body = interaction.fields.getTextInputValue("body");

    const rawName = interaction.user.username;
    const rawId = interaction.user.id;

    try {
      const response = new WebhookClient({
        id: WEBHOOK_ID,
        token: WEBHOOK_TOKEN,
      }).send({
        content: body,
        threadName: threadName,
        username: `0001 ${fusianaOrName(name, rawName) || "名無しさん"} ID: ${fusianaOrId(name, rawId, id) || generateId(interaction.user.username)}`,
      });

      console.log("Suretate Modal is sent");

      interaction.deferUpdate();
    } catch (e) {
      console.error("Webhook error");
      console.error(e);
    }
  },
};
