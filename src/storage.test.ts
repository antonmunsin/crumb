import { afterEach, describe, expect, it, vi } from 'vitest'
import { seed } from './data'
import { readState, saveState } from './storage'
afterEach(()=>vi.unstubAllGlobals())
describe('browser persistence',()=>{
 it('restores the full household and shopping trip',()=>{let saved='';vi.stubGlobal('localStorage',{getItem:()=>saved||null,setItem:(_k:string,v:string)=>{saved=v}});const state=seed();state.profile.likes=['Asian'];state.selected=[{id:'selected',recipe:'green-pasta',servings:3}];state.extras=[{id:'extra',name:'Coffee',quantity:1,unit:'pcs'}];state.checked=['coffee'];expect(saveState(state)).toBe(true);expect(readState().state).toEqual(state)})
 it('starts a seeded demo when storage is empty',()=>{vi.stubGlobal('localStorage',{getItem:()=>null});expect(readState().state.inventory.length).toBeGreaterThan(0);expect(readState().warning).toBe('')})
 it('recovers from malformed saved data',()=>{vi.stubGlobal('localStorage',{getItem:()=>'{broken'});expect(readState().warning).not.toBe('');expect(readState().state.selected).toEqual([])})
 it('reports unavailable storage without crashing',()=>{vi.stubGlobal('localStorage',{getItem:()=>{throw Error('blocked')},setItem:()=>{throw Error('blocked')}});expect(readState().warning).not.toBe('');expect(saveState(seed())).toBe(false)})
})
