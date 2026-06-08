import 'dotenv/config';
import { REST } from '@discordjs/rest';
import { Routes } from 'discord-api-types/v10';
import { SlashCommandBuilder } from 'discord.js';

const token = process.env.DISCORD_TOKEN;
let clientId = process.env.CLIENT_ID?.trim();
const guildId = process.env.GUILD_ID?.trim();

if (!token) {
  console.error('Missing DISCORD_TOKEN in environment.');
  process.exit(1);
}

if (!clientId || clientId === 'your_application_client_id_here') {
  clientId = undefined;
}

const rest = new REST({ version: '10' }).setToken(token);

async function resolveClientId() {
  if (clientId) return clientId;
  try {
    const application = await rest.get(Routes.oauth2CurrentApplication());
    return application?.id || application?.application?.id;
  } catch (error) {
    console.error('Could not resolve application client ID from the bot token:', error);
    return null;
  }
}

const commands = [
  new SlashCommandBuilder()
    .setName('infraction')
    .setDescription('Issue an infraction to a member.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The member to warn')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('Role to assign')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason for the infraction')
        .setRequired(true)),
  new SlashCommandBuilder()
    .setName('promote')
    .setDescription('Promote a member by assigning a new role.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The member to promote')
        .setRequired(true))
    .addRoleOption(option =>
      option.setName('role')
        .setDescription('The new rank role')
        .setRequired(true)),
  new SlashCommandBuilder()
    .setName('assign')
    .setDescription('Assign a task to a member.')
    .addUserOption(option =>
      option.setName('user')
        .setDescription('The member to assign')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('reason')
        .setDescription('Reason or description for the assignment')
        .setRequired(true))
    .addStringOption(option =>
      option.setName('deadline')
        .setDescription('Deadline for the assignment')
        .setRequired(true)),
].map(command => command.toJSON());

(async () => {
  try {
    const resolvedClientId = await resolveClientId();
    if (!resolvedClientId) {
      console.error('Missing CLIENT_ID and could not resolve it from the bot token.');
      process.exit(1);
    }

    if (guildId) {
      console.log(`Registering commands to guild ${guildId}...`);
      await rest.put(
        Routes.applicationGuildCommands(resolvedClientId, guildId),
        { body: commands }
      );
      console.log('Guild commands registered successfully.');
    } else {
      console.log('Registering global commands...');
      await rest.put(
        Routes.applicationCommands(resolvedClientId),
        { body: commands }
      );
      console.log('Global commands registered successfully.');
    }
  } catch (error) {
    console.error('Failed to register commands:', error);
  }
})();
