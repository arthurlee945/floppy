import React, {useEffect, useState} from 'react';
import '../App.scss';

const Obstacles:React.FC<any> = (props:any) =>{
  return(
    <div className = "obstacleContainer">
      <div className = "obstacle1">
        <div id = "obs1Top" className="topObs"></div>
        <div id = "obs1Bot" className="bottomObs"></div>
        <section id ="score1" className="scoreline"></section>
      </div>
      <div className="obstacle2">
        <div id = "obs2Top" className="topObs"></div>
        <div id = "obs2Bot"className="bottomObs"></div>
        <section id ="score2" className="scoreline"></section>
      </div>
      <div className="obstacle3">
        <div id = "obs3Top"className="topObs"></div>
        <div id = "obs3Bot" className="bottomObs"></div>
        <section id ="score3" className="scoreline"></section>
      </div>
    </div>
  )
}
export default Obstacles;