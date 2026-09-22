import { useRef, useState } from "react";
import { Camera, ImagePlus, RotateCcw, Loader2, Leaf, Recycle } from "lucide-react";

const recyclable = new Set(["cardboard","glass","metal","paper","plastic"]);
const pretty=(v:string)=>v.replace(/_/g," ").replace(/\b\w/g,c=>c.toUpperCase());

export default function Scan(){
 const inputRef=useRef<HTMLInputElement>(null);
 const [preview,setPreview]=useState<string|null>(null);
 const [result,setResult]=useState<{label:string;confidence:number}|null>(null);
 const [loading,setLoading]=useState(false);
 const [error,setError]=useState<string|null>(null);
 const reset=()=>{setPreview(null);setResult(null);setError(null);if(inputRef.current)inputRef.current.value=""};
 const classify=async(file:File)=>{
  setLoading(true);setError(null);setResult(null);setPreview(URL.createObjectURL(file));
  try{
   const ort=await import("onnxruntime-web");
   const image=await createImageBitmap(file), size=224, canvas=document.createElement("canvas");
   canvas.width=size;canvas.height=size;const ctx=canvas.getContext("2d",{willReadFrequently:true});
   if(!ctx)throw new Error("canvas");
   ctx.drawImage(image,0,0,size,size);
   const px=ctx.getImageData(0,0,size,size).data, mean=[.485,.456,.406], std=[.229,.224,.225];
   const data=new Float32Array(3*size*size);
   for(let y=0;y<size;y++)for(let x=0;x<size;x++){const p=(y*size+x)*4,i=y*size+x;data[i]=(px[p]/255-mean[0])/std[0];data[size*size+i]=(px[p+1]/255-mean[1])/std[1];data[2*size*size+i]=(px[p+2]/255-mean[2])/std[2]}
   const session=await ort.InferenceSession.create("/recycle-model.onnx");
   const out=await session.run({images:new ort.Tensor("float32",data,[1,3,size,size])});
   const logits=out.logits.data as Float32Array;let best=0;
   for(let i=1;i<logits.length;i++)if(logits[i]>logits[best])best=i;
   const exps=Array.from(logits,v=>Math.exp(v-logits[best])),sum=exps.reduce((a,b)=>a+b,0);
   const classes=["cardboard","glass","metal","paper","plastic","food organics","miscellaneous trash","textile trash","vegetation"];
   setResult({label:classes[best],confidence:exps[best]/sum});
  }catch(e){console.error(e);setError("The classifier model is still being published. Try again in a moment.");}
  finally{setLoading(false)}
 };
 return <main className="min-h-screen parchment-texture px-6 py-16"><div className="mx-auto max-w-3xl">
  <div className="mb-10 text-center"><div className="mx-auto mb-5 flex h-16 w-16 items-center justify-center rounded-full bg-[hsl(var(--gold)/.18)]"><Recycle className="h-8 w-8 text-[hsl(var(--burgundy))]"/></div><h1 className="text-5xl font-semibold">RecycleCheck</h1><p className="mx-auto mt-4 max-w-xl text-lg text-muted-foreground">Take a picture of an item and find out whether it belongs in the recycling bin.</p></div>
  <div className="rounded-2xl border border-border bg-card/90 p-6 shadow-xl">{preview?<div className="space-y-5"><img src={preview} alt="Selected item" className="mx-auto aspect-square w-full max-w-md rounded-xl object-cover"/>{loading&&<div className="flex items-center justify-center gap-3 py-5 text-muted-foreground"><Loader2 className="h-5 w-5 animate-spin"/>Analyzing your photo...</div>}{result&&<div className="rounded-xl border border-border bg-background p-6 text-center"><div className="mx-auto mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-[hsl(var(--gold)/.2)]">{recyclable.has(result.label)?<Recycle className="h-7 w-7"/>:<Leaf className="h-7 w-7"/>}</div><p className="text-sm uppercase tracking-[.2em] text-muted-foreground">Detected</p><p className="mt-1 text-xl font-medium">{pretty(result.label)}</p><p className="mt-3 text-3xl font-semibold">{recyclable.has(result.label)?"♻️ Recyclable":"🚫 Non-recyclable"}</p><p className="mt-2 text-sm text-muted-foreground">{Math.round(result.confidence*100)}% model confidence</p></div>}{error&&<p className="rounded-lg bg-destructive/10 p-4 text-center text-sm text-destructive">{error}</p>}<button onClick={reset} className="mx-auto flex items-center gap-2 rounded-lg border border-border px-5 py-3 font-medium hover:bg-secondary"><RotateCcw className="h-4 w-4"/>Scan another</button></div>:<div className="rounded-xl border-2 border-dashed border-border p-12 text-center"><Camera className="mx-auto h-12 w-12 text-primary"/><h2 className="mt-5 text-2xl font-semibold">Scan an item</h2><p className="mx-auto mt-2 max-w-md text-muted-foreground">Use your camera on a phone or upload a photo from your device.</p><div className="mt-7 flex flex-col justify-center gap-3 sm:flex-row"><button onClick={()=>inputRef.current?.click()} className="inline-flex items-center justify-center gap-2 rounded-lg bg-primary px-6 py-3 font-medium text-primary-foreground"><Camera className="h-5 w-5"/>Take photo</button><button onClick={()=>inputRef.current?.click()} className="inline-flex items-center justify-center gap-2 rounded-lg border border-border px-6 py-3 font-medium hover:bg-secondary"><ImagePlus className="h-5 w-5"/>Choose image</button></div><input ref={inputRef} type="file" accept="image/*" capture="environment" className="hidden" onChange={e=>e.target.files?.[0]&&classify(e.target.files[0])}/></div>}</div>
  <p className="mt-5 text-center text-xs text-muted-foreground">Results are based on the model's trained categories and may differ from your local recycling rules.</p>
 </div></main>
}