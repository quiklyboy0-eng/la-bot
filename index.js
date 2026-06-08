import 'dotenv/config';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import { Client, GatewayIntentBits, EmbedBuilder } from 'discord.js';

const token = process.env.DISCORD_TOKEN;
const __dirname = path.dirname(fileURLToPath(import.meta.url));

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
__dirname
function getLocalImage(filename) {
  const assetPath = path.join(process.cwd(), 'assets', filename);
  return fs.existsSync(assetPath) ? assetPath : null;
}

function buildEmbed({ title, color, description, fields, footer, imageUrl }) {
  const embed = new EmbedBuilder()
    .setTitle(title)
    .setColor(color)
    .setDescription(description)
    .addFields(fields)
    .setFooter({ text: footer })
    .setTimestamp();

  if (imageUrl) {
    embed.setImage(imageUrl);
  }

  return embed;
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

  try {
    switch (interaction.commandName) {
      case 'infraction': {
        const target = interaction.options.getUser('user', true);
        const targetMember = interaction.options.getMember('user') || await interaction.guild.members.fetch(target.id);
        const role = interaction.options.getRole('role', true);
        const reason = interaction.options.getString('reason', true);
        const assignedRoleName = `${role}`;

        if (targetMember) {
          try {
            await targetMember.roles.add(role);
          } catch (error) {
            console.error('Failed to assign role:', error);
          }
        }

        const imagePath = getLocalImage('infraction.png');
        const embed = buildEmbed({
          title: '⚠️ La Sombra Roja Infraction',
          color: 0x8B0000,
          description: `An infraction has been recorded for ${target}.`,
          fields: [
            { name: 'Target', value: `${target}`, inline: true },
            { name: 'Role', value: assignedRoleName, inline: true },
            { name: 'Reason', value: reason, inline: false },
            { name: 'Issued by', value: `${interaction.user}`, inline: true }
          ],
          footer: `Issued by ${interaction.user.tag}`,
          imageUrl: imagePath ? 'attachment://infraction.png' : null
        });

        const replyOptions = { embeds: [embed] };
        if (imagePath) replyOptions.files = [{ attachment: imagePath, name: 'infraction.png' }];

        await interaction.reply(replyOptions);
        break;
      }
      case 'promote': {
        const target = interaction.options.getUser('user', true);
        const role = interaction.options.getRole('role', true);

        const imagePath = getLocalImage('promotion.png');
        const embed = buildEmbed({
          title: '🌹 Promotion - La Sombra Roja',
          color: 0xFF0000,
          description: `A promotion has been granted to ${target}.`,
          fields: [
            { name: 'Member', value: `${target}`, inline: true },
            { name: 'New Rank', value: `${role}`, inline: true },
            { name: 'Promoted by', value: `${interaction.user}`, inline: true }
          ],
          footer: `Promoted by ${interaction.user.tag}`,
          imageUrl: imagePath ? 'attachment://promotion.png' : null
        });

        const replyOptions = { embeds: [embed] };
        if (imagePath) replyOptions.files = [{ attachment: imagePath, name: 'promotion.png' }];

        await interaction.reply(replyOptions);
        break;
      }
      case 'assign': {
        const target = interaction.options.getUser('user', true);
        const reason = interaction.options.getString('reason', true);
        const deadline = interaction.options.getString('deadline', true);

        const imagePath = getLocalImage('assignment.png');
        const embed = buildEmbed({
          title: '📋 Assignment - La Sombra Roja',
          color: 0x8B0000,
          description: `A new task has been assigned to ${target}.`,
          fields: [
            { name: 'Member', value: `${target}`, inline: true },
            { name: 'Reason', value: reason, inline: false },
            { name: 'Deadline', value: deadline, inline: true },
            { name: 'Assigned by', value: `${interaction.user}`, inline: true }
          ],
          footer: `Assigned by ${interaction.user.tag}`,
          imageUrl: imagePath ? 'attachment://assignment.png' : null
        });

        const replyOptions = { embeds: [embed] };
        if (imagePath) replyOptions.files = [{ attachment: imagePath, name: 'assignment.png' }];

        await interaction.reply(replyOptions);
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
