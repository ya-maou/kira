import { REST, Routes, Collection } from 'discord.js';
import fg from 'fast-glob';
import { useAppStore } from '@/store/app';

const updateSlashCommands = async (commands) => {
    const rest = new REST().setToken(process.env.TOKEN);

    const guildIds = [
        '986515567328505896',    // F&M
        '1223820038885085281',   // C&M
        '866892665617645598',    // 1987BAND
        '1244677125823270943',
        '1236307158426189914',   // David&Dream
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
            // console.log(`Commands updated for guild: ${guildId}`, result);
        } catch (error) {
            console.error(`Failed to update commands for guild: ${guildId}`, error);
        }
    }
};

export const loadCommands = async () => {
    const appStore = useAppStore();
    const commands = [];
    const actions = new Collection();
    const files = await fg('./src/commands/**/index.js');
    
    for (const file of files) {
        const cmd = await import(file);

        // Check for the `default` property, which contains the actual command
        // const command = cmd.default?.data;
        // const action = cmd.default?.execute;

        if (cmd.command && cmd.action) {
            commands.push(cmd.command.toJSON()); // Use .toJSON() for proper registration
            actions.set(cmd.command.name, cmd.action);
            // console.log(`Loaded command: ${cmd.command.name}`);
        } else {
            console.error(`Invalid command structure in file: ${file}`);
        }
    }

    await updateSlashCommands(commands);
    appStore.commandsActionMap = actions;
    console.log(appStore.commandsActionMap);
};

export const loadEvents = async () => {
    const appStore = useAppStore();
    const client = appStore.client;
    const files = await fg('./src/events/**/index.js');

    for (const file of files) {
        const eventFile = await import(file);

        if (eventFile.event && eventFile.action) {
            if (eventFile.event.once) {
                client.once(eventFile.event.name, eventFile.action);
            } else {
                client.on(eventFile.event.name, eventFile.action);
            }
            console.log(`Loaded event: ${eventFile.event.name}`);
        } else {
            console.error(`Invalid event structure in file: ${file}`);
        }
    }
};
