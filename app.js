let selected='',
colorArr;
const colors=['red','blue','green','black','yellow','blueviolet','aqua','brown'],
history=[];
function start(){
    colorArr=getRandomColorArr();
    initGame(colorArr);
}
function initGame(colorArr){
    const tubecontainer=document.querySelector('.tubes');
    tubecontainer.innerHTML='';
    for(let i=0;i<(colorArr.length+2);i++){
        const tube=document.createElement('div');
        tube.classList.add('tube');
        tube.id=`t${i}`;
        tubecontainer.appendChild(tube);
    }
    displayBalls(colorArr);
    document.querySelectorAll('.tube').forEach(tube=>tube.addEventListener('click',e=>tubeClick(e)));
}
function displayBalls(arr){
    const tubes=document.querySelectorAll('.tube');
    for(let i=0;i<arr.length;i++){
        for(let j=0;j<arr[i].length;j++){
            const ball=getColorBall(arr[i][j]);
            tubes[i].appendChild(ball)
        }
    }
}
function getColorBall(color){
    const colorElm=document.createElement('span');
    colorElm.classList.add('ball');
    colorElm.style.backgroundColor=color;
    colorElm.setAttribute('value',color)
    return colorElm;
}
function getRandomColorArr(){
    const numberOfColors=document.getElementById('colorNumber').value;
    const reducedColorsArr=colors.slice(colors.length-numberOfColors)
    const colorObj=reducedColorsArr.reduce((a,c)=>{
        a[c]=4;
        return a;   
    },{}),
    colorArr=[];
    let keys=Object.keys(colorObj);
    
    colorArr.push(new Array());
    while(keys.length){
        const color=keys[Math.floor(Math.random()*keys.length)];
        colorObj[color]=colorObj[color]-1;
        if(colorObj[color]===0){
            delete colorObj[color];
            keys=Object.keys(colorObj)
        }
        if(colorArr[colorArr.length-1].length<4){
            colorArr[colorArr.length-1].push(color);
        }else{
            colorArr.push(new Array());
            colorArr[colorArr.length-1].push(color);
        }
    }
    return colorArr;
}
function tubeClick(e){
    if(!e.target.classList.contains('finised') && !e.target.parentNode.classList.contains('finised') ){
        const id=(e.target.id || e.target.parentNode.id);
        if(!selected){
            selected=id;
            document.getElementById(selected).classList.add('selected');
        }else{
            const originTube=document.getElementById(selected);
            const targetTube=document.getElementById(id);
            const ballToMove=originTube.children[0];
            const firstBallOnTarget=targetTube.children[0]
            if(ballToMove && ((targetTube.children.length<4 && 
                ballToMove.getAttribute('value')===firstBallOnTarget?.getAttribute('value')) ||
                targetTube.children.length===0)){
                    originTube.removeChild(ballToMove);
                    targetTube.prepend(ballToMove);
                    checkFinishedTube(targetTube);
                    checkWin();
                    history.push({"origin":selected,"target":id});
                }
            document.getElementById(selected).classList.remove('selected');
            selected='';
        }
    }
    
}
function checkFinishedTube(tube){
    let allTheSame=true;
    const children=Array.prototype.slice.call(tube.children);
    children.forEach(tube=>{
        if(children[0].getAttribute('value')!==tube.getAttribute('value')){
            allTheSame=false;
        }
    })
    if(children.length===4 && allTheSame){
        tube.classList.add('finised');
    }
}
function checkWin(){
    const numberOfColorsToWin=(+document.getElementById('colorNumber').value);
    const finishedTubes=document.querySelectorAll(".finised");
    if(finishedTubes.length===numberOfColorsToWin){
        finishedTubes.forEach(tube=>{
            tube.classList.remove('finised');
            tube.classList.add('win')
    })
    }
}
function restart(){
    initGame(colorArr);
}
function undo(){
    if(history.length){
        const {origin,target}=history.pop();
        const ball=document.getElementById(target).children[0];
        document.getElementById(target).removeChild(ball);
        document.getElementById(origin).prepend(ball);
    }
  
}