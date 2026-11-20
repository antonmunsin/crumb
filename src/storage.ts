import { seed, type State } from './data'
const key='crumb:v1'
export function readState():{state:State;warning:string}{try{const raw=localStorage.getItem(key);if(raw){const s=JSON.parse(raw);if(!Array.isArray(s.inventory)||!s.profile||!Array.isArray(s.selected)||!Array.isArray(s.extras)||!Array.isArray(s.checked))throw Error('Invalid data');return {state:s,warning:''}}return {state:seed(),warning:''}}catch{return {state:seed(),warning:'Saved data could not be loaded. You can still explore; changes may not survive a reload.'}}}
export function saveState(state:State){try{localStorage.setItem(key,JSON.stringify(state));return true}catch{return false}}
