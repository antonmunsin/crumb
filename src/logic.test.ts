import { describe, it, expect } from 'vitest'
import { seed, recipes } from './data'
import { shopping, recipeInfo, recommendations, consume, purchase } from './logic'
describe('shopping calculations',()=>{
 it('allocates inventory once across multiple meals',()=>{const s=seed();s.inventory=[{id:'p',ingredient:'pasta',quantity:200,unit:'g',expiry:''}];s.selected=[{id:'a',recipe:'green-pasta',servings:2},{id:'b',recipe:'tomato-pasta',servings:2}];const p=shopping(s).find(l=>l.ingredient==='pasta')!;expect(p.needed).toBe(360);expect(p.home).toBe(200);expect(p.buy).toBe(160)})
 it('scales ingredient requirements by servings',()=>{const s=seed();expect(recipeInfo(recipes[0],s,4).lines.find(l=>l.ingredient==='pasta')?.needed).toBe(360)})
 it('merges compatible extras and keeps incompatible units separate',()=>{const s=seed();s.selected=[{id:'a',recipe:'green-pasta',servings:2}];s.extras=[{id:'x',name:'Pasta',quantity:100,unit:'g'},{id:'y',name:'Pasta',quantity:1,unit:'pcs'}];const l=shopping(s);expect(l.find(l=>l.key==='pasta:g')?.needed).toBe(280);expect(l.find(l=>l.unit==='pcs'&&l.name==='Pasta')?.needed).toBe(1)})
 it('transfers purchases only once',()=>{let s=seed();s.selected=[{id:'a',recipe:'green-pasta',servings:2}];s.checked=shopping(s).filter(l=>l.buy>0).map(l=>l.key);s=purchase(s);const inventory=s.inventory;expect(shopping(s).every(l=>l.buy===0)).toBe(true);expect(purchase(s).inventory).toEqual(inventory)})
 it('moves custom purchases home without buying them twice',()=>{let s=seed();s.extras=[{id:'x',name:'Coffee',quantity:2,unit:'pcs'}];s.checked=shopping(s).map(l=>l.key);s=purchase(s);expect(s.inventory.find(i=>i.name==='Coffee')?.quantity).toBe(2);expect(shopping(s)[0].buy).toBe(0);expect(purchase(s).inventory).toEqual(s.inventory)})
 it('deducts available ingredients without negative amounts',()=>{const s=seed();const lines=recipeInfo(recipes[0],s,8).lines;const after=consume(s.inventory,lines);expect(after.every(i=>i.quantity>0)).toBe(true);expect(after.find(i=>i.ingredient==='spinach')).toBeUndefined()})
})
describe('recommendations',()=>{
 it('honors diet, excluded ingredients and time limits',()=>{const s=seed();s.profile={...s.profile,diet:'vegan',dislikes:['coconut'],maxTime:25};const result=recommendations(s);expect(result.length).toBeGreaterThan(0);expect(result.every(x=>x.recipe.diet==='vegan'&&x.recipe.time<=25&&!x.recipe.ingredients.some(i=>i.ingredient==='coconut'))).toBe(true)})
 it('changes ranking when profile priorities change',()=>{const s=seed();const a=recommendations(s).map(x=>x.recipe.id);s.profile={...s.profile,likes:['Everyday'],budget:1,environment:1};expect(recommendations(s).map(x=>x.recipe.id)).not.toEqual(a)})
 it('supports empty inventory and no eligible recipes',()=>{const s=seed();s.inventory=[];expect(recommendations(s).length).toBe(16);s.profile.maxTime=1;expect(recommendations(s)).toEqual([])})
})
