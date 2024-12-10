"use strict";Object.defineProperty(exports,Symbol.toStringTag,{value:"Module"});const w={uint8:1,uint16:2,uint32:4,int8:1,int16:2,int32:4,float32:4,float64:8,string:1,boolean:1,"uint8[]":1,"uint16[]":2,"uint32[]":4,"int8[]":1,"int16[]":2,"int32[]":4,"float32[]":4,"float64[]":8,"string[]":1,"boolean[]":1,custom:0};function y(c,f){const{schema:u,offset:l=0,endian:g="big",validate:i}=f,r={},F=[...Object.entries(u)].sort(S);let a=l;for(const[o,E]of F){const{type:d,offset:m=a,byte:h=w[d]||0,count:k=1,endian:U=g}=E,n=_(h,k),s=A(c,m,U);switch(d){case"uint8":r[o]=s.getUint8(0),a+=n;break;case"uint16":r[o]=s.getUint16(0),a+=n;break;case"uint32":r[o]=s.getUint32(0),a+=n;break;case"int8":r[o]=s.getInt8(0),a+=n;break;case"int16":r[o]=s.getInt16(0),a+=n;break;case"int32":r[o]=s.getInt32(0),a+=n;break;case"float32":r[o]=s.getFloat32(0),a+=n;break;case"float64":r[o]=s.getFloat64(0),a+=n;break;case"string":{const e=[];for(let t=0;t<n;t+=1)e.push(s.getUint8(t));r[o]=String.fromCharCode(...e),a+=n;break}case"boolean":r[o]=s.getUint8(0)!==0,a+=n;break;case"uint8[]":{const e=[];for(let t=0;t<n;t+=1)e.push(s.getUint8(t));r[o]=e,a+=n;break}case"uint16[]":{const e=[];for(let t=0;t<n;t+=2)e.push(s.getUint16(t));r[o]=e,a+=n;break}case"uint32[]":{const e=[];for(let t=0;t<n;t+=4)e.push(s.getUint32(t));r[o]=e,a+=n;break}case"int8[]":{const e=[];for(let t=0;t<n;t+=1)e.push(s.getInt8(t));r[o]=e,a+=n;break}case"int16[]":{const e=[];for(let t=0;t<n;t+=2)e.push(s.getInt16(t));r[o]=e,a+=n;break}case"int32[]":{const e=[];for(let t=0;t<n;t+=4)e.push(s.getInt32(t));r[o]=e,a+=n;break}case"float32[]":{const e=[];for(let t=0;t<n;t+=4)e.push(s.getFloat32(t));r[o]=e,a+=n;break}case"float64[]":{const e=[];for(let t=0;t<n;t+=8)e.push(s.getFloat64(t));r[o]=e,a+=n;break}case"string[]":{const e=[];for(let b=0;b<n;b+=1)e.push(s.getUint8(b));if(typeof h=="number"){r[o]=String.fromCharCode(...e),a+=n;break}const t=[];let p=0;for(let b=0;b<Math.min(k,h.length);b++){const I=p+h[b];t.push(String.fromCharCode(...e.slice(p,I))),p=I}r[o]=t,a+=n;break}case"boolean[]":{const e=[];for(let t=0;t<n;t+=1)e.push(s.getUint8(t)!==0);r[o]=e,a+=n;break}case"custom":{const{value:e,length:t=n}=E.parse({reader:s,details:{offset:m,length:n,buffer:c,byte:h,count:k,endian:U,data:r}});r[o]=e,a+=t;break}default:throw new Error(`Unknown type: ${d}`)}}if(i){if(!i(r))throw new Error("Validation error");return{data:r,meta:{offset:l,length:a-l}}}else return{data:r,meta:{offset:l,length:a-l}}}function S(c,f){const u=i=>i==null?Number.MAX_SAFE_INTEGER-1:i==="last"?Number.MAX_SAFE_INTEGER:i==="first"?-Number.MAX_SAFE_INTEGER:i,l=u(c[1].order),g=u(f[1].order);return l-g}function _(c,f){if(Array.isArray(c)){let u=0;for(let l=0;l<Math.min(f,c.length);l++)u+=c[l];return u}else return c*f}function A(c,f,u){const l=new DataView(c,f),g=u==="little";return{getUint8:i=>l.getUint8(i),getUint16:i=>l.getUint16(i,g),getUint32:i=>l.getUint32(i,g),getInt8:i=>l.getInt8(i),getInt16:i=>l.getInt16(i,g),getInt32:i=>l.getInt32(i,g),getFloat32:i=>l.getFloat32(i,g),getFloat64:i=>l.getFloat64(i,g)}}exports.readBin=y;