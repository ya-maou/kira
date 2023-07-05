import { REST,Routes } from'discord.js'
import fg from 'fast-glob'

const updateSlashCommands = async(commands) => {
    const rest = new REST().setToken(process.env.TOKEN)
    const result = await rest.put(
        Routes.applicationGuildCommands(
            process.env.APPLICATION_ID,
            '986515567328505896',
        ),
        {
            body:commands,
        },
    )

    console.log(result)
}

export const loadCommands = async() => {
    const commands = []
    const files = await fg('./src/commands/**/index.js')
    for(const file of files){
    const cmd = await import(file)
    console.log(cmd.command)
    commands.push(cmd.command)
    }
    
    await updateSlashCommands(commands)
}