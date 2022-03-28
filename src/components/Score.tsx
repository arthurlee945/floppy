import React, {useEffect, useState} from 'react';
import '../App.scss';


const Score:React.FC<any> = (props:any) =>{
  const [lightOrDark, setLightOrDark] = useState<boolean>(props.lightOrDark)
  const handleLightDarkMode = (e:any) =>{
    if(lightOrDark){
      props.handleBg("dark",)
    } else{
      props.handleBg("light")
    }
    setLightOrDark(!lightOrDark);
    e.stopPropagation();
  }
  return(
    <div className="scoreContainer">
      <div className="board">
        {lightOrDark?
          <i id = "lightMode" className="fa-solid fa-sun mode" onClick = {handleLightDarkMode} ></i>:
          <i id = "darkMode" className="fa-solid fa-moon mode" onClick = {handleLightDarkMode}></i>
        }
        {props.gameover?"":
        <i id = "close" className="fa-solid fa-xmark close" onClick = {props.handleMenu}></i>}
        <div className = "scores">
          <h1>Score</h1>
          <h1>{props.score}</h1>
          <h2>Best Score</h2>
          <h2>{props.bestScore}</h2>
        </div>
        <div className = "buttons">
          <button onClick = {props.replay}><i className="fa-solid fa-arrow-rotate-left"></i></button>
          <button id = "open" onClick = {props.handleCharacterMenu}>Character</button>
        </div>
        <div className = "socialBox">
          <a href="https://github.com/arthurlee945" target="_blank"><i className="fa-brands fa-github"></i></a>
          <a href="https://arthurlee.digital/" target="_blank"><i className="fa-solid fa-image-portrait"></i></a>
          <a href="https://www.linkedin.com/in/arthurjlee/" target="_blank"><i className="fa-brands fa-linkedin"></i></a>
          <a href="https://www.instagram.com/arthur_lee94/" target="_blank"><i className="fa-brands fa-instagram"></i></a>
        </div>
      </div>
    </div>
  )
}
export default Score;