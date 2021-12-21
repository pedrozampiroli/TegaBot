import DiscordJs, { Intents, TextChannel } from "discord.js";
import dotenv from "dotenv";
import express from "express";
import api from "./service/api";
const config = require("./config.json");
const app = express();
dotenv.config();

app.use(express.json());
app.listen(process.env.PORT);

const client = new DiscordJs.Client({
  intents: [Intents.FLAGS.GUILDS, Intents.FLAGS.GUILD_MESSAGES],
});

app.post("/receivecall", async (req, res) => {
  const { data, cliente, nroChamado, mensagem, prioridade } = req.body;
  let channel = client.channels.cache.get("915427908821069875");
  let embed = new DiscordJs.MessageEmbed()
    .setColor(prioridade.startsWith('BAIXA') ? '#33bd38': prioridade.startsWith('MEDIA') ? '#e6cf00' : prioridade.startsWith('ALTA') ? '#6f03fc' : prioridade.startsWith('CR') ? '#cc0000' : '#33bd38')
    .setTitle(`**Dados do chamado ${nroChamado}** \n**Cliente:** ${cliente} \n**Prioridade:** ${prioridade}`)
    .setDescription(mensagem)
    .setTimestamp();

  await (channel as TextChannel).send({ embeds: [embed] });
  res.send("ok");
});

client.on("ready", () => {
  console.log("The bot is ready");
});

client.on("messageCreate", (message) => {
  if (message.author.bot) return;
  if (!message.content.toLowerCase().startsWith(config.prefix)) return;

  const args = message.content.trim().slice(config.prefix).split(/ +/g);
  const command = args.shift();
  const parmsCom = args.join(" ");

  if (command === config.prefix +"chamado") {
    const req = { chamadoId: parmsCom };
    api.post(`postDadosChamado`, req).then((response) => {
      const { ClienteNome, Prioridade, Mensagem } = response.data;
      message.reply({
        content: `**Dados do chamado ${parmsCom}** \n**Cliente:** ${ClienteNome} \n**Prioridade:** ${Prioridade} \n**Mensagem:** ${Mensagem}`,
      });
    });
  }
});

client.login(process.env.TOKEN);
