import { fetch } from "bun";
import {
  ActionRowBuilder,
  ModalBuilder,
  TextInputBuilder,
  TextInputStyle,
  SlashCommandBuilder,
  type CommandInteraction,
  type ModalSubmitInteraction,
  ChannelType,
} from "discord.js";
import { WEBHOOK_URL } from "../../secret";
import { generateId } from "../util/genId";

export const Kakiko = {
  data: new SlashCommandBuilder()
    .setName("kakiko")
    .setDescription("書き込み")
    .addStringOption((o) =>
      o.setName("name").setDescription("名前 (省略可)").setRequired(false),
    )
    .addStringOption((o) =>
      o
        .setName("discord_id")
        .setDescription("Discord ID (省略可)")
        .setRequired(false),
    ),

  getModal: (interaction: CommandInteraction): ModalBuilder | undefined => {
    if (!interaction.isChatInputCommand()) return undefined;
    if (interaction.commandName !== "kakiko") return undefined;

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
      .setCustomId("kakiko")
      .setTitle("書き込み")
      .addComponents(name, id, body);

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
      const fusianaStr = ["fusianasan", "山崎渉"];
      const isFusiana = !!fusianaStr.filter((x) => x === name).length;

      return isFusiana ? rawName : name;
    })(name);

    const fusianaOrId = ((name: string) => {
      const fusianaStr = ["fusianasan", "山崎渉"];
      const isFusiana = !!fusianaStr.filter((x) => x === name).length;

      return isFusiana ? rawId : id;
    })(name);

    const threadId = (() => {
      if (!interaction.channel || !interaction.channel.isThread()) return "";
      return interaction.channel.id;
    })();

    const url = (() => {
      const u = new URL(WEBHOOK_URL);

      u.searchParams.set("thread_id", threadId);
      return u.href;
    })();

    const messageCount = (async () => {
      if (interaction.guild === null) return -1;
      const thread = await interaction.guild.channels.fetch(threadId);
      if (thread === null || thread.type !== ChannelType.PublicThread)
        return -1;
      const count = thread.messageCount;
      if (count === null) return -1;
      return count + 1;
    })();

    const ketaAwase = (num: number) => {
      const strNum = num.toString();
      return "0000".substring(strNum.length) + strNum;
    };

    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          username: `${ketaAwase(await messageCount)} ${fusianaOrName || "名無しさん"} ID: ${fusianaOrId || generateId(interaction.user.username)}`,
          content: body,
        }),
      });

      console.log("Modal is sent");

      interaction.deferUpdate();

      console.log(await response.json());
    } catch (e) {
      console.error("Webhook error");
      console.error(e);
    }
  },
};
