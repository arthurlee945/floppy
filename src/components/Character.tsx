import React, {useEffect, useState} from 'react';
import '../App.scss';

//bird
import birdHead from "../assets/bird/birdhead.svg";
import beakTop from "../assets/bird/beaktop.svg";
import beakBottom from "../assets/bird/beakbottom.svg";
import birdLeg from "../assets/bird/birdleg.svg";
import wing from "../assets/bird/wing.svg";

//dog
import dogHead from "../assets/dog/doghead.svg";
import dogBody from "../assets/dog/dogbody.svg";
import ear from "../assets/dog/ear.svg";
import tail from "../assets/dog/tail.svg";

//moustache
import humanHead from "../assets/moustache/humanhead.svg";
import humanBody from "../assets/moustache/humanbody.svg";
import beardLeft from "../assets/moustache/beardleft.svg";
import beardRight from "../assets/moustache/beardright.svg";
import hat from "../assets/moustache/hat.svg";

//character component
const Character: React.FC<any> = (props:any) =>{
  const [dog, setDog] = useState(false);
  const [bird, setBird] = useState(false);
  const [moustache, setMoustache] = useState(false);

  useEffect(()=>{
    if(props.selected === "dog"){
      setDog(true);
      setBird(false);
      setMoustache(false);
    }
    else if (props.selected === "bird"){
      setBird(true);
      setDog(false);
      setMoustache(false);
    }
    else if (props.selected === "moustache"){
      setMoustache(true);
      setBird(false);
      setDog(false);
    }
  },[props.selected])
  
  return(
    <div id = "character" className='character'>
      {bird? 
      <div id = "bird" className="bird">
        <img id = "birdHead" className = "birdHead" alt = "birdHead" src = {birdHead} draggable="false"/>
        <img id = "beakBottom" className = "beakBottom" alt = "beakBottom" src = {beakBottom} draggable = "false"/>
        <img id = "beakTop" className = "beakTop" alt = "beakTop" src = {beakTop} draggable = "false"/>
        <img id = "wing" className="wing" alt="wing" src={wing}  draggable = "false"/>
        <img id = "birdLegLeft" className="birdLegLeft" alt="leftBirdLeg"  src={birdLeg}  draggable = "false"/>
        <img id = "birdLegRight" className="birdLegRight" alt="rightBirdLeg"  src={birdLeg}  draggable = "false"/>
      </div>
      :""}
      {dog?
      <div id = "dog" className="dog">
          <img id = "dogHead" className="dogHead" alt="dogHead" src={dogHead}  draggable="false"/>
          <img id = "dogEar" className="ear" alt="ear" src={ear}  draggable="false"/>
          <div id = "dogBottom" className="bottom">
            <img id = "dogBody" className="dogBody" alt="dogBody" src={dogBody}  draggable="false"/>
            <img id = "dogTail" className="tail" alt="tail" src={tail}  draggable="false"/>
          </div>
      </div>
      :""}
      {moustache?
      <div id = "moustache" className="moustache">
        <img id = "hat" className="hat" alt="hat" src={hat} draggable="false"/>
        <img id = "humanHead" className="humanHead" alt="humanHead" src={humanHead} draggable="false"/>
        <img id = "beardLeft" className="beardLeft" alt="beardLeft" src={beardLeft} draggable="false"/>
        <img id = "beardRight" className="beardRight" alt="beardRight" src={beardRight} draggable="false"/>
        <img id = "humanBody" className="humanBody" alt="humanBody" src={humanBody} draggable="false"/>
      </div>
      :""}
    </div>
  )
}


export default Character;