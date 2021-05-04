function random(min,max){
    min=Math.ceil(min);
    max=Math.floor(max);
    return Math.floor(Math.random()*(max-min+1))+min;
};
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
            left.on("collect",()=>move("left",botMessage));
            right.on("collect",()=>move("right",botMessage));
            top.on("collect",()=>move("top",botMessage));
            bottom.on("collect",()=>move("bottom",botMessage));
        })})})});
    });
    function placeBlock(x,y,block){
        map[y][x]=block;
    };
    function getBlock(x,y){
        return map[y][x];
    };
    function move(dir,botMessage){
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
    };
    function moveGhost(botMessage){
        if(random(1,10)!=1){
            ghostPos.forEach(ghost=>{
                var xDiff=pacmanPos.x-ghost.x;
                var yDiff=pacmanPos.y-ghost.y;
                var dirLog=[];
                const indexOfGhost=ghostPos.indexOf(ghost);
                setMovement(xDiff,yDiff,dirLog);
                function setMovement(xDiff,yDiff,dirLog){
                    if(dirLog.length<4){
                        if(xDiff<yDiff){
                            if(xDiff<0){
                                if(getBlock(ghostPos[indexOfGhost].x-1,ghostPos[indexOfGhost].y)===emojis[3])setGameOver(false,botMessage);
                                if(getBlock(ghostPos[indexOfGhost].x-1,ghostPos[indexOfGhost].y)===emojis[0]||getBlock(ghostPos[indexOfGhost].x-1,ghostPos[indexOfGhost].y)===emojis[2]){
                                    moveGhostLeft(ghostPos.indexOf(ghost));
                                }else{
                                    dirLog.push("left");
                                    if(!dirLog.includes("top")&&!dirLog.includes("bottom"))setMovement(yDiff+1,yDiff,dirLog);
                                    else if(!dirLog.includes("right"))setMovement((pacmanPos.x-ghost.x)*-1,yDiff,dirLog);
                                };
                            }else{
                                if(getBlock(ghostPos[indexOfGhost].x+1,ghostPos[indexOfGhost].y)===emojis[3])setGameOver(false,botMessage);
                                if(getBlock(ghostPos[indexOfGhost].x+1,ghostPos[indexOfGhost].y)===emojis[0]||getBlock(ghostPos[indexOfGhost].x+1,ghostPos[indexOfGhost].y)===emojis[2]){
                                    moveGhostRight(ghostPos.indexOf(ghost));
                                }else{
                                    dirLog.push("right");
                                    if(!dirLog.includes("top")&&!dirLog.includes("bottom"))setMovement(yDiff+1,yDiff,dirLog);
                                    else if(!dirLog.includes("left"))setMovement((pacmanPos.x-ghost.x)*-1,yDiff,dirLog);
                                };
                            };
                        }else{
                            if(yDiff<0){
                                if(getBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y-1)===emojis[3])setGameOver(false,botMessage);
                                if(getBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y-1)===emojis[0]||getBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y-1)===emojis[2]){
                                    moveGhostTop(ghostPos.indexOf(ghost));
                                }else{
                                    dirLog.push("top");
                                    if(!dirLog.includes("right")&&!dirLog.includes("left"))setMovement(xDiff,xDiff+1,dirLog);
                                    else if(!dirLog.includes("bottom"))setMovement(xDiff,(pacmanPos.y-ghost.y)*-1,dirLog);
                                };
                            }else{
                                if(getBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y+1)===emojis[3])setGameOver(false,botMessage);
                                if(getBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y+1)===emojis[0]||getBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y+1)===emojis[2]){
                                    moveGhostBottom(ghostPos.indexOf(ghost));
                                }else{
                                    dirLog.push("bottom");
                                    if(!dirLog.includes("right")&&!dirLog.includes("left"))setMovement(xDiff,xDiff+1,dirLog);
                                    else if(!dirLog.includes("top"))setMovement(xDiff,(pacmanPos.y-ghost.y)*-1,dirLog);
                                };
                            };
                        };
                        function moveGhostLeft(indexOfGhost){
                            placeBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y,ghostPos[indexOfGhost].under);
                            ghostPos[indexOfGhost].x--;
                            ghostPos[indexOfGhost].under=getBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y);
                            placeBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y,emojis[4]);
                        };
                        function moveGhostRight(indexOfGhost){
                            placeBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y,ghostPos[indexOfGhost].under);
                            ghostPos[indexOfGhost].x++;
                            ghostPos[indexOfGhost].under=getBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y);
                            placeBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y,emojis[4]);
                        };
                        function moveGhostTop(indexOfGhost){
                            placeBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y,ghostPos[indexOfGhost].under);
                            ghostPos[indexOfGhost].y--;
                            ghostPos[indexOfGhost].under=getBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y);
                            placeBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y,emojis[4]);
                        };
                        function moveGhostBottom(indexOfGhost){
                            placeBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y,ghostPos[indexOfGhost].under);
                            ghostPos[indexOfGhost].y++;
                            ghostPos[indexOfGhost].under=getBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y);
                            placeBlock(ghostPos[indexOfGhost].x,ghostPos[indexOfGhost].y,emojis[4]);
                        };
                    };
                };
            });
        };
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
        placeBlock(pacmanPos.x,pacmanPos.y,emojis[2]);
        gameOver=true;
        if(!victory){
            message.channel.send("**GAME OVER** : Defeat !");
        }else{
            message.channel.send("**GAME OVER** : Victory !");
        };
        botMessage.reactions.removeAll();
    };
};