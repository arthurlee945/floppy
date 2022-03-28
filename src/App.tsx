import React, {useState, useEffect} from 'react';
import './App.scss';

//components
import Character from "./components/Character";
import CharacterMenu from "./components/CharMenu";
import Obstacles from "./components/Obstacles";
import Score from "./components/Score";

//background Images
import cloud from "./assets/bg/clouds.svg";
import star from "./assets/bg/stars.svg";


const App = () =>{
  // list of States
  const [characterSize, setCharacterSize] = useState<number>(90);
  const [selected, setSelected] = useState<string>("dog");
  const [background, setBackground] = useState<string>(cloud);
  const [score, setScore] = useState<number>(0);
  const [bestScore, setBestScore] = useState<number>(0);
  const [playing, setPlaying] = useState<boolean>(false);
  const [pathSize, setPathSize] = useState<number>(characterSize*4.5);
  //menu states
  const [gameover, setGameOver] = useState<boolean>(false);
  const [lightOrDark, setLightOrDark] = useState<boolean>(true);
  const [pauseMenu, setPauseMenu] = useState<boolean>(false);
  const [characterMenu, setCharacterMenu] = useState<boolean>(false);
  const [instruction, setInstruction] = useState<boolean>(true);
  //interval & animation Key
  const [firstInterval, setFirstInterval] = useState<NodeJS.Timer>(setInterval(()=>{}));
  const [secondInterval, setSecondInterval] = useState<NodeJS.Timer>(setInterval(()=>{}));
  const [thirdInterval, setThridInterval] = useState<NodeJS.Timer>(setInterval(()=>{}));

  const [firstTimeout, setFirstTimeout] = useState<NodeJS.Timeout>(setTimeout(()=>{}));
  const [secondTimeout, setSecondTimeout] = useState<NodeJS.Timeout>(setTimeout(()=>{}));

  const [firstAnimation, setFirstAnimation] = useState<Animation>();
  const [secondAnimation, setSecondAnimation] = useState<Animation>();
  const [thirdAnimation, setThirdAnimation] = useState<Animation>();
  //gaming state
  let borderObserver:IntersectionObserver;
  const aniDuration = 250;
  const originalPos = "-20vw";
  const [beginningPos, setBeginningPos] = useState<number>(0);
  const [flyingAni, setFlyingAni] = useState<Animation>();
  const [charAnimation, setCharAnimation] = useState<boolean>(false);
  const [obs1, setObs1] = useState<boolean>(false);
  const [obs2, setObs2] = useState<boolean>(false);
  const [obs3, setObs3] = useState<boolean>(false);
  //score Time function
  const [scoreLine, setScoreLine] = useState<NodeJS.Timer[]>([setTimeout(()=>{})]);
  const [collisionTop, setCollisionTop] = useState<NodeJS.Timer[]>([setTimeout(()=>{})]);
  const [collisionBot, setCollisionBot] = useState<NodeJS.Timer[]>([setTimeout(()=>{})]);
  const [passing, setPassing] = useState<boolean>(false);
  const [passing2, setPassing2] = useState<boolean>(false);
  const [passing3, setPassing3] = useState<boolean>(false);
  const [collide, setCollide] = useState<boolean>(false);
  //handle resizing window

  //lifecycle effects
  useEffect(()=>{
    handleEventAdd(); 
    const character = document.getElementById("character") as HTMLElement;
    borderObserver = new IntersectionObserver((entries, observer)=>{
      entries.forEach(entry =>{
        if(!entry.isIntersecting){
          handleGameOver()
        }
      })
    },{
      threshold:1,
      rootMargin:"100px 0px 0px 0px"
    })
    borderObserver.observe(character)
    return ()=>{
      handleEventRemove();
      handleGameOver();
      setPauseMenu(true)
    }
  },[])
  //background Effects
  useEffect(()=>{
    if(playing){
      setInstruction(false);
      //measure outlines
      const character = document.getElementById("character") as HTMLElement;
      borderObserver = new IntersectionObserver((entries, observer)=>{
        entries.forEach(entry =>{
          if(!entry.isIntersecting){
            handleGameOver()
          }
        })
      },{
        threshold:1,
        rootMargin:"100px 0px 0px 0px"
      })
      borderObserver.observe(character)
      //obstacle grounds
      let firstObstacle = document.querySelector(".obstacle1") as HTMLElement;
      let secondObstacle = document.querySelector(".obstacle2") as HTMLElement;
      let thirdObstacle = document.querySelector(".obstacle3") as HTMLElement
      //initial render
      changeObstacle("obstacle1", pathSize);
      changeObstacle("obstacle2", pathSize);
      changeObstacle("obstacle3", pathSize); 
      let speed = window.innerWidth>1024? 8500: window.innerWidth> 768? 6500 : 4500;
      //first Obstacle

      setFirstAnimation(
        firstObstacle.animate([{transform: "translateX(calc(-100vw - 140px))"}], {duration:speed,iterations:Infinity})
      );
      setFirstInterval(
        setInterval(()=>{
          setObs1(true)
        },speed)
      );
      //second Obstacle
      let time = window.innerWidth>1024? speed*0.33 : speed*0.5
      setFirstTimeout(
        setTimeout(()=>{
          setSecondAnimation(
            secondObstacle.animate([{transform: "translateX(calc(-100vw - 140px))"}], {duration:speed, iterations:Infinity})
          )  
          setSecondInterval(
              setInterval(()=>{
                setObs2(true)
            },speed)
          )
        },time)
      );
      //third Obstacle
      if(window.innerWidth > 1024){
        setSecondTimeout(
          setTimeout(()=>{
            setThirdAnimation(
              thirdObstacle.animate([{transform: "translateX(calc(-100vw - 140px))"}], {duration:speed, iterations:Infinity})
            )
            setThridInterval(
                setInterval(()=>{
                setObs3(true)
              },speed)
            )
          },speed*0.66)
        );
      }
      //calculate score or gameover
      let scoreEle:Array<Element> = [];
      document.querySelectorAll(".scoreline").forEach(line=>{
        scoreEle.push(line);
      });
      setScoreLine(scoreEle.map((ele,i)=>{
        if(i === 0){
          return setInterval(()=>{
            let charLocation = character.getBoundingClientRect();
            let obj = ele.getBoundingClientRect();
            if(charLocation.right>=obj.left && charLocation.right<=obj.right){
              setPassing(true)
            } else{
              setPassing(false)
            }
          })
        } else if (i === 1){
          return setInterval(()=>{
            let charLocation = character.getBoundingClientRect();
            let obj = ele.getBoundingClientRect();
            if(charLocation.right>=obj.left && charLocation.right<=obj.right){
              setPassing2(true)
            } else{
              setPassing2(false)
            }
          })
        } else {
          return setInterval(()=>{
            let charLocation = character.getBoundingClientRect();
            let obj = ele.getBoundingClientRect();
            if(charLocation.right>=obj.left && charLocation.right<=obj.right){
              setPassing3(true)
            } else{
              setPassing3(false)
            }
          })
        }
      }));
      //Game Over Top
      let obstacleTopEle:Array<Element> =[];
      document.querySelectorAll(".topObs").forEach(obs=>{
        obstacleTopEle.push(obs);
      });
      setCollisionTop(obstacleTopEle.map((obstacle, i)=>{
        return setInterval(()=>{
          let charLoc = character.getBoundingClientRect();
          let obs = obstacle.getBoundingClientRect();
          if(charLoc.left>=obs.left-charLoc.width && charLoc.right <= obs.right + charLoc.width && charLoc.bottom<=obs.bottom+charLoc.height && charLoc.top >= obs.top){
            setCollide(true)
          } else{
            setCollide(false);
          }
        })
      }));
      //Game Over Bottom
      let obstacleBotEle:Array<Element> =[];
      document.querySelectorAll(".bottomObs").forEach(obs=>{
        obstacleBotEle.push(obs);
      });
      setCollisionBot(obstacleBotEle.map((obstacle, i)=>{
        return setInterval(()=>{
          let charLoc = character.getBoundingClientRect();
          let obs = obstacle.getBoundingClientRect();
          if(charLoc.left>=obs.left-charLoc.width && charLoc.right <= obs.right+charLoc.width && charLoc.top>=obs.top- charLoc.height && charLoc.bottom <= obs.bottom){
            setCollide(true)
          } else{
            setCollide(false);
          }
        })
      }));
    } 
    else{
      scoreLine.forEach(interval =>{
        clearInterval(interval)
      });
      collisionTop.forEach(interval =>{
        clearInterval(interval)
      });
      collisionBot.forEach(interval =>{
        clearInterval(interval)
      });
      //reset Interval
      clearInterval(firstInterval);
      clearInterval(secondInterval);
      clearInterval(thirdInterval);

      clearTimeout(firstTimeout);
      clearTimeout(secondTimeout);

      //pause animation
      firstAnimation?.pause();
      secondAnimation?.pause();
      thirdAnimation?.pause();
    }
  },[playing])
  //gaming Effecct
  useEffect(()=>{
    if(charAnimation){
      if(selected === "dog"){
        let dog = document.getElementById("dog") as HTMLElement;
        let dogEar = document.getElementById("dogEar") as HTMLElement;
        let dogBottom = document.getElementById("dogBottom") as HTMLElement;
        let tail = document.getElementById("dogTail") as HTMLElement;

        dog.animate([{transform: "rotate(0deg)"},{transform: "rotate(-15deg)", offset:0.75},{transform: "rotate(0deg)"}],aniDuration)
        dogEar.animate([{transform:"scaleY(1) rotate(0deg)"}, {transform:"scaleY(-1) rotate(30deg)", offset:0.5}, {transform:"scaleY(1) rotate(0deg)"}], {duration:aniDuration/2, iterations:2});
         dogBottom.animate([{transform:"rotate(0deg)"}, {transform:"rotate(30deg)", offset:0.5}, {transform:"rotate(-15deg)"},{transform:"rotate(0deg)"}], aniDuration);
        tail.animate([{transform:"rotate(0deg)"}, {transform:"rotate(30deg)", offset:0.25}, {transform:"rotate(-30deg)", offset:0.75},{transform:"rotate(0deg)"}],{duration:aniDuration/2, iterations:2})
      } 
      else if (selected === "bird"){ 
        let bird = document.getElementById("bird") as HTMLElement;
        let wing = document.getElementById("wing") as HTMLElement;
        let beakTop = document.getElementById("beakTop") as HTMLElement;
        let beakBottom = document.getElementById("beakBottom") as HTMLElement;
        let leftLeg = document.getElementById("birdLegLeft") as HTMLElement;
        let rightLeg = document.getElementById("birdLegRight") as HTMLElement;

        bird.animate([{transform: "rotate(0deg)"},{transform: "rotate(-15deg)", offset: 0.75}, {transform: "rotate(0deg)"}],aniDuration)
        wing.animate([{transform:"rotate(0deg)"},{transform:"rotate(15deg)", offset:0.25}, {transform:"rotate(-30deg)", offset:0.75}, {transform:"rotate(0deg)"}], {duration:aniDuration/2, iterations: 2})
        beakTop.animate([{transform:"rotate(0deg)"},{transform:"rotate(22.5deg)", offset:0.5},{transform:"rotate(0deg)"}], {duration:aniDuration/2, iterations: 2});
        beakBottom.animate([{transform:"rotate(0deg)"}, {transform:"rotate(-22.5deg)", offset:0.5}, {transform:"rotate(0deg)"}], {duration:aniDuration/2, iterations: 2});
        leftLeg.animate([{transform:"rotate(0deg)"},{transform:"rotate(-20deg)", offset: 0.25},{transform:"rotate(20deg)", offset:0.75},{transform:"rotate(0deg)"}], {duration:aniDuration/2, iterations: 2});
        rightLeg.animate([{transform:"rotate(0deg)"},{transform:"rotate(20deg)", offset: 0.25},{transform:"rotate(-20deg)", offset:0.75},{transform:"rotate(0deg)"}], {duration:aniDuration/2, iterations: 2});
      } 
      else{
        let moustache = document.getElementById("moustache") as HTMLElement;
        let hat = document.getElementById("hat") as HTMLElement;
        let leftBeard = document.getElementById("beardLeft") as HTMLElement;
        let rightBeard = document.getElementById("beardRight") as HTMLElement;
        let humanBody = document.getElementById("humanBody") as HTMLElement;

        moustache.animate([{transform: "rotate(0deg)"},{transform: "rotate(-15deg)", offset:0.75}, {transform: "rotate(0deg)"}],aniDuration)
        leftBeard.animate([{transform:"rotate(0deg)"},{transform:"rotate(25deg)", offset:0.25}, {transform:"rotate(-25deg)", offset:0.75}, {transform:"rotate(0deg)"}],{duration:aniDuration/2, iterations:2});
        rightBeard.animate([{transform:"rotate(0deg)"},{transform:"rotate(-25deg)", offset:0.25}, {transform:"rotate(25deg)", offset:0.75}, {transform:"rotate(0deg)"}],{duration:aniDuration/2, iterations:2});
        hat.animate([{transform:"translateY(0px) rotate(0deg)"},{transform:"translateY(-12px) rotate(20deg)", offset:0.25},{transform:"translateY(-12px) rotate(-20deg)", offset:0.75},{transform:"translateY(0px) rotate(0deg)"}], aniDuration);
        humanBody.animate([{transform:"rotate(0deg)"},{transform:"rotate(-25deg)", offset:0.25},{transform:"rotate(25deg)", offset:0.75}, {transform:"rotate(0deg)"}],{duration:aniDuration/2, iterations:2})
      }
      //hop
      let character = document.getElementById("character") as HTMLElement;
      let location = character.getBoundingClientRect();
      let travel = beginningPos -100;
      if (location.y<= 100){
        travel = beginningPos - location.y
      } 
      setFlyingAni(character.animate([{transform: `translate(${originalPos}, ${beginningPos}px)`}, {transform: `translate(${originalPos}, ${travel}px)`} ],{duration:aniDuration, easing:"ease-out"}))
      //drop
      let max = (document.querySelector("body") as HTMLElement).getBoundingClientRect().bottom;
      let px = 1000/max;
      let pxTime = (max -location.y + location.height/2)* px;
      let drop = max/2 + Math.abs(travel)
      handleDownAni(pxTime);
      setFlyingAni(character.animate([{transform: `translate(${originalPos}, ${travel}px)`}, {transform: `translate(${originalPos}, ${drop}px)`} ],{duration:pxTime, easing:"ease-in", delay:aniDuration}))
      //reset
      setCharAnimation(false);
    }
  },[charAnimation])
  //changeObstacleSize
  useEffect(()=>{
    if(obs1){
      changeObstacle("obstacle1" , pathSize);
      setObs1(false)
    }
  },[obs1]);
  useEffect(()=>{
    if(obs2){
      changeObstacle("obstacle2" , pathSize);
      setObs2(false)
    }
  },[obs2])
  useEffect(()=>{
    if(obs3){
      changeObstacle("obstacle3" , pathSize);
      setObs3(false)
    }
  },[obs3])
  //score Calculator
  useEffect(()=>{
    if(passing){
      setScore(score+1)
    }
  },[passing])
  useEffect(()=>{
    if(passing2){
      setScore(score+1)
    }
  },[passing2])
  useEffect(()=>{
    if(passing3){
      setScore(score+1)
    }
  },[passing3])
  useEffect(()=>{
    if(score > 0){
      let scoreAud = document.getElementById("scoreAud") as HTMLAudioElement;
      scoreAud.play();
    }
    if(score > bestScore){
      setBestScore(score)
    }
    if(score>=10 && score<35){
      setPathSize(characterSize * 4)
    } else if(score>=35){
      setPathSize(characterSize * 3.5)
    }
  },[score])
  //collision Detect
  useEffect(()=>{
    if(collide){
      let clash = document.getElementById("clash") as HTMLAudioElement;
      clash.play()
      setPlaying(false);
      handleEventRemove();
    }
  },[collide])
  // game architect functions
  const getObsLength = (path:number) =>{
    let max = (document.querySelector("body") as HTMLElement).getBoundingClientRect().bottom;
    let top = Math.floor(Math.random()*(max - path - 100)) + 50;
    let bottom = max - top - pathSize;
    return [top, bottom]
  }
  const changeObstacle = (column:string, path:number) =>{
    let pillarsLength = getObsLength(path);
    let pillars = document.querySelectorAll(`.${column} >div`);
    pillars.forEach((pillar,i) =>{
      if(i === 0){
        (pillar as HTMLElement).style.minHeight = `${pillarsLength[0]}px`
      } else{
        (pillar as HTMLElement).style.minHeight = `${pillarsLength[1]}px`
      }
    })
  }
  const handleDownAni = (time: number) =>{
    if(selected === "dog"){
      let dog = document.getElementById("dog") as HTMLElement;
      dog.animate([{transform: "rotate(0deg)"},{transform: "rotate(15deg)", offset:0.75},{transform: "rotate(0deg)"}],time)
    } 
    else if (selected === "bird"){ 
      let bird = document.getElementById("bird") as HTMLElement;
      bird.animate([{transform: "rotate(0deg)"},{transform: "rotate(15deg)", offset: 0.75}, {transform: "rotate(0deg)"}],time)
    } 
    else{
      let moustache = document.getElementById("moustache") as HTMLElement;
      moustache.animate([{transform: "rotate(0deg)"},{transform: "rotate(15deg)", offset:0.75}, {transform: "rotate(0deg)"}],time)
    }
  }
  const handleUserAction = (e:any) =>{
    if(e.keyCode === 32 || e.type === "click"){
      let flap = document.getElementById("flap") as HTMLAudioElement;
      flap.currentTime = 0;
      flap.volume = 0.3;
      flap.play();
      let spaceBar = document.querySelector(".spaceBar") as HTMLElement
      if(e.keyCode === 32){
        spaceBar.animate([{boxShadow:"0 1px 0 var(--fontColor)", transform: "translateY(5px)", offset:0.5,easing:"cubic-bezier(0,.54,.28,.98)"}], 150)
      };
      let character = document.getElementById("character") as HTMLElement;
      let location = character.getBoundingClientRect();
      //playing Character Animation
      flyingAni?.cancel();
      let max = (document.querySelector("body") as HTMLElement).getBoundingClientRect().bottom;
      setBeginningPos((location.y + location.height/2) - max/2)
      setCharAnimation(true);
      setPlaying(true);
    } 
  }
  const handleGameOver = ()=>{
    handleEventRemove();
    setPlaying(false);
    let character = document.getElementById("character") as HTMLElement;
    let location = character.getBoundingClientRect();
    let max = (document.querySelector("body") as HTMLElement).getBoundingClientRect().bottom;
    let bottom = max/2 - location.height/4;
    flyingAni?.cancel();
    borderObserver.unobserve(character);
    character.style.transform = `translate(${originalPos}, ${bottom}px) rotate(-70deg)`;
    character.animate([{transform:`translate(${originalPos}, ${bottom}px)`, offset:0.1}, {transform:`translate(${originalPos}, ${bottom - 100}px) rotate(-35deg)`, offset:1}],{duration:125, easing:"ease-out"});
    character.animate([{transform:`translate(${originalPos}, ${bottom - 100}px) rotate(-35deg)`, offset:0}, {transform:`translate(${originalPos}, ${bottom}px) rotate(-70deg)`, offset:1}],{duration:125, easing:"ease-in", delay: 125});
    setTimeout(()=>{ 
      setGameOver(true);
      setPauseMenu(true);
    },250);
  }
  const handleReplay = (e:any) =>{
    let character = document.getElementById("character") as HTMLElement;
    character.style.transform = `translate(${originalPos}, 0px)`;
    setGameOver(false);
    setPauseMenu(false);
    setScore(0);
    setPathSize(characterSize*4.5);
    firstAnimation?.cancel();
    secondAnimation?.cancel();
    thirdAnimation?.cancel();
    e.stopPropagation();
    handleEventAdd();
  }
  //menu functions
  const handleMode = (e:any) =>{
    if(lightOrDark){
      handleBg("dark")
    } else{
      handleBg("light")
    }
    setLightOrDark(!lightOrDark);
    e.stopPropagation();
  } 
  const handleBg = (mode:string) => {
    if(mode === "dark"){
      document.documentElement.style.setProperty("--backgroundColor","linear-gradient(#0f1011 20%, #1a1d20,#23282c)");
      document.documentElement.style.setProperty("--fontColor","#f7f7f7");
      document.documentElement.style.setProperty("--menuBg","#181818");
      setBackground(star)
      setLightOrDark(false)
    } else if (mode === "light"){
      document.documentElement.style.setProperty("--backgroundColor","linear-gradient(#d5e7f1 20%, #e1f4ff, #e1f4ff)");
      document.documentElement.style.setProperty("--fontColor","#080808");
      document.documentElement.style.setProperty("--menuBg","#f7f7f7");
      setBackground(cloud)
      setLightOrDark(true)
    }
  }
  const handlePauseMenu = (event:any) =>{
    if((event.target as HTMLElement).getAttribute("id") === "close"){
      setPauseMenu(false);
      handleEventAdd();
    } else{
      setPauseMenu(true);
      handleEventRemove();
    }
    event.stopPropagation();
  }
  const handleCharacterMenu = (event:any) =>{
    if((event.target as HTMLElement).getAttribute("id") === "close"){
      setCharacterMenu(false);
      setPauseMenu(true);
    } else{
      setCharacterMenu(true);
      setPauseMenu(false);
    }
    event.stopPropagation();
  }
  const handleSelection = (e:any) =>{
    if(e.target.getAttribute("id") === "bird"){
      setSelected("bird")
    } else if (e.target.getAttribute("id") === "dog"){
      setSelected("dog")
    } else {
      setSelected("moustache")
    }
    setCharacterMenu(false);
    setPauseMenu(true);
    handleEventRemove();
    e.stopPropagation();
  }
  const handleEventAdd = () =>{
    document.onclick = handleUserAction;
    document.onkeydown = handleUserAction;
  }
  const handleEventRemove = () =>{
    document.onclick = null;
    document.onkeydown = null;
  }
  return(
    <div className = "playGround">
      <div className="smallMenu">
        {lightOrDark?
          <i id = "lightMode" className="fa-solid fa-sun mode" onClick = {handleMode} ></i>:
          <i id = "darkMode" className="fa-solid fa-moon mode" onClick = {handleMode}></i>
        }
        <i id = "pause" className="fa-solid fa-pause pause" onClick = {handlePauseMenu}></i>
      </div>
      {instruction?<div className="instruction">
        <h1><span>Press</span><br/>Left Mouse Btn or Space Bar</h1>
      </div>:""}
      {pauseMenu?
      <Score score = {score} bestScore = {bestScore} handleBg = {handleBg} lightOrDark = {lightOrDark} handleMenu = {handlePauseMenu} handleCharacterMenu = {handleCharacterMenu} gameover = {gameover} replay = {handleReplay}/>
      :""}
      {characterMenu?
      <CharacterMenu selected = {selected} handleCharacterMenu = {handleCharacterMenu} setCharacter = {handleSelection}/>
      :""}
      <h1 className="score">{score}</h1>
      {window.innerWidth >1024?<div className="spaceBar">Space Bar</div>:""}
      <Character selected = {selected} />
      <Obstacles/>   
      <img className ="background" alt = "background1" src ={background} draggable = "false"/>
      <div>
        <audio id = "flap" src = "https://myaudiolibrary.s3.amazonaws.com/flap.mp3" crossOrigin="anonymous" />
        <audio id = "clash" src = "https://myaudiolibrary.s3.amazonaws.com/runin.mp3" crossOrigin="anonymous" />
        <audio id = "scoreAud" src = "https://myaudiolibrary.s3.amazonaws.com/smw_coin.mp3" crossOrigin="anonymous" />
      </div>
    </div>
  )
}


export default App;