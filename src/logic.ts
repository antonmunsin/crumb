import { ingredientById, recipes, dateIn, type State, type Recipe, type Item, type Unit } from './data'
export type Line = { key:string; ingredient?:string; name:string; unit:Unit; needed:number; home:number; buy:number; price:number }
export const amount=(n:number)=>Number(n.toFixed(1)).toString()
export function shopping(state:State):Line[] {
 const lines=new Map<string,Line>()
 const add=(key:string,ingredient:string|undefined,name:string,unit:Unit,q:number)=>{ const line=lines.get(key)??{key,ingredient,name,unit,needed:0,home:0,buy:0,price:ingredient?ingredientById[ingredient].price:0};line.needed+=q;lines.set(key,line) }
 for(const selected of state.selected){ const r=recipes.find(r=>r.id===selected.recipe);if(r)for(const i of r.ingredients){const def=ingredientById[i.ingredient];add(`${def.id}:${def.unit}`,def.id,def.name,def.unit,i.quantity*selected.servings/2)} }
 for(const x of state.extras){const def=Object.values(ingredientById).find(d=>d.name.toLowerCase()===x.name.toLowerCase()&&d.unit===x.unit);add(def?`${def.id}:${def.unit}`:`extra:${x.name.toLowerCase()}:${x.unit}`,def?.id,x.name,x.unit,x.quantity)}
 return [...lines.values()].map(line=>{const available=state.inventory.filter(i=>(line.ingredient?i.ingredient===line.ingredient:i.name?.toLowerCase()===line.name.toLowerCase())&&i.unit===line.unit).reduce((n,i)=>n+i.quantity,0);return {...line,home:Math.min(available,line.needed),buy:Math.max(0,line.needed-available)} })
}
export function recipeInfo(r:Recipe,state:State,servings=state.profile.servings){const lines=shopping({...state,selected:[{id:'preview',recipe:r.id,servings}],extras:[]});return {lines,cost:lines.reduce((n,l)=>n+l.buy*l.price,0),covered:lines.filter(l=>l.buy===0).length,soon:r.ingredients.filter(x=>state.inventory.some(i=>i.ingredient===x.ingredient&&i.quantity>0&&i.expiry&&i.expiry<=dateIn(3))).map(x=>ingredientById[x.ingredient].name)} }
export function recommendations(state:State){const p=state.profile;return recipes.filter(r=>r.time<=p.maxTime&&(p.diet==='any'||r.diet===p.diet||(p.diet==='vegetarian'&&r.diet==='vegan'))&&!r.ingredients.some(i=>p.dislikes.includes(i.ingredient))).map(r=>{const info=recipeInfo(r,state);const score=info.soon.length*4+info.covered*2+(p.likes.includes(r.cuisine)?6:0)-info.cost/10*p.budget-r.impact*p.environment*2;return {recipe:r,...info,score}}).sort((a,b)=>b.score-a.score||a.recipe.id.localeCompare(b.recipe.id))}
export function consume(inventory:Item[],lines:Line[]):Item[]{const result=inventory.map(i=>({...i}));for(const line of lines){let remaining=line.needed;for(const item of result.filter(i=>(line.ingredient?i.ingredient===line.ingredient:i.name?.toLowerCase()===line.name.toLowerCase())&&i.unit===line.unit).sort((a,b)=>(a.expiry||'9999').localeCompare(b.expiry||'9999'))){const used=Math.min(remaining,item.quantity);item.quantity-=used;remaining-=used}}return result.filter(i=>i.quantity>0)}
export function purchase(state:State):State {
 const lines=shopping(state).filter(l=>l.buy>0&&state.checked.includes(l.key));
 if(!lines.length)return state;
 const inventory=[...state.inventory];
 for(const line of lines)inventory.push({id:crypto.randomUUID(),ingredient:line.ingredient??`custom:${line.name.toLowerCase()}`,name:line.name,unit:line.unit,quantity:line.buy,expiry:''});
 return {...state,inventory,checked:[]};
}
