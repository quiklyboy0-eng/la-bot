import 'dotenv/config';
import { Client, GatewayIntentBits, PermissionFlagsBits, EmbedBuilder } from 'discord.js';

const token = process.env.DISCORD_TOKEN;

if (!token) {
  console.error('Missing DISCORD_TOKEN in environment.');
  process.exit(1);
}

const client = new Client({ intents: [GatewayIntentBits.Guilds] });

const PROMOTE_ASSIGN_ROLE = '1513284790005268540';
const INFRACTION_ROLES = ['1513284790005268540', '1513284578821800257'];

function formatDeadline(deadline) {
  if (!deadline) return 'No deadline';
  const parsed = new Date(deadline);
  if (!isNaN(parsed.valueOf())) {
    return parsed.toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' });
  }
  return deadline;
}

function hasRequiredRole(member, allowedRoles) {
  return member.roles?.cache?.some(role => allowedRoles.includes(role.id));
}

client.once('ready', () => {
  console.log(`Logged in as ${client.user.tag}`);
});

client.on('interactionCreate', async interaction => {
  if (!interaction.isChatInputCommand()) return;

  const member = interaction.member;
  const commandName = interaction.commandName;
  const allowedRoles = commandName === 'infraction' ? INFRACTION_ROLES : [PROMOTE_ASSIGN_ROLE];

  if (!hasRequiredRole(member, allowedRoles)) {
    return interaction.reply({ content: 'You do not have permission to use this command.', ephemeral: true });
  }

  const now = new Date();

  try {
    switch (interaction.commandName) {
      case 'infraction': {
        const target = interaction.options.getUser('user', true);
        const type = interaction.options.getString('type', true);
        const reason = interaction.options.getString('reason', true);

        const embed = new EmbedBuilder()
          .setTitle('⚠️ La Sombra Roja Infraction')
          .setColor(0x660000)
          .addFields(
            { name: 'Target', value: `${target}`, inline: false },
            { name: 'Type', value: type, inline: false },
            { name: 'Reason', value: reason, inline: false }
          )
          .setFooter({ text: `Issued by ${interaction.user.tag}` })
          .setTimestamp(now);

        await interaction.reply({ embeds: [embed] });
        break;
      }
      case 'promote': {
        const target = interaction.options.getUser('user', true);
        const role = interaction.options.getRole('role', true);

        const embed = new EmbedBuilder()
          .setTitle('🌹 Promotion - La Sombra Roja')
          .setColor(0xFF0000)
          .addFields(
            { name: 'Member', value: `${target}`, inline: false },
            { name: 'New Rank', value: `${role}`, inline: false }
          )
          .setFooter({ text: `Promoted by ${interaction.user.tag}` })
          .setTimestamp(now);

        await interaction.reply({ embeds: [embed] });
        break;
      }
      case 'assign': {
        const target = interaction.options.getUser('user', true);
        const task = interaction.options.getString('task', true);
        const deadline = interaction.options.getString('deadline');

        const embed = new EmbedBuilder()
          .setTitle('📋 Assignment - La Sombra Roja')
          .setColor(0x660000)
          .addFields(
            { name: 'Member', value: `${target}`, inline: false },
            { name: 'Task', value: task, inline: false },
            { name: 'Deadline', value: formatDeadline(deadline), inline: false }
          )
          .setFooter({ text: `Assigned by ${interaction.user.tag}` })
          .setTimestamp(now);

        await interaction.reply({ embeds: [embed] });
        break;
      }
      default:
        await interaction.reply({ content: 'Unknown command.', ephemeral: true });
    }
  } catch (error) {
    console.error(error);
    if (interaction.replied || interaction.deferred) {
      await interaction.editReply({ content: 'An error occurred while running this command.' });
    } else {
      await interaction.reply({ content: 'An error occurred while running this command.', ephemeral: true });
    }
  }
});

client.login(token);
