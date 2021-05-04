module.exports.run=async(client,message)=>{
    const emojis=["▫️","🟦","⬛","🟡","🔴"];
    var pacmanPos={x:6,y:4};
    var ghostPos=[
        {x:1,y:1,under:emojis[0]},
        {x:11,y:1,under:emojis[0]},
        {x:1,y:7,under:emojis[0]},
        {x:11,y:7,under:emojis[0]}
    ];
    var score=0;
    var map=[
        [emojis[1],emojis[1],emojis[1],emojis[1],emojis[1],emojis[1],emojis[1],emojis[1],emojis[1],emojis[1],emojis[1],emojis[1],emojis[1]],
        [emojis[1],emojis[0],emojis[0],emojis[0],emojis[0],emojis[0],emojis[0],emojis[0],emojis[0],emojis[0],emojis[0],emojis[0],emojis[1]],
        [emojis[1],emojis[0],emojis[1],emojis[1],emojis[0],emojis[0],emojis[1],emojis[0],emojis[0],emojis[1],emojis[1],emojis[0],emojis[1]],
        [emojis[1],emojis[0],emojis[0],emojis[0],emojis[0],emojis[1],emojis[0],emojis[1],emojis[0],emojis[0],emojis[0],emojis[0],emojis[1]],
        [emojis[1],emojis[0],emojis[0],emojis[1],emojis[1],emojis[0],emojis[0],emojis[0],emojis[1],emojis[1],emojis[0],emojis[0],emojis[1]],
        [emojis[1],emojis[0],emojis[0],emojis[0],emojis[0],emojis[0],emojis[0],emojis[0],emojis[0],emojis[0],emojis[0],emojis[0],emojis[1]],
        [emojis[1],emojis[0],emojis[1],emojis[1],emojis[0],emojis[1],emojis[0],emojis[1],emojis[0],emojis[1],emojis[1],emojis[0],emojis[1]],
        [emojis[1],emojis[0],emojis[0],emojis[0],emojis[0],emojis[1],emojis[0],emojis[1],emojis[0],emojis[0],emojis[0],emojis[0],emojis[1]],
        [emojis[1],emojis[1],emojis[1],emojis[1],emojis[1],emojis[1],emojis[1],emojis[1],emojis[1],emojis[1],emojis[1],emojis[1],emojis[1]]
    ];
    var gameOver=false;
    placeBlock(pacmanPos.x,pacmanPos.y,emojis[3]);
    ghostPos.forEach(ghost=>{
        placeBlock(ghost.x,ghost.y,emojis[4]);
    });
    message.channel.send(map.map(row=>row.join("")).join("\n")+`\n**Score :** ${score}`).then(botMessage=>{
        botMessage.react("◀️").then(()=>{
        botMessage.react("▶️").then(()=>{
        botMessage.react("🔼").then(()=>{
        botMessage.react("🔽").then(()=>{
            const leftFilter=(reaction,user)=>reaction.emoji.name==="◀️"&&user.id===message.author.id;
            const rightFilter=(reaction,user)=>reaction.emoji.name==="▶️"&&user.id===message.author.id;
            const topFilter=(reaction,user)=>reaction.emoji.name==="🔼"&&user.id===message.author.id; 
            const bottomFilter=(reaction,user)=>reaction.emoji.name==="🔽"&&user.id===message.author.id;
            const left=botMessage.createReactionCollector(leftFilter,{time:180000});
            const right=botMessage.createReactionCollector(rightFilter,{time:180000});
            const top=botMessage.createReactionCollector(topFilter,{time:180000});
            const bottom=botMessage.createReactionCollector(bottomFilter,{time:180000});
            left.on("collect",()=>move("left","pacman",botMessage));
            right.on("collect",()=>move("right","pacman",botMessage));
            top.on("collect",()=>move("top","pacman",botMessage));
            bottom.on("collect",()=>move("bottom","pacman",botMessage));
        })})})});
    });
    function placeBlock(x,y,block){
        map[y][x]=block;
    };
    function getBlock(x,y){
        return map[y][x];
    };
    function move(dir,emoji,botMessage,indexOfGhost){
        if(emoji==="pacman"){
            switch(dir){
                case"left":
                    if(getBlock(pacmanPos.x-1,pacmanPos.y)===emojis[4])return setGameOver(false,botMessage);
                    if(getBlock(pacmanPos.x-1,pacmanPos.y)!=emojis[1]){
                        placeBlock(pacmanPos.x,pacmanPos.y,emojis[2]);
                        pacmanPos.x--;
                        if(getBlock(pacmanPos.x,pacmanPos.y)===emojis[0])score++;
                        placeBlock(pacmanPos.x,pacmanPos.y,emojis[3]);
                        moveGhost(botMessage);
                    };
                    actualisation(botMessage);
                break;
                case"right":
                    if(getBlock(pacmanPos.x+1,pacmanPos.y)===emojis[4])return setGameOver(false,botMessage);
                    if(getBlock(pacmanPos.x+1,pacmanPos.y)!=emojis[1]){
                        placeBlock(pacmanPos.x,pacmanPos.y,emojis[2]);
                        pacmanPos.x++;
                        if(getBlock(pacmanPos.x,pacmanPos.y)===emojis[0])score++;
                        placeBlock(pacmanPos.x,pacmanPos.y,emojis[3]);
                        moveGhost(botMessage);
                    };
                    actualisation(botMessage);
                break;
                case"bottom":
                    if(getBlock(pacmanPos.x,pacmanPos.y+1)===emojis[4])return setGameOver(false,botMessage);
                    if(getBlock(pacmanPos.x,pacmanPos.y+1)!=emojis[1]){
                        placeBlock(pacmanPos.x,pacmanPos.y,emojis[2]);
                        pacmanPos.y++;
                        if(getBlock(pacmanPos.x,pacmanPos.y)===emojis[0])score++;
                        placeBlock(pacmanPos.x,pacmanPos.y,emojis[3]);
                        moveGhost(botMessage);
                    };
                    actualisation(botMessage);
                break;
                case"top":
                    if(getBlock(pacmanPos.x,pacmanPos.y-1)===emojis[4])return setGameOver(false,botMessage);
                    if(getBlock(pacmanPos.x,pacmanPos.y-1)!=emojis[1]){
                        placeBlock(pacmanPos.x,pacmanPos.y,emojis[2]);
                        pacmanPos.y--;
                        if(getBlock(pacmanPos.x,pacmanPos.y)===emojis[0])score++;
                        placeBlock(pacmanPos.x,pacmanPos.y,emojis[3]);
                        moveGhost(botMessage);
                    };
                    actualisation(botMessage);
                break;
            };
        }else{
            switch(dir){
                case"left":
                    MoveGhostLeft();
                break;
                case"right":
                    MoveGhostRight();
                break;
                case"top":
                    MoveGhostTop();
                break;
                case"bottom":
                    MoveGhostBottom();
                break;
            };
            function MoveGhostLeft(){
                if(getBlock(ghostPos[indexOfGhost].x-1,ghostPos[indexOfGhost].y)===emojis[0]||getBlock(ghostPos[indexOfGhost].x-1,ghostPos[indexOfGhost].y)===emojis[2]){
                    placeBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y,ghostPos[indexOfGhost].under);
                    ghostPos[indexOfGhost].x--;
                    ghostPos[indexOfGhost].under=getBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y);
                    placeBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y,emojis[4]);
                }else MoveGhostRight();
            };
            function MoveGhostRight(){
                if(getBlock(ghostPos[indexOfGhost].x+1,ghostPos[indexOfGhost].y)===emojis[0]||getBlock(ghostPos[indexOfGhost].x-1,ghostPos[indexOfGhost].y)===emojis[2]){
                    placeBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y,ghostPos[indexOfGhost].under);
                    ghostPos[indexOfGhost].x++;
                    ghostPos[indexOfGhost].under=getBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y);
                    placeBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y,emojis[4]);
                }else MoveGhostTop();
            };
            function MoveGhostTop(){
                if(getBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y-1)===emojis[0]||getBlock(ghostPos[indexOfGhost].x-1,ghostPos[indexOfGhost].y)===emojis[2]){
                    placeBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y,ghostPos[indexOfGhost].under);
                    ghostPos[indexOfGhost].y--;
                    ghostPos[indexOfGhost].under=getBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y);
                    placeBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y,emojis[4]);
                }else MoveGhostBottom();
            };
            function MoveGhostBottom(){
                if(getBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y+1)===emojis[0]||getBlock(ghostPos[indexOfGhost].x-1,ghostPos[indexOfGhost].y)===emojis[2]){
                    placeBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y,ghostPos[indexOfGhost].under);
                    ghostPos[indexOfGhost].y++;
                    ghostPos[indexOfGhost].under=getBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y);
                    placeBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y,emojis[4]);
                };
            };
        };
    };
    function moveGhost(botMessage){
        ghostPos.forEach(ghost=>{
            const xDiff=pacmanPos.x-ghost.x;
            const yDiff=pacmanPos.y-ghost.y;
            if(xDiff<yDiff){
                if(xDiff<0)move("left","ghost",botMessage,ghostPos.indexOf(ghost));
                else move("right","ghost",botMessage,ghostPos.indexOf(ghost));
            }else{
                if(yDiff<0)move("top","ghost",botMessage,ghostPos.indexOf(ghost));
                else move("bottom","ghost",botMessage,ghostPos.indexOf(ghost));
            };
        });
    };
    async function actualisation(botMessage){
        const userReactions=botMessage.reactions.cache.filter(reaction=>reaction.users.cache.has(message.author.id));
        try{
            for(const reaction of userReactions.values())await reaction.users.remove(message.author.id);
        }catch(_){};
        botMessage.edit(map.map(row=>row.join("")).join("\n")+`\n**Score :** ${score}`);
        if(score>=20){
            setGameOver(true,botMessage);
        };
    };
    function setGameOver(victory,botMessage){
        gameOver=true;
        if(!victory){
            message.channel.send("**GAME OVER** : Defeat !");
        }else{
            message.channel.send("**GAME OVER** : Victory !");
        };
        botMessage.reactions.removeAll();
    };
};