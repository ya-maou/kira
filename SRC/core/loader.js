//loader.js

import { REST,Routes, Collection } from'discord.js'
import fg from 'fast-glob'
import { useAppStore } from '@/store/app'

const updateSlashCommands = async(commands) => {
    const rest = new REST().setToken(process.env.TOKEN)

    const guildIds = [
        '986515567328505896', //my
        '1223820038885085281', //liber
        '866892665617645598', //1987
        '1244677125823270943',
        '1236307158426189914',//trash
    ];

    for (const guildId of guildIds) {
        try {
            const result = await rest.put(
                Routes.applicationGuildCommands(
                    process.env.APPLICATION_ID,
                    guildId,
                ),
                { body: commands },
            );
            console.log(`Commands updated for guild: ${guildId}`, result);
        } catch (error) {
            console.error(`Failed to update commands for guild: ${guildId}`, error);
        }
    }
};

export const loadCommands = async() => {
    const appStore = useAppStore()
    const commands = []
    const actions = new Collection()
    const files = await fg('./src/commands/**/index.js')
    for(const file of files){
    const cmd = await import(file)
    console.log(cmd.command)
    commands.push(cmd.command)
    actions.set(cmd.command.name, cmd.action)
    }
    
    await updateSlashCommands(commands)
    appStore.commandsActionMap = actions

    console.log(appStore.commandsActionMap)
}

export const loadEvents = async() => {
    const appStore = useAppStore()
    const client = appStore.client
    const files = await fg('./src/events/**/index.js')
    for(const file of files){
        const eventFile = await import(file)

        if(eventFile.event.once){
        client.once(
            eventFile.event.name,
            eventFile.action
            )
        }
        else {
            client.on(
                eventFile.event.name,
                eventFile.action
            )
        }
    }
}