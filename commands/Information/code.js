const Discord = require('discord.js');
const { MessageEmbed } = require("discord.js");
const config = require("../../botconfig/config.json");
const {Configuration, OpenAIApi} = require("openai");

module.exports = {
    name: "code",
    category: "Information",
    aliases: ["c"],
    cooldown: 30,
    usage: "code",
    description: "Ask AI to write a piece of code",
    run: async (message) => {
    try{
        const apiConfig = new Configuration({
            apiKey: config.openaikey,
        });
        const openai = new OpenAIApi(apiConfig);
        message.channel.send(`What language do you want your code to be in?<@${message.author.id}>`);
        const filter1 = m => m.author.id === message.author.id;
        const collected1 = await message.channel.awaitMessages(filter1, { max: 1, time: 30000, errors: ['time'] });
        const prefixF1 = collected1.first().content;
        message.channel.send(`Provide a summary of your code. What does it need to do? What is it for?<@${message.author.id}>`);
        const filter2 = m => m.author.id === message.author.id;
        const collected2 = await message.channel.awaitMessages(filter2, { max: 1, time: 30000, errors: ['time'] });
        const question = collected2.first().content;
        const msg = await message.channel.messages.fetch({ limit: 1 });
        const lastMessage = msg.first();
        const lastMessageID = lastMessage.id;
        const prefix = `#language=${prefixF1} \n` + question +"\n\n# Please write this code \n";
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
        const msg2 = await message.channel.messages.fetch({ limit: 1 });
        const acceptedLanguages = ["c", "cpp", "csharp", "css", "go", "html", "java", "javascript", "json", "kotlin", "markdown", "php", "python", "ruby", "rust", "sql", "swift", "typescript", "yaml"];
        const acceptedLanguagesShort = ["c", "cpp", "cs", "css", "go", "html", "java", "js", "json", "kt", "md", "php", "py", "rb", "rs", "sql", "swift", "ts", "yaml"];
        //i will keep it in one list later for now its ok like this
        const acceptedLanguagesFull = acceptedLanguages.concat(acceptedLanguagesShort);
        if (acceptedLanguagesFull.includes(prefixF1)) {
            msg2.delete();
        message.reply(`\`\`\`${prefixF1}\n${answer}\`\`\``);
        } else {
            msg2.delete();
        message.reply(`\`\`\`${answer}\`\`\``);
        }
    } catch (e) {
        console.log(String(e.stack).bgRed)
        return message.channel.send(new MessageEmbed()
            .setTitle(`❌ ERROR | An error occurred`)
            .setDescription(`\`\`\`${e.stack}\`\`\``)
        );
    }
    }
}