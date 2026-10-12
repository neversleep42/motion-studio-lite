export const format={width:1280,height:720,fps:30,durationInFrames:180};
export const examples=[
 {name:'Titre',code:`import React from 'react';
import {AbsoluteFill, useCurrentFrame, spring} from 'remotion';
export default function Composition() {
  const frame = useCurrentFrame();
  const progress = spring({frame, fps:30, config:{damping:18}});
  return <AbsoluteFill style={{background:'#172421',color:'#d1f38d',fontFamily:'Arial',justifyContent:'center',alignItems:'center'}}>
    <div style={{fontSize:110,fontWeight:800,opacity:progress,transform:'translateY('+(1-progress)*80+'px)'}}>MAKE IT MOVE.</div>
  </AbsoluteFill>;
}`},
 {name:'Formes',code:`import React from 'react';
import {AbsoluteFill, useCurrentFrame, interpolate} from 'remotion';
export default function Composition() {
  const frame=useCurrentFrame();
  const x=interpolate(frame,[0,90,179],[-350,350,-350]);
  return <AbsoluteFill style={{background:'#171c27',justifyContent:'center',alignItems:'center'}}>
    <div style={{width:160,height:160,background:'#baa3ff',borderRadius:frame<90?80:20,transform:'translateX('+x+'px) rotate('+frame*2+'deg)'}}/>
  </AbsoluteFill>;
}`},
 {name:'Compteur',code:`import React from 'react';
import {AbsoluteFill, useCurrentFrame} from 'remotion';
export default function Composition() {
  const frame=useCurrentFrame();
  const progress=Math.min(1,frame/120);
  return <AbsoluteFill style={{background:'#eeeae1',color:'#23352f',fontFamily:'Arial',justifyContent:'center',padding:120}}>
    <div style={{fontSize:130,fontWeight:800}}>{Math.round(progress*100)}%</div>
    <div style={{height:10,background:'#23352f',width:progress*900}}/>
  </AbsoluteFill>;
}`}
];
