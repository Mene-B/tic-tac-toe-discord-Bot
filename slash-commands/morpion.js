const {SlashCommandBuilder,EmbedBuilder,ButtonBuilder,ActionRowBuilder,ButtonStyle,Colors} = require("discord.js");
const config = require("../config.json");

module.exports = {
    data: new SlashCommandBuilder()
    .setName("morpiongame")
    .setDescription("Starts a morpion game in the channel"),
    run: (interaction)=>{
        const buttons = [];
        for(let i = 0;i<9;i++){
            if(i%3===0){
                buttons.push([]);
            }
            const button = new ButtonBuilder()
            .setCustomId(i.toString())
            .setLabel("▢")
            .setStyle(ButtonStyle.Secondary)
            buttons.at(-1).push(button)
        }
        const rows = [];
        for(let i=0;i<3;i++){
            rows.push(new ActionRowBuilder()
            .addComponents(buttons[i]))
        }
        
        console.log(rows)
        return interaction.reply({components:rows});
    }
}