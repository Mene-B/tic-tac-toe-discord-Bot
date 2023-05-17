const {SlashCommandBuilder,EmbedBuilder,ButtonBuilder,ActionRowBuilder,ButtonStyle,Colors, channelLink} = require("discord.js");
const config = require("../config.json");
const {verify} = require("../util.js")

module.exports = {
    data: new SlashCommandBuilder()
    .setName("tictactoe")
    .setDescription("Starts a morpion game in the channel")
    .addUserOption(option =>{
        return option
        .setName("challenger")
        .setDescription("Enter the member against who you wnat to play")
        .setRequired(true)
    }),
    run: async(interaction)=>{
        const creator = interaction.member.user;
        const challenger = interaction.options.getUser("challenger");
        let counter = 0;
        const rows = [];
        for(let i=1;i<=3;i++){
            const buttons = [];
            for(let j=1;j<=3;j++){
                buttons.push(new ButtonBuilder()
                .setCustomId(j.toString()+";"+i.toString())
                .setLabel("▢")
                .setStyle(ButtonStyle.Secondary))
            }
            rows.push(new ActionRowBuilder()
            .addComponents(buttons))
        }
        
        console.log(rows)
        const message = await interaction.reply({content:`${creator}'s **turn**`,components:rows});
        const collector = message.createMessageComponentCollector({
            filter: () => true,
            time: 600000
        })
        const clicked = [[],[]]
        collector.on("collect", async(newInteraction) => {
            newInteraction.deferUpdate();
            const condition = (counter%2===0);
            const memberAuthorized = (condition) ? creator : challenger;
            if(newInteraction.member.user !== memberAuthorized){
                return //newInteraction.message.channel.send({content: `${newInteraction.member.user.username} can't click now !`, ephemeral: true})
            }
            clicked[(condition) ? 0 : 1].push(newInteraction.customId);
            const [x,y] = newInteraction.customId.split(";").map((e) => parseInt(e, 10));
            newInteraction.message.components[y-1].components[x-1].data.disabled = true;
            newInteraction.message.components[y-1].components[x-1].data.label = (condition) ? "◯" : "X";
            newInteraction.message.components[y-1].components[x-1].data.style = (condition) ? 1 : 4;
            console.log(clicked[(condition) ? 0 : 1])
            if(verify(clicked[(condition) ? 0 : 1])){
                newInteraction.message.components.forEach(element => {
                    element.components.forEach(button => {
                        button.data.disabled = true;
                    })
                });
                await newInteraction.message.edit({content:"The game is over",components: newInteraction.message.components})
                const embed = new EmbedBuilder()
                .setAuthor({
                    name: "Tic tac toe",
                    iconURL: newInteraction.message.author.avatarURL()
                })
                .setThumbnail(newInteraction.message.author.avatarURL())
                .setDescription(`**Congratulations** to ${memberAuthorized} for winning this tic tac toe match !\n\n**Against :** ${(condition) ? challenger : creator}`)
                .setColor(Colors.Blurple)
                return newInteraction.message.channel.send({embeds: [embed]});
            }
            
            message.edit({content:`${(condition) ? challenger : creator}'s **turn**`,components: newInteraction.message.components});
            if(clicked[1].length+clicked[0].length === 9){
                await newInteraction.message.edit({content:"The game is over"});
                const embed = new EmbedBuilder()
                .setAuthor({
                    name: "Tic tac toe",
                    iconURL: newInteraction.message.author.avatarURL()
                })
                .setThumbnail(newInteraction.message.author.avatarURL())
                .setDescription(`**Draw match**\n**Congratulations** to the challengers for this epic tic tac toe match !\n\n**Challengers : **${creator} **VS** ${challenger}`)
                .setColor(Colors.Blurple)
                return newInteraction.channel.send({embeds: [embed]});
            }
            counter++;
        })
    }
}
