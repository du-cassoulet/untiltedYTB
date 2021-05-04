require("dotenv").config();
const{Client}=require("discord.js");
const client=new Client();
const prefix="u.";
client.login(process.env.TOKEN);
client.options.restTimeOffset=0;
client.on("message",async message=>{
    if(message.content.toLowerCase()===prefix+"pacman"){
        const pacman=require("./commands/pacman");
        pacman.run(client,message);
    };
});