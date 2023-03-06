const Discord = require('discord.js');
const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const {Configuration, OpenAIApi} = require("openai");

module.exports = {
    name: "fix",
    category: "Information",
    aliases: ["f"],
    cooldown: 30,
    usage: "fix",
    description: "Ask AI to fix your code",
    run: async (message) => {
    try{
        const apiConfig = new Configuration({
            apiKey: config.openaikey,
        });
        const openai = new OpenAIApi(apiConfig);
        message.channel.send(`What language is your code in?<@${message.author.id}>`);
        const filter1 = m => m.author.id === message.author.id;
        const collected1 = await message.channel.awaitMessages(filter1, { max: 1, time: 30000, errors: ['time'] });
        const prefixF1 = collected1.first().content;
        message.channel.send(`What is your code?<@${message.author.id}>`);
        const filter2 = m => m.author.id === message.author.id;
        const collected2 = await message.channel.awaitMessages(filter2, { max: 1, time: 30000, errors: ['time'] });
        const question = collected2.first().content;
        const msg = await message.channel.messages.fetch({ limit: 1 });
        const lastMessage = msg.first();
        const lastMessageID = lastMessage.id;
        const prefix = `#${prefixF1} \n` + question +"\n\n# please explain what is wrong with this code \n";
        console.log(prefix);
        if(!question) return message.reply(`Please ask a question.<@${message.author.id}>`);
        const response = await openai.createCompletion({
            model: "text-davinci-003",
            prompt: prefix,
            max_tokens: 250,
            temperature: 0.9,
            n: 1,
        });
        const answer = response.data.choices[0].text;
        message.channel.send("Please wait...");
        message.reply(answer);
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send(new MessageEmbed()
            .setTitle(`❌ ERROR | An error occurred`)
            .setDescription(`\`\`\`${e.stack}\`\`\``)
        );
    }
    }
}