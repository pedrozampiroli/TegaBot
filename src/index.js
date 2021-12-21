"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const discord_js_1 = __importStar(require("discord.js"));
const dotenv_1 = __importDefault(require("dotenv"));
const express_1 = __importDefault(require("express"));
const api_1 = __importDefault(require("./service/api"));
const config = require("./config.json");
const app = (0, express_1.default)();
dotenv_1.default.config();
app.use(express_1.default.json());
app.listen(process.env.PORT);
const client = new discord_js_1.default.Client({
    intents: [discord_js_1.Intents.FLAGS.GUILDS, discord_js_1.Intents.FLAGS.GUILD_MESSAGES],
});
app.post("/receivecall", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { data, cliente, nroChamado, mensagem, prioridade } = req.body;
    let channel = client.channels.cache.get("915427908821069875");
    let embed = new discord_js_1.default.MessageEmbed()
        .setColor(prioridade.startsWith('BAIXA') ? '#33bd38' : prioridade.startsWith('MEDIA') ? '#e6cf00' : prioridade.startsWith('ALTA') ? '#6f03fc' : prioridade.startsWith('CR') ? '#cc0000' : '#33bd38')
        .setTitle(`**Dados do chamado ${nroChamado}** \n**Cliente:** ${cliente} \n**Prioridade:** ${prioridade}`)
        .setDescription(mensagem)
        .setTimestamp();
    yield channel.send({ embeds: [embed] });
    res.send("ok");
}));
client.on("ready", () => {
    console.log("The bot is ready");
});
client.on("messageCreate", (message) => {
    if (message.author.bot)
        return;
    if (!message.content.toLowerCase().startsWith(config.prefix))
        return;
    const args = message.content.trim().slice(config.prefix).split(/ +/g);
    const command = args.shift();
    const parmsCom = args.join(" ");
    if (command === config.prefix + "chamado") {
        const req = { chamadoId: parmsCom };
        api_1.default.post(`postDadosChamado`, req).then((response) => {
            const { ClienteNome, Prioridade, Mensagem } = response.data;
            message.reply({
                content: `**Dados do chamado ${parmsCom}** \n**Cliente:** ${ClienteNome} \n**Prioridade:** ${Prioridade} \n**Mensagem:** ${Mensagem}`,
            });
        });
    }
});
client.login(process.env.TOKEN);
