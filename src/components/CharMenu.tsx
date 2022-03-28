import React, {useEffect, useState} from 'react';
import '../App.scss';

import Bird from "../assets/characters/bird.svg";
import Dog from "../assets/characters/dog.svg";
import Moustache from "../assets/characters/human.svg";


const Menu:React.FC<any> = (props:any) =>{

  return(
    <div className = "characterContainer">
      <div className="characters">
        <i id = "close" className="fa-solid fa-xmark" onClick = {props.handleCharacterMenu}></i>
        <img id = "bird" alt = "bird character" src = {Bird} draggable = "false" onClick = {props.setCharacter}/>
        <img id = "dog" alt = "dog character" src = {Dog} draggable = "false" onClick = {props.setCharacter}/>
        <img id = "moustache" alt = "human character" src = {Moustache} draggable = "false" onClick = {props.setCharacter}/>
      </div>
    </div>
  )
}

export default Menu;