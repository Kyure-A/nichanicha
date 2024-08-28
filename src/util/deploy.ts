import { Kakiko } from "../commands/kakiko";
import { REST, Routes } from "discord.js";
import { APP_ID, GUILD_ID, DISCORD_TOKEN } from "../../secret";

const commands = [
    Kakiko.data.toJSON()
]

const main = async () => {
    const rest = new REST({ version: '10' }).setToken(DISCORD_TOKEN)
    
    try {
        await rest.put(Routes.applicationGuildCommands(APP_ID, GUILD_ID), { body: commands })

        console.log("Commands are deployed.")
    } catch (e) {
        console.error("Error occured: ");
        console.error(e);
    }
}

main()
