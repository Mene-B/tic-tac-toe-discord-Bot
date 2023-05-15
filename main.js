const Discord = require("discord.js");
const client = new Discord.Client({intents: [
    Discord.GatewayIntentBits.Guilds,
    Discord.GatewayIntentBits.GuildMembers,
    Discord.GatewayIntentBits.GuildMessages,
    Discord.GatewayIntentBits.MessageContent,
    Discord.GatewayIntentBits.GuildMessageTyping,
]});
const config = require("./config.json");
const fs = require("fs");

client.login(config.token);

client.on("ready",()=>{
    console.log("Bot ready !")
})

const commands = fs.readdirSync("slash-commands").map(commandFile=>{
    const command = require("./slash-commands/"+commandFile);
    return {name: command.data.name, run: command.run}
});

console.log(commands);
client.on('interactionCreate', interaction=>{
    if(interaction.isCommand()){
        console.log(interaction.commandName);
        const cmd = commands.find(cmd=>cmd.name === interaction.commandName)
        cmd.run(interaction);
    }
})
