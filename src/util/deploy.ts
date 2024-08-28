import { Kakiko } from "../commands/kakiko";
import { REST, Routes } from "discord.js";

const commands = [
    Kakiko.data.toJSON()
]

const main = async () => {
    const rest = new REST({ version: '10' }).setToken(process.env.token!)
    
    try {
        await rest.put(Routes.applicationGuildCommands(process.env.application_id!, process.env.guild_id!), { body: commands })

        console.log("Commands are deployed.")
    } catch (e) {
        console.error("Error occured: ");
        console.error(e);
    }
}
