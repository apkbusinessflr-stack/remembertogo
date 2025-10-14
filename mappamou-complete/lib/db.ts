export type Place={ id:number; slug:string; name:string; country:string; lat:number; lng:number; tags?:string[]; visited?:boolean };
export type List={ slug:string; title:string; country?:string; category:string; places:number[] };
export const places:Place[]=[
  { id:1, slug:'praia-da-urca', name:'Praia da Ursa', country:'PT', lat:38.7903, lng:-9.4889, tags:['wild','scenic']},
  { id:2, slug:'praia-do-carvalhal', name:'Praia do Carvalhal', country:'PT', lat:38.2816, lng:-8.7780, tags:['family']},
  { id:3, slug:'praia-da-marinha', name:'Praia da Marinha', country:'PT', lat:37.0902, lng:-8.4127, tags:['cliffs','iconic']},
  { id:4, slug:'praia-de-benagil', name:'Praia de Benagil', country:'PT', lat:37.0869, lng:-8.4250, tags:['cave','boat']}
];
export const lists:List[]=[{ slug:'portugal-beaches', title:'Portugal • Beaches', country:'PT', category:'beach', places:[1,2,3,4]}];
export function getList(slug:string){ return lists.find(l=>l.slug===slug)||null; }
export function getPlace(slug:string){ return places.find(p=>p.slug===slug)||null; }
export function getPlacesByIds(ids:number[]){ return places.filter(p=>ids.includes(p.id)); }
