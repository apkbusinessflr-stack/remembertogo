import { NextResponse } from "next/server"; export async function GET(){ return NextResponse.json({ items:[{type:'visited',user:'alex',text:'visited Praia da Ursa'}] }); }
