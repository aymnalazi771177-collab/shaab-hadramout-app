(()=>{
"use strict";
const API="https://shaab-hadramout.pages.dev";
const TOKEN_KEY="shaab-admin-token";
const $=id=>document.getElementById(id);
const token=()=>sessionStorage.getItem(TOKEN_KEY)||"";
const names={
overview:"الرئيسية",storage:"إدارة مساحة التخزين",live:"البث المباشر",legends:"أساطير النادي",news:"الأخبار والتقارير",matches:"إدارة المباريات وحالتها",players:"اللاعبون والجهاز الفني",team:"اللاعبون والجهاز الفني",anthems:"الأناشيد",
transfers:"الانتقالات",media:"الصور والفيديو",archive:"ذاكرة النوارس",reels:"يوميات النوارس REELS",standings:"البطولات",
basketball:"كرة السلة",volleyball:"كرة الطائرة",handball:"كرة اليد",tennis:"التنس",taekwondo:"التايكواندو",
athletics:"ألعاب القوى",otherSports:"ألعاب أخرى",board:"مجلس الإدارة",presidents:"رؤساء النادي",
history:"تاريخ النادي",membership:"عضوية النادي",foundation:"المؤسسة المجتمعية",anthem:"الأناشيد",
store:"متجر النادي الرسمي",contact:"تواصل معنا",carousel:"السلايدر الرئيسي",notifications:"الإشعارات",appUpdates:"تحديثات التطبيق",exclusiveAlerts:"التنبيهات الحصرية",admins:"المشرفون والصلاحيات"
};
const permissionMap={players:"team",anthem:"anthems",storage:"admins",exclusiveAlerts:"customAlerts"};
const permissions=[
["live","البث المباشر"],["carousel","السلايدر الرئيسي"],["legends","أساطير النادي"],["news","الأخبار والتقارير"],["matches","المباريات والنتائج"],["team","اللاعبون والجهاز الفني"],
["transfers","الانتقالات"],["media","الصور والفيديو"],["archive","ذاكرة النوارس"],["reels","يوميات النوارس REELS"],["standings","الترتيب والبطولات"],
["basketball","كرة السلة"],["volleyball","كرة الطائرة"],["handball","كرة اليد"],["tennis","التنس"],["taekwondo","التايكواندو"],
["athletics","ألعاب القوى"],["otherSports","ألعاب أخرى"],["board","مجلس الإدارة"],["presidents","رؤساء النادي"],
["history","تاريخ النادي"],["membership","عضوية النادي"],["foundation","المؤسسة المجتمعية"],["anthems","الأناشيد"],
["store","متجر النادي الرسمي"],["contact","تواصل معنا"],["notifications","الإشعارات"],["appUpdates","تحديثات التطبيق"],["customAlerts","التنبيهات الحصرية"],["admins","إدارة المشرفين"]
];
const fields={
news:[{name:"title",label:"عنوان الخبر",required:true},{name:"is_urgent",label:"إرسال إشعار عاجل للمشجعين",type:"checkbox"},{name:"content",label:"نص الخبر",type:"textarea",full:true},{name:"image_url",label:"رابط الصورة الأساسية",type:"url"},{name:"image_file",label:"رفع الصورة الأساسية من الجهاز",type:"file",accept:"image/*",hint:"هذه الصورة تظهر في بطاقة الخبر وأعلى المقال."},{name:"gallery_files",label:"معرض الصور المصاحبة (يمكن اختيار عدة صور)",type:"file",accept:"image/*",multiple:true,full:true,hint:"اختر عدة صور دفعة واحدة. ستظهر هذه الصور في نهاية المقال."}],
matches:[{name:"opponent",label:"الفريق المنافس",required:true},{name:"match_date",label:"تاريخ المباراة",type:"date",required:true},{name:"match_time",label:"وقت المباراة",type:"time"},{name:"venue",label:"الملعب"},{name:"competition",label:"البطولة"},{name:"is_home",label:"موقع النادي",type:"select",options:[["1","على أرضنا"],["0","خارج أرضنا"]]},{name:"formation",label:"خطة التشكيلة",type:"select",options:[["4-3-3","4-3-3"],["4-2-3-1","4-2-3-1"],["4-4-2","4-4-2"],["3-5-2","3-5-2"],["5-3-2","5-3-2"]]},{name:"status",label:"حالة المباراة في التطبيق",type:"select",options:[["upcoming","ضمن المباريات القادمة"],["live","مباشرة الآن"],["finished","انتهى اللقاء ويظهر في النتائج"]]},{name:"home_score",label:"أهداف شعب حضرموت",type:"number"},{name:"away_score",label:"أهداف المنافس",type:"number"},{name:"opponent_logo_url",label:"رابط شعار المنافس",type:"url"},{name:"opponent_logo_file",label:"رفع شعار المنافس",type:"file",accept:"image/*"},{name:"home_logo_url",label:"رابط شعار النادي",type:"url"},{name:"home_logo_file",label:"رفع شعار النادي",type:"file",accept:"image/*"},{name:"notes",label:"تفاصيل إضافية",type:"textarea",full:true}],
players:[{name:"name",label:"اسم اللاعب",required:true},{name:"position",label:"المركز",type:"select",required:true,options:[["حراس المرمى","حراس المرمى"],["الدفاع","الدفاع"],["الوسط","الوسط"],["الهجوم","الهجوم"],["المدرب","الجهاز الفني"]]},{name:"number",label:"رقم القميص"},{name:"image_url",label:"رابط صورة اللاعب",type:"url"},{name:"image_file",label:"رفع صورة اللاعب",type:"file",accept:"image/*"},{name:"nationality",label:"الجنسية"},{name:"age",label:"العمر",type:"number"},{name:"height",label:"الطول (مثال: 188 سم)"},{name:"matches",label:"عدد المباريات",type:"number"},{name:"clean_sheets",label:"الشباك النظيفة (لحراس المرمى)",type:"number"},{name:"saves",label:"التصديات (لحراس المرمى)",type:"number"},{name:"goals",label:"الأهداف",type:"number"},{name:"assists",label:"التمريرات الحاسمة",type:"number"},{name:"tackles",label:"الافتكاكات",type:"number"},{name:"readiness",label:"الجاهزية (%)",type:"number"},{name:"bio",label:"نبذة عن اللاعب",type:"textarea",full:true}],
transfers:[{name:"player_name",label:"اسم اللاعب",required:true},{name:"direction",label:"نوع الحركة",type:"select",options:[["incoming","انتقال إلى النادي"],["outgoing","انتقال من النادي"]]},{name:"transfer_type",label:"نوع الانتقال",type:"select",options:[["permanent","انتقال نهائي"],["loan","إعارة"]]},{name:"from_club",label:"من نادي"},{name:"to_club",label:"إلى نادي"},{name:"transfer_date",label:"التاريخ",type:"date"},{name:"image_url",label:"رابط صورة اللاعب",type:"url"},{name:"image_file",label:"رفع صورة اللاعب",type:"file",accept:"image/*"},{name:"details",label:"تفاصيل الانتقال",type:"textarea",full:true}],
media:[{name:"title",label:"عنوان المادة",required:true},{name:"description",label:"الوصف",type:"textarea",full:true},{name:"media_type",label:"نوع المادة",type:"select",options:[["image","صورة"],["video","فيديو"]]},{name:"media_url",label:"رابط الملف",type:"url"},{name:"media_file",label:"رفع صورة أو فيديو",type:"file",accept:"image/*,video/mp4,video/webm,video/quicktime"}],
archive:[{name:"title",label:"عنوان المادة التاريخية",required:true},{name:"description",label:"الوصف والتفاصيل",type:"textarea",full:true},{name:"media_type",label:"نوع المادة",type:"select",options:[["image","صورة تاريخية"],["video","فيديو تاريخي"]]},{name:"media_url",label:"رابط الملف (اختياري عند الرفع)",type:"url"},{name:"media_file",label:"رفع الصورة أو الفيديو التاريخي",type:"file",accept:"image/*,video/mp4,video/webm,video/quicktime",hint:"يمكنك رفع ملف جديد أو إدخال رابط ملف محفوظ."}],
reels:[{name:"title",label:"عنوان الريل",required:true},{name:"caption",label:"الوصف أو النص",type:"textarea",full:true},{name:"media_type",label:"نوع الريل",type:"select",options:[["video","فيديو"],["image","صورة"]]},{name:"media_url",label:"رابط الفيديو أو الصورة",type:"url"},{name:"media_file",label:"رفع ملف الريل",type:"file",accept:"video/mp4,video/webm,video/quicktime,image/jpeg,image/png,image/webp"},{name:"thumbnail_url",label:"رابط صورة الغلاف",type:"url"},{name:"thumbnail_file",label:"رفع صورة الغلاف",type:"file",accept:"image/*"},{name:"sort_order",label:"ترتيب العرض",type:"number"},{name:"active",label:"إظهار الريل في التطبيق",type:"checkbox"}],
standings:[{name:"team_name",label:"اسم الفريق",required:true},{name:"logo_url",label:"رابط شعار الفريق",type:"url"},{name:"logo_file",label:"رفع شعار الفريق من الجهاز",type:"file",accept:"image/*"},{name:"played",label:"لعب",type:"number"},{name:"wins",label:"فاز",type:"number"},{name:"draws",label:"تعادل",type:"number"},{name:"losses",label:"خسر",type:"number"},{name:"goals_for",label:"الأهداف له",type:"number"},{name:"goals_against",label:"الأهداف عليه",type:"number"},{name:"points",label:"النقاط",type:"number"}],
anthem:[{name:"title",label:"اسم النشيد",required:true},{name:"description",label:"الوصف",type:"textarea",full:true},{name:"audio_url",label:"رابط الملف الصوتي",type:"url"},{name:"audio_file",label:"رفع ملف صوتي",type:"file",accept:"audio/mpeg,audio/mp4,audio/ogg,audio/wav,audio/aac"}],
history:[{name:"title",label:"عنوان الصفحة",required:true},{name:"founded_year",label:"سنة التأسيس"},{name:"content",label:"نبذة تاريخية",type:"textarea",full:true},{name:"achievements",label:"الإنجازات",type:"textarea",full:true}],
notifications:[{name:"title",label:"عنوان الإشعار",required:true},{name:"body",label:"نص الإشعار",type:"textarea",full:true,required:true}],
appUpdates:[{name:"app_version",label:"رقم الإصدار الجديد",required:true},{name:"title",label:"عنوان التنبيه",required:true},{name:"body",label:"رسالة التحديث",type:"textarea",full:true,required:true},{name:"audience",label:"الفئة المستهدفة",type:"select",options:[["all","جميع الزوار والأعضاء"],["members","الأعضاء فقط"],["visitors","الزوار فقط"]]}],
exclusiveAlerts:[{name:"title",label:"عنوان التنبيه الحصري",required:true},{name:"body",label:"النص المختصر الذي يظهر في الجرس",type:"textarea",full:true,required:true},{name:"content",label:"تفاصيل الخبر داخل الصفحة المستقلة",type:"textarea",full:true},{name:"cover_image",label:"رابط صورة الغلاف (اختياري)",type:"url"},{name:"cover_file",label:"رفع صورة الغلاف",type:"file",accept:"image/*"},{name:"gallery_files",label:"صور إضافية للخبر (يمكن اختيار عدة صور)",type:"file",accept:"image/*",multiple:true,full:true},{name:"audience",label:"الفئة المستهدفة",type:"select",options:[["all","جميع الزوار والأعضاء"],["members","الأعضاء فقط"],["visitors","الزوار فقط"]]}],
admins:[{name:"username",label:"اسم المستخدم (إنجليزي)",required:true,createOnly:true},{name:"display_name",label:"اسم المشرف",required:true},{name:"password",label:"كلمة المرور",type:"password",required:true,optionalEdit:true},{name:"permissions",label:"صلاحيات المشرف",type:"permissions",full:true}],
carousel:[{name:"title",label:"عنوان الشريحة",required:true},{name:"content",label:"التفاصيل",type:"textarea",full:true},{name:"image_url",label:"رابط الصورة",type:"url"},{name:"image_file",label:"رفع صورة",type:"file",accept:"image/*"},{name:"sort_order",label:"ترتيب الظهور",type:"number"},{name:"active",label:"إظهار الشريحة",type:"checkbox"}],
section:[{name:"title",label:"العنوان",required:true},{name:"content",label:"التفاصيل",type:"textarea",full:true},{name:"image_url",label:"رابط الصورة",type:"url"},{name:"image_file",label:"رفع صورة",type:"file",accept:"image/*"},{name:"media_url",label:"رابط ملف أو فيديو",type:"url"},{name:"media_file",label:"رفع ملف أو فيديو",type:"file",accept:"image/*,video/mp4,video/webm,video/quicktime"},{name:"price",label:"السعر (إن وجد)"},{name:"sort_order",label:"ترتيب الظهور",type:"number"},{name:"active",label:"إظهار المحتوى",type:"checkbox"}],
legends:[{name:"name",label:"اسم الأسطورة",required:true},{name:"role",label:"مركزه أو صفته في النادي"},{name:"active_years",label:"سنوات تمثيله للنادي"},{name:"birth_date",label:"تاريخ الميلاد"},{name:"death_date",label:"تاريخ الوفاة (إن وجد)"},{name:"image_url",label:"رابط الصورة الشخصية",type:"url"},{name:"image_file",label:"رفع الصورة الشخصية",type:"file",accept:"image/*",hint:"الصورة الأساسية التي تظهر في بطاقة الأسطورة."},{name:"bio",label:"السيرة والمعلومات",type:"textarea",full:true},{name:"photo_files",label:"صور الأسطورة (يمكن اختيار عدة صور)",type:"file",accept:"image/*",multiple:true,full:true},{name:"video_files",label:"فيديوهات الأسطورة (يمكن اختيار عدة فيديوهات)",type:"file",accept:"video/mp4,video/webm,video/quicktime",multiple:true,full:true},{name:"sort_order",label:"ترتيب الظهور",type:"number"},{name:"active",label:"إظهار الأسطورة في التطبيق",type:"checkbox"}],
};
const configs={
legends:{endpoint:"/api/legends?admin=1",key:"legends",cols:["name","role","active_years","active"],labels:["اسم الأسطورة","الصفة","سنوات المسيرة","الحالة"]},
news:{endpoint:"/api/news",key:"news",cols:["title","created_at"],labels:["العنوان","تاريخ الإضافة"]},
matches:{endpoint:"/api/matches",key:"matches",cols:["opponent","match_date","status"],labels:["المنافس","التاريخ","حالة المباراة"]},
players:{endpoint:"/api/players",key:"players",cols:["name","position","number","age","matches"],labels:["الاسم","المركز","الرقم","العمر","المباريات"]},
transfers:{endpoint:"/api/transfers",key:"transfers",cols:["player_name","direction","transfer_date"],labels:["اللاعب","الاتجاه","التاريخ"]},
media:{endpoint:"/api/gallery",key:"media",cols:["title","media_type","created_at"],labels:["العنوان","النوع","تاريخ الإضافة"]},
archive:{endpoint:"/api/archive",key:"media",cols:["title","media_type","created_at"],labels:["العنوان","النوع","تاريخ الإضافة"]},
reels:{endpoint:"/api/reels",key:"reels",cols:["title","media_type","sort_order","active"],labels:["العنوان","النوع","الترتيب","الحالة"]},
standings:{endpoint:"/api/standings",key:"standings",cols:["logo_url","team_name","played","points"],labels:["شعار الفريق","الفريق","لعب","النقاط"]},
anthem:{endpoint:"/api/anthems",key:"anthems",cols:["title","description"],labels:["النشيد","الوصف"]},
history:{endpoint:"/api/history",key:"history",cols:["title","founded_year"],labels:["العنوان","سنة التأسيس"]},
notifications:{endpoint:"/api/notifications",key:"notifications",cols:["title","created_at"],labels:["العنوان","تاريخ النشر"]},
appUpdates:{endpoint:"/api/notifications?kind=app_update&admin=1",key:"notifications",cols:["app_version","title","audience","created_at"],labels:["الإصدار","عنوان التنبيه","الفئة المستهدفة","تاريخ النشر"]},
exclusiveAlerts:{endpoint:"/api/notifications?kind=exclusive&admin=1",key:"notifications",cols:["title","audience","created_at"],labels:["عنوان التنبيه الحصري","الفئة المستهدفة","تاريخ النشر"]},
admins:{endpoint:"/api/admins",key:"admins",cols:["display_name","username","permissions"],labels:["اسم المشرف","اسم المستخدم","الصلاحيات"]},
carousel:{endpoint:"/api/carousel",key:"slides",cols:["title","sort_order","active"],labels:["العنوان","الترتيب","الحالة"]},
live:{endpoint:"/api/live",key:"stream",cols:["title","stream_type","enabled"],labels:["عنوان البث","نوع المصدر","الحالة"]}
};
const genericKeys=["basketball","volleyball","handball","tennis","taekwondo","athletics","otherSports","board","presidents","membership","foundation","store","contact"];
for(const k of genericKeys)configs[k]={endpoint:"/api/sections?section="+encodeURIComponent(k),key:"items",cols:["title","price","sort_order","active"],labels:["العنوان","السعر","الترتيب","الحالة"],generic:true};
let current="overview",items=[],editing=null,admin=null,showHidden=false,selectedTournamentId="";
const esc=v=>String(v??"").replace(/[&<>"']/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"}[c]));
function toast(message){const el=$("toast");el.textContent=message;el.classList.add("show");setTimeout(()=>el.classList.remove("show"),2300)}
async function api(path,options={}){const headers=new Headers(options.headers||{});if(token())headers.set("Authorization","Bearer "+token());if(options.body&&!(options.body instanceof FormData)&&typeof options.body!=="string"){headers.set("Content-Type","application/json");options={...options,body:JSON.stringify(options.body)}}const response=await fetch(API+path,{...options,headers,cache:options.cache||"no-store"});let data={};try{data=await response.json()}catch{}if(!response.ok||data.success===false)throw new Error(data.message||"تعذر تنفيذ الطلب");return data}
async function compressImageForUpload(file){
 if(!file||!file.type.startsWith("image/")||file.type==="image/gif")return file;
 if(!["image/jpeg","image/png","image/webp"].includes(file.type))return file;
 if(typeof createImageBitmap!=="function")return file;
 let bitmap,canvas;
 try{
  bitmap=await createImageBitmap(file);
  canvas=document.createElement("canvas");
  canvas.width=bitmap.width;
  canvas.height=bitmap.height;
  const context=canvas.getContext("2d",{alpha:true});
  if(!context)return file;
  context.drawImage(bitmap,0,0);
  const blob=await new Promise(resolve=>canvas.toBlob(resolve,"image/webp",0.94));
  if(!blob||blob.size>=file.size)return file;
  const base=String(file.name||"image").replace(/\\.[^.]+$/,"")||"image";
  return new File([blob],base+".webp",{type:"image/webp",lastModified:file.lastModified||Date.now()});
 }catch(error){
  console.warn("Image optimization skipped; original file will be uploaded.",error);
  return file;
 }finally{
  if(bitmap)bitmap.close();
  if(canvas){canvas.width=0;canvas.height=0}
 }
}
let ffmpegInstance=null,ffmpegLoading=null;
function loadScriptOnce(src,globalName){
 if(window[globalName])return Promise.resolve(window[globalName]);
 if(window.__shaabScriptLoads?.[src])return window.__shaabScriptLoads[src];
 window.__shaabScriptLoads=window.__shaabScriptLoads||{};
 window.__shaabScriptLoads[src]=new Promise((resolve,reject)=>{
  const script=document.createElement("script");script.src=src;script.async=true;
  script.onload=()=>window[globalName]?resolve(window[globalName]):reject(new Error("تعذر تهيئة مكتبة ضغط الفيديو"));
  script.onerror=()=>reject(new Error("تعذر تحميل مكتبة ضغط الفيديو؛ سيتم رفع الفيديو الأصلي"));
  document.head.appendChild(script);
 });
 return window.__shaabScriptLoads[src];
}
async function getVideoCompressor(){
 if(ffmpegInstance?.loaded)return ffmpegInstance;
 if(ffmpegLoading)return ffmpegLoading;
 ffmpegLoading=(async()=>{
  await loadScriptOnce("https://cdnjs.cloudflare.com/ajax/libs/ffmpeg/0.12.10/umd/ffmpeg.js","FFmpegWASM");
  const engine=new window.FFmpegWASM.FFmpeg();
  const base="https://cdnjs.cloudflare.com/ajax/libs/ffmpeg-core/0.12.6/umd";
  const wrapper="https://cdnjs.cloudflare.com/ajax/libs/ffmpeg/0.12.10/umd";
  const blobURL=async(url,type)=>{
   const response=await fetch(url);
   if(!response.ok)throw new Error("تعذر تنزيل مكوّن ضغط الفيديو");
   return URL.createObjectURL(new Blob([await response.arrayBuffer()],{type}));
  };
  await engine.load({
   classWorkerURL:await blobURL(wrapper+"/814.ffmpeg.js","text/javascript"),
   coreURL:await blobURL(base+"/ffmpeg-core.js","text/javascript"),
   wasmURL:await blobURL(base+"/ffmpeg-core.wasm","application/wasm")
  });
  ffmpegInstance=engine;
  return engine;
 })().catch(error=>{ffmpegLoading=null;throw error});
 return ffmpegLoading;
}
async function compressVideoForUpload(file){
 if(!file||!file.type.startsWith("video/"))return file;
 if(!["video/mp4","video/webm","video/quicktime"].includes(file.type))return file;
 let engine,inputName,outputName;
 try{
  setNotice("جارٍ تجهيز أداة ضغط الفيديو لأول مرة؛ قد يستغرق تحميلها بعض الوقت…");
  engine=await getVideoCompressor();
  const id="shaab_"+Date.now()+"_"+Math.random().toString(36).slice(2);
  const ext=file.type==="video/webm"?"webm":file.type==="video/quicktime"?"mov":"mp4";
  inputName=id+"_input."+ext;outputName=id+"_compressed.mp4";
  setNotice("جارٍ ضغط الفيديو مع الحفاظ على أبعاده وصوته…");
  await engine.writeFile(inputName,new Uint8Array(await file.arrayBuffer()));
  await engine.exec(["-i",inputName,"-map","0:v:0","-map","0:a?","-c:v","libx264","-preset","veryfast","-crf","27","-pix_fmt","yuv420p","-c:a","aac","-b:a","128k","-movflags","+faststart",outputName]);
  const data=await engine.readFile(outputName);
  const bytes=data instanceof Uint8Array?data:new Uint8Array(data);
  if(!bytes.length)throw new Error("ملف الفيديو المضغوط فارغ");
  const compressed=new File([bytes],(String(file.name||"video").replace(/\\.[^.]+$/,"")||"video")+".mp4",{type:"video/mp4",lastModified:file.lastModified||Date.now()});
  if(compressed.size>=file.size){
   setNotice("لم ينتج الضغط حجماً أصغر؛ سيتم رفع الفيديو الأصلي للحفاظ على جودته.");
   return file;
  }
  setNotice("اكتمل ضغط الفيديو: "+(file.size/1048576).toFixed(1)+" إلى "+(compressed.size/1048576).toFixed(1)+" ميجابايت.");
  return compressed;
 }catch(error){
  console.warn("Video optimization skipped; original file will be uploaded.",error);
  setNotice("تعذر ضغط الفيديو على هذا الجهاز؛ سيتم رفع الملف الأصلي دون تغييره.","error");
  return file;
 }finally{
  if(engine){
   for(const name of [inputName,outputName])if(name)try{await engine.deleteFile(name)}catch{}
  }
 }
}
async function upload(file,scope){
 let optimized=file;
 if(file?.type?.startsWith("video/"))optimized=await compressVideoForUpload(file);
 else optimized=await compressImageForUpload(file);
 const fd=new FormData();fd.append("images",optimized);fd.append("scope",scope);
 const d=await api("/api/media",{method:"POST",body:fd});
 if(!d.media||!d.media[0])throw new Error("لم يتم استلام رابط الملف بعد الرفع");
 return d.media[0]
}
function setNotice(message,type=""){const n=$("sectionNotice");n.className="notice"+(type?" "+type:"");n.innerHTML="<b>"+esc(names[current]||"إدارة القسم")+"</b><p>"+esc(message)+"</p>"}
function formatValue(key,value){if(value===null||value===undefined||value==="")return "—";if(key==="active")return Number(value)===0?"مخفي":"ظاهر";const map={incoming:"وارد",outgoing:"صادر",permanent:"نهائي",loan:"إعارة",upcoming:"قادمة",live:"مباشرة",finished:"انتهت",postponed:"مؤجلة",cancelled:"ملغاة",image:"صورة",video:"فيديو",all:"الجميع",members:"الأعضاء",visitors:"الزوار"};if(map[value])return map[value];if(key==="permissions"&&Array.isArray(value))return value.map(v=>names[v]||v).join("، ");return String(value)}
function renderReelsTable(){
 const wrap=$("recordsWrap"),count=$("recordCount"),q=($("search").value||"").trim().toLowerCase();
 const filtered=items.filter(x=>(showHidden||Number(x.active)!==0)&&JSON.stringify(x).toLowerCase().includes(q));
 count.textContent=filtered.length+" ريل";
 if(!filtered.length){wrap.innerHTML='<div class="empty">'+(items.length?"لا توجد نتائج مطابقة.":"لا توجد ريلز بعد. أضف عنواناً ثم أضف الحالات داخله.")+'</div>';return}
 wrap.innerHTML='<div class="reel-groups-list">'+filtered.map(g=>'<article class="reel-group-card"><div class="reel-group-info"><b>'+esc(g.title)+'</b><span>'+((g.stories||[]).length)+' حالة · '+(Number(g.active)===0?'مخفي':'ظاهر')+' · الترتيب '+Number(g.sort_order||0)+'</span></div><div class="record-actions"><button class="edit-record" data-edit="'+g.id+'">إدارة الحالات</button><button class="delete-record" data-delete="'+g.id+'">حذف الريل</button></div></article>').join('')+'</div>';
}
function reelStoryRow(story={}){
 const id=story.id||"",url=story.media_url||"",type=story.media_type||"video";
 return '<div class="reel-story-row" data-story-id="'+esc(id)+'" data-media-url="'+esc(url)+'" data-media-key="'+esc(story.media_key||"")+'" data-media-type="'+esc(type)+'" data-thumbnail-url="'+esc(story.thumbnail_url||"")+'" data-thumbnail-key="'+esc(story.thumbnail_key||"")+'"><div class="reel-story-row-head"><b>حالة داخل الريل</b><div><button type="button" data-story-up>↑</button><button type="button" data-story-down>↓</button><button type="button" data-story-remove>حذف</button></div></div><label>وصف الحالة (اختياري)</label><textarea data-story-caption rows="2">'+esc(story.caption||"")+'</textarea><label>ملف الصورة أو الفيديو</label><input type="file" data-story-file accept="video/mp4,video/webm,video/quicktime,image/jpeg,image/png,image/webp"><small>'+(url?'الملف الحالي محفوظ. اختر ملفاً جديداً لاستبداله.':'اختر صورة أو فيديو لهذه الحالة.')+'</small><label>صورة الغلاف (اختياري)</label><input type="file" data-story-thumb accept="image/*"></div>';
}
function openReelsEditor(group=null){
 editing=group?group.id:null;
 $("modalTitle").textContent=(group?"تعديل وإدارة ":"إنشاء ")+ "ريل يوميات النوارس";
 const stories=group?.stories||[];
 $("formFields").innerHTML='<div class="reels-editor"><div class="form-field"><label>اسم الريل / المجموعة</label><input name="reel_title" required maxlength="180" value="'+esc(group?.title||"")+'" placeholder="مثال: سفر"></div><div class="form-field"><label>ترتيب ظهور الريل</label><input name="reel_sort_order" type="number" min="0" value="'+Number(group?.sort_order||0)+'"></div><label class="check-field"><input type="checkbox" name="reel_active" '+(group&&Number(group.active)===0?'':'checked')+'><span>إظهار الريل في التطبيق</span></label><div class="reel-stories-head"><b>الحالات داخل هذا الريل</b><button type="button" id="addReelStory" class="add-story-btn">＋ إضافة حالة</button></div><div id="reelStoryRows">'+stories.map(reelStoryRow).join('')+'</div><small>مثال: أنشئ ريل باسم «سفر»، ثم أضف تحته كل الصور والفيديوهات الخاصة بالسفر بالترتيب الذي تريده.</small></div>';
 $("modal").classList.add("open");
}
async function saveReelGroup(event){
 event.preventDefault();
 const title=$("formFields").querySelector('[name="reel_title"]').value.trim();
 const sort_order=Number($("formFields").querySelector('[name="reel_sort_order"]').value||0);
 const active=$("formFields").querySelector('[name="reel_active"]').checked?1:0;
 const rows=[...$("reelStoryRows").querySelectorAll(".reel-story-row")];
 if(!title)throw new Error("اكتب اسم الريل أولاً");
 if(!rows.length)throw new Error("أضف حالة واحدة على الأقل داخل الريل");
 const stories=[];
 for(let i=0;i<rows.length;i++){
  const row=rows[i],file=row.querySelector("[data-story-file]").files[0],thumb=row.querySelector("[data-story-thumb]").files[0];
  let media_url=row.dataset.mediaUrl||"",media_key=row.dataset.mediaKey||"",media_type=row.dataset.mediaType||"video",thumbnail_url=row.dataset.thumbnailUrl||"",thumbnail_key=row.dataset.thumbnailKey||"";
  if(file){const uploaded=await upload(file,"reels");media_url=uploaded.url;media_key=uploaded.key;media_type=uploaded.media_type==="image"?"image":"video"}
  if(thumb){const uploaded=await upload(thumb,"reels");thumbnail_url=uploaded.url;thumbnail_key=uploaded.key}
  if(!media_url)throw new Error("اختر ملفاً للحالة رقم "+(i+1));
  stories.push({id:Number(row.dataset.storyId)||null,caption:row.querySelector("[data-story-caption]").value.trim(),media_url,media_key,media_type,thumbnail_url,thumbnail_key,sort_order:i});
 }
 const body={title,sort_order,active,stories};
 const endpoint="/api/reels"+(editing!==null?"?id="+encodeURIComponent(editing):"");
 await api(endpoint,{method:editing!==null?"PUT":"POST",body});
 closeEditor();toast("تم حفظ الريل وحالاته بنجاح");await loadSection("reels");loadStats();
}
function renderTable(){if(current==="reels"){renderReelsTable();return}const wrap=$("recordsWrap"),count=$("recordCount"),q=($("search").value||"").trim().toLowerCase();const filtered=items.filter(item=>(showHidden||item.active===undefined||Number(item.active)!==0)&&JSON.stringify(item).toLowerCase().includes(q));count.textContent=filtered.length+" عنصر";if(!filtered.length){wrap.innerHTML='<div class="empty">'+(items.length?"لا توجد نتائج مطابقة.":"لا توجد عناصر في هذا القسم حتى الآن.")+"</div>";return}
const cfg=configs[current];const heads=cfg.cols.map((k,i)=>"<th>"+esc(cfg.labels[i])+"</th>").join("");const rows=filtered.map(item=>{const cells=cfg.cols.map(k=>{let v=item[k];if(k==="permissions"&&typeof v==="string"){try{v=JSON.parse(v)}catch{}}return "<td>"+esc(formatValue(k,v))+"</td>"}).join("");const actions=current==="history"?"<button class='edit-record' data-edit='"+item.id+"'>تعديل</button>":"<div class='record-actions'><button class='edit-record' data-edit='"+item.id+"'>تعديل</button><button class='delete-record' data-delete='"+item.id+"'>حذف</button></div>";return "<tr>"+cells+"<td>"+actions+"</td></tr>"}).join("");wrap.innerHTML="<table class='records-table'><thead><tr>"+heads+"<th>الإجراءات</th></tr></thead><tbody>"+rows+"</tbody></table>"}
async function loadSection(key){current=key;const cfg=configs[key];$("search").value="";$("tableName").textContent="قائمة "+(names[key]||"المحتوى");$("add").style.display=key==="history"?"none":"inline-flex";$("filter").style.display=["reels","carousel"].includes(key)||cfg?.generic?"inline-flex":"none";$("filter").textContent=showHidden?"عرض الظاهر":"عرض الكل";if(!cfg){setNotice("هذا القسم غير مهيأ للربط بعد.");$("recordsWrap").innerHTML='<div class="empty">سيتم ربط هذا القسم في المرحلة التالية.</div>';return}
if(key==="live"){$("add").style.display="none";$("filter").style.display="none";setNotice("اربط قسم البث المباشر الموجود في الصفحة الرئيسية. أدخل رابط YouTube أو M3U8 أو MP4، ثم فعّل البث عند الجاهزية.");$("recordsWrap").innerHTML='<div class="notice" style="margin:14px 0"><b>إعداد البث المباشر</b><p>هذه الإعدادات تتحكم بالقسم الموجود في الصفحة الرئيسية، ولا تنشئ قسماً جديداً.</p></div><form id="liveStreamForm" class="form-grid" style="padding:16px;display:grid;gap:14px"><div class="form-field"><label for="liveTitle">عنوان البث</label><input id="liveTitle" maxlength="160" placeholder="مثال: البث المباشر لمباراة شعب حضرموت"></div><div class="form-field"><label for="liveType">نوع مصدر البث</label><select id="liveType"><option value="m3u8">M3U8 (بث مباشر)</option><option value="mp4">MP4 (ملف فيديو)</option><option value="youtube">YouTube</option></select></div><div class="form-field full"><label for="liveUrl">رابط البث أو الفيديو</label><input id="liveUrl" type="url" inputmode="url" placeholder="https://..." required><small>ضع رابط البث المباشر أو رابط فيديو MP4 أو رابط YouTube.</small></div><div class="form-field full"><label class="check-field"><input id="liveEnabled" type="checkbox"><span>تشغيل البث وإظهاره للزوار</span></label></div><div class="form-field full" style="display:flex;gap:10px;flex-wrap:wrap"><button class="add" type="submit" id="saveLive">حفظ إعدادات البث</button><button class="cancel-btn" type="button" id="stopLive">إيقاف البث</button></div></form>';try{const result=await api("/api/live");const stream=result.stream||{};$("liveTitle").value=stream.title||"";$("liveType").value=stream.stream_type||"m3u8";$("liveUrl").value=stream.stream_url||"";$("liveEnabled").checked=Number(stream.enabled)===1;$("recordCount").textContent=$("liveEnabled").checked?"البث مفعّل":"البث متوقف";const form=$("liveStreamForm");form.addEventListener("submit",async event=>{event.preventDefault();const body={title:$("liveTitle").value.trim(),stream_type:$("liveType").value,stream_url:$("liveUrl").value.trim(),enabled:$("liveEnabled").checked};try{await api("/api/live",{method:"PUT",body});toast("تم حفظ إعدادات البث بنجاح");$("recordCount").textContent=body.enabled?"البث مفعّل":"البث متوقف"}catch(error){toast(error.message)}});$("stopLive").addEventListener("click",async()=>{try{await api("/api/live",{method:"PUT",body:{title:$("liveTitle").value.trim(),stream_type:$("liveType").value,stream_url:$("liveUrl").value.trim(),enabled:false}});$("liveEnabled").checked=false;$("recordCount").textContent="البث متوقف";toast("تم إيقاف البث")}catch(error){toast(error.message)}})}catch(error){$("recordsWrap").innerHTML='<div class="empty">تعذر تحميل إعدادات البث: '+esc(error.message)+'</div>';setNotice(error.message,"error")}return}setNotice(key==="matches"?"من هنا تدير المباريات وتحدد حالة كل مباراة: قادمة أو انتهى اللقاء. ومن قسم البطولات تنشئ البطولات وتدير جداول ترتيبها.":"المحتوى المعروض هنا متصل بقاعدة بيانات النادي. يمكنك الإضافة والتعديل والحذف حسب صلاحيتك.");$("recordsWrap").innerHTML='<div class="empty">جارٍ تحميل البيانات...</div>';
try{let endpoint=cfg.endpoint;if(key==="standings"){const td=await api("/api/tournaments");const tournaments=td.tournaments||[];$("tournamentTools").hidden=false;$("tournamentSelect").innerHTML=tournaments.map(t=>"<option value='"+t.id+"'>"+esc(t.name)+(t.season_year?" — "+esc(t.season_year):"")+" ("+Number(t.teams_count||0)+" فريق)</option>").join("")||"<option value=''>لا توجد بطولات بعد</option>";if(!tournaments.length){selectedTournamentId="";$("add").style.display="none";$("recordsWrap").innerHTML='<div class="empty">أنشئ بطولة أولاً، ثم أضف فرقها وجدول ترتيبها.</div>';$("recordCount").textContent="0 فريق";return}if(!tournaments.some(t=>String(t.id)===String(selectedTournamentId)))selectedTournamentId=String(tournaments[0].id);$("tournamentSelect").value=selectedTournamentId;$("add").style.display="inline-flex";endpoint="/api/standings?tournament_id="+encodeURIComponent(selectedTournamentId)}else $("tournamentTools").hidden=true;const d=await api(endpoint);if(key==="history"){items=d.history?[{...d.history,id:1}]:[]}else items=d[cfg.key]||[];if(key==="appUpdates")items=items.filter(item=>item.type==="app_update");if(key==="exclusiveAlerts")items=items.filter(item=>item.type==="exclusive").map(item=>{let details={};try{details=JSON.parse(item.details_json||"{}")}catch{}return {...item,...details}});renderTable();if(key==="history"&&!items.length){$("recordsWrap").innerHTML='<div class="empty">لا توجد بيانات تاريخ محفوظة بعد.</div>'}}catch(e){$("recordsWrap").innerHTML='<div class="empty">'+esc(e.message)+"</div>";setNotice(e.message,"error")}}
function showView(key){if(key!=="overview"&&key!=="storage"&&!configs[key])return;current=key;document.querySelectorAll(".nav").forEach(b=>b.classList.toggle("active",b.dataset.view===key));$("overview").classList.toggle("active",key==="overview");$("generic").classList.toggle("active",key!=="overview"&&key!=="storage");$("storage").classList.toggle("active",key==="storage");$("pageTitle").textContent=names[key]||"لوحة الإدارة";$("sidebar").classList.remove("open");if(key==="storage")loadStorageUsage();else if(key!=="overview")loadSection(key);else loadStats();window.scrollTo({top:0,behavior:"smooth"})}
function fieldHtml(f,data,create){if(f.createOnly&&!create)return "";const value=data[f.name]??(f.name==="active"?1:f.name==="sort_order"?0:f.name==="is_home"?"1":f.name==="readiness"?90:f.name==="nationality"?"يمني":"");const required=f.required&&!(f.optionalEdit&&!create);let control="";if(f.type==="textarea")control="<textarea name='"+f.name+"' "+(required?"required":"")+">"+esc(value)+"</textarea>";else if(f.type==="select")control="<select name='"+f.name+"'>"+f.options.map(o=>"<option value='"+esc(o[0])+"' "+(String(value)===String(o[0])?"selected":"")+">"+esc(o[1])+"</option>").join("")+"</select>";else if(f.type==="checkbox")control="<label class='check-field'><input type='checkbox' name='"+f.name+"' "+(value===true||Number(value)===1||value==="1"?"checked":"")+"><span>"+esc(f.label)+"</span></label>";else if(f.type==="permissions")control="<div class='permission-grid'>"+permissions.map(p=>"<label><input type='checkbox' name='permission' value='"+p[0]+"' "+((data.permissions||[]).includes(p[0])?"checked":"")+">"+esc(p[1])+"</label>").join("")+"</div>";else if(f.type==="file")control="<input type='file' name='"+f.name+"' accept='"+esc(f.accept||"*/*")+"' "+(f.multiple?"multiple":"")+"><small>"+esc(f.hint||"يمكنك اختيار ملف من جهازك أو تركه فارغاً للاحتفاظ بالرابط الحالي.")+"</small>";else if(f.type==="time"){const parts=String(value||"").match(/^(\\d{1,2}):(\\d{2})$/);let hour="",minute="00",period="AM";if(parts){const h=Number(parts[1]);hour=String(h%12||12);period=h>=12?"PM":"AM";minute=parts[2]}control="<div class='match-time-picker' style='display:flex;gap:8px;align-items:center;flex-wrap:wrap'><select data-time-hour aria-label='الساعة'><option value=''>الساعة</option>"+Array.from({length:12},(_,i)=>"<option value='"+(i+1)+"' "+(hour===String(i+1)?"selected":"")+">"+(i+1)+"</option>").join("")+"</select><span>:</span><select data-time-minute aria-label='الدقائق'>"+Array.from({length:12},(_,i)=>String(i*5).padStart(2,"0")).map(m=>"<option value='"+m+"' "+(minute===m?"selected":"")+">"+m+"</option>").join("")+"</select><select data-time-period aria-label='الفترة'><option value='AM' "+(period==="AM"?"selected":"")+">صباحاً</option><option value='PM' "+(period==="PM"?"selected":"")+">مساءً</option></select></div><input type='hidden' name='"+f.name+"' value='"+esc(value)+"'>";}else control="<input name='"+f.name+"' type='"+(f.type||"text")+"' value='"+esc(value)+"' "+(required?"required":"")+(f.type==="number"?" min='0'":"")+">";const isCheck=f.type==="checkbox";return "<div class='form-field "+(f.full?"full":"")+(isCheck?" full":"")+"'>"+(isCheck?"":("<label>"+esc(f.label)+(required?" *":"")+"</label>"))+control+"</div>"}
async function openEditor(item=null){if(current==="reels"){openReelsEditor(item);return}if(current==="history"&& !item)return;editing=item?item.id:null;const create=!item;let list=fields[current]||(configs[current]?.generic?fields.section:null);if(!list)return;const source=item||{};$("modalTitle").textContent=(create?"إضافة ":"تعديل ")+(names[current]||"محتوى");$("formFields").innerHTML="<div class='form-grid'>"+list.map(f=>fieldHtml(f,source,create)).join("")+"</div>";if(current==="matches"){const timePicker=$("formFields").querySelector(".match-time-picker");if(timePicker){const hidden=timePicker.parentElement.querySelector("input[name=match_time]");const syncTime=()=>{const h=Number(timePicker.querySelector("[data-time-hour]").value),m=timePicker.querySelector("[data-time-minute]").value,p=timePicker.querySelector("[data-time-period]").value;if(!h){hidden.value="";return}let hour=h%12;if(p==="PM")hour+=12;hidden.value=String(hour).padStart(2,"0")+":"+m};timePicker.addEventListener("change",syncTime);syncTime();}
const holder=document.createElement("div");holder.className="form-field full";holder.innerHTML="<label>تحديد التشكيلة ومراكز اللاعبين (11 لاعباً كحد أقصى)</label><div id='lineupPlayerRows' style='display:grid;gap:10px'></div><small>اختر اللاعبين ثم حدد لكل لاعب مركزه الدقيق يميناً أو يساراً أو في الوسط. الصور وأرقام القمصان تظهر تلقائياً.</small>";$("formFields").querySelector(".form-grid").appendChild(holder);
try{
 const data=await api("/api/players"),players=(data.players||[]).filter(p=>p.position!=="المدرب"),rows=holder.querySelector("#lineupPlayerRows");
 let selected=[];try{selected=Array.isArray(source.lineup)?source.lineup:JSON.parse(source.lineup_json||"[]");}catch{}
 const slots=[["gk","حارس مرمى"],["rb","ظهير أيمن"],["rcb","قلب دفاع أيمن"],["cb","قلب دفاع"],["lcb","قلب دفاع أيسر"],["lb","ظهير أيسر"],["rdm","ارتكاز أيمن"],["dm","محور ارتكاز"],["ldm","ارتكاز أيسر"],["rm","وسط أيمن"],["cm","وسط"],["lm","وسط أيسر"],["am","صانع ألعاب"],["rw","جناح أيمن"],["ss","مهاجم ثانٍ"],["st","مهاجم صريح"],["lw","جناح أيسر"]];
 const render=entries=>{rows.innerHTML=entries.map(x=>{const p=players.find(y=>Number(y.id)===x.id);return "<div data-player-row style='display:grid;grid-template-columns:minmax(0,1.2fr) minmax(135px,1fr) auto;gap:8px;align-items:center;padding:9px;border:1px solid #e2e5eb;border-radius:11px;background:#fff'><div style='display:flex;align-items:center;gap:8px;min-width:0'>"+(p?.image_url?"<img src='"+esc(p.image_url)+"' style='width:40px;height:40px;border-radius:50%;object-fit:cover'>":"<span style='width:40px;height:40px;border-radius:50%;background:#eee;display:grid;place-items:center'>⚽</span>")+"<span style='min-width:0'><b style='display:block;overflow:hidden;text-overflow:ellipsis;white-space:nowrap'>"+esc(p?.name||"لاعب")+"</b><small>رقم "+esc(p?.number||"—")+"</small></span></div><select data-player-slot style='width:100%;padding:9px;border:1px solid #d5d9e0;border-radius:8px'>"+slots.map(o=>"<option value='"+o[0]+"' "+(x.slot===o[0]?"selected":"")+">"+o[1]+"</option>").join("")+"</select><button type='button' data-remove-player style='border:0;border-radius:8px;padding:8px;background:#fff0f0;color:#c51e2b'>حذف</button><input type='hidden' data-player-id value='"+x.id+"'></div>";}).join("");};
 const add=document.createElement("div");add.style.cssText="display:flex;gap:8px;margin:10px 0";add.innerHTML="<select id='lineupAddPlayer' style='flex:1;min-width:0;padding:10px;border:1px solid #ddd;border-radius:9px'><option value=''>اختر لاعباً لإضافته...</option>"+players.map(p=>"<option value='"+esc(p.id)+"'>"+esc(p.number||"—")+" — "+esc(p.name)+"</option>").join("")+"</select><button type='button' id='lineupAddButton' style='padding:10px 14px;border:0;border-radius:9px;background:#c51e2b;color:white;font-weight:800'>إضافة</button>";holder.insertBefore(add,holder.querySelector("small"));
 let entries=selected.map(x=>typeof x==="object"?{id:Number(x.id),slot:x.slot||"cm"}:{id:Number(x),slot:"cm"}).filter(x=>players.some(p=>Number(p.id)===x.id));render(entries);
 add.querySelector("#lineupAddButton").onclick=()=>{const id=Number(add.querySelector("select").value);if(!id)return;if(entries.length>=11){toast("التشكيلة لا تتجاوز 11 لاعباً");return}if(entries.some(x=>x.id===id)){toast("هذا اللاعب مضاف بالفعل");return}const p=players.find(x=>Number(x.id)===id);entries.push({id,slot:p?.position==="حراس المرمى"?"gk":"cm"});render(entries);add.querySelector("select").value="";};
 rows.addEventListener("click",e=>{if(e.target.matches("[data-remove-player]")){const id=Number(e.target.closest("[data-player-row]").querySelector("[data-player-id]").value);entries=entries.filter(x=>x.id!==id);render(entries);}});
 rows.addEventListener("change",e=>{if(e.target.matches("[data-player-slot]")){const row=e.target.closest("[data-player-row]"),id=Number(row.querySelector("[data-player-id]").value);const found=entries.find(x=>x.id===id);if(found)found.slot=e.target.value;}});
 holder._getLineup=()=>entries;
 const participantsHolder=document.createElement("div");participantsHolder.className="form-field full";participantsHolder.innerHTML="<label>اللاعبون الذين شاركوا فعلياً في المباراة (بما فيهم البدلاء)</label><div id='playedPlayersList' style='display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px'></div><small>حدد كل لاعب دخل أرض الملعب. هؤلاء فقط سيظهرون للجمهور في تصويت رجل المباراة بعد انتهاء اللقاء.</small>";
 const playedList=participantsHolder.querySelector("#playedPlayersList");let played=[];try{played=Array.isArray(source.played_players)?source.played_players.map(Number):JSON.parse(source.played_players_json||"[]").map(Number)}catch{}
 playedList.innerHTML=players.filter(p=>p.position!=="المدرب").map(p=>"<label style='display:flex;align-items:center;gap:8px;padding:8px;border:1px solid #e2e5eb;border-radius:9px;background:#fff'><input type='checkbox' data-played-player value='"+Number(p.id)+"' "+(played.includes(Number(p.id))?"checked":"")+"><span>"+esc(p.number||"—")+" — "+esc(p.name)+"</span></label>").join("");
 $("#formFields").querySelector(".form-grid").appendChild(participantsHolder);
 participantsHolder._getPlayedPlayers=()=>[...playedList.querySelectorAll("[data-played-player]:checked")].map(x=>Number(x.value));
 if(source.id&&source.status==="finished"){try{const poll=await api("/api/man-of-match?match_id="+Number(source.id)+"&admin=1");const report=document.createElement("div");report.style.cssText="margin-top:12px;padding:12px;border:1px solid #f0d4d6;border-radius:10px;background:#fffafa";report.innerHTML="<b style='color:#bd1724'>متابعة تصويت رجل المباراة</b><p style='margin:6px 0;color:#666'>الحالة: "+(poll.status==="closed"?"مغلق":poll.status==="open"?"مفتوح":"غير متاح")+" — إجمالي الأصوات: "+Number(poll.totalVotes||0)+"</p>"+(poll.players||[]).map(p=>"<div style='display:flex;justify-content:space-between;gap:8px;padding:4px 0;font-size:12px'><span>"+esc(p.name)+"</span><b>"+Number(p.votes||0)+" صوت</b></div>").join("");participantsHolder.appendChild(report)}catch(error){}}
 }catch(error){
 holder.querySelector("small").textContent="تعذر تحميل التشكيلة: "+error.message;
 const fallback=document.createElement("div");
 fallback.className="form-field full";
 fallback.style.cssText="margin-top:12px;padding:12px;border:1px solid #f0d4d6;border-radius:10px;background:#fffafa";
 fallback.innerHTML="<label>اللاعبون الذين شاركوا فعلياً في المباراة (بما فيهم البدلاء)</label><div id='playedPlayersList' style='display:grid;grid-template-columns:repeat(auto-fit,minmax(180px,1fr));gap:8px'></div><small id='playedPlayersError' style='color:#b4232b'>تعذر تحميل قائمة اللاعبين: "+esc(error.message)+"</small><button type='button' id='retryPlayedPlayers' style='margin-top:9px;padding:8px 12px;border:0;border-radius:8px;background:#c51e2b;color:#fff'>إعادة تحميل قائمة اللاعبين</button>";
 const fallbackList=fallback.querySelector("#playedPlayersList");
 let fallbackPlayed=[];try{fallbackPlayed=Array.isArray(source.played_players)?source.played_players.map(Number):JSON.parse(source.played_players_json||"[]").map(Number)}catch{}
 fallback._getPlayedPlayers=()=>[...fallbackList.querySelectorAll("[data-played-player]:checked")].map(x=>Number(x.value));
 fallback.querySelector("#retryPlayedPlayers").onclick=async()=>{
  const errorBox=fallback.querySelector("#playedPlayersError"),retry=fallback.querySelector("#retryPlayedPlayers");
  retry.disabled=true;retry.textContent="جارٍ التحميل...";
  try{
   const data=await api("/api/players"),available=(data.players||[]).filter(p=>p.position!=="المدرب");
   if(!available.length)throw new Error("لا توجد لاعبين مسجلون في قسم اللاعبين.");
   fallbackList.innerHTML=available.map(p=>"<label style='display:flex;align-items:center;gap:8px;padding:8px;border:1px solid #e2e5eb;border-radius:9px;background:#fff'><input type='checkbox' data-played-player value='"+Number(p.id)+"' "+(fallbackPlayed.includes(Number(p.id))?"checked":"")+"><span>"+esc(p.number||"—")+" — "+esc(p.name)+"</span></label>").join("");
   errorBox.textContent="حدد كل لاعب دخل أرض الملعب، بما فيهم البدلاء.";errorBox.style.color="#667085";
  }catch(retryError){errorBox.textContent="تعذر تحميل اللاعبين: "+retryError.message}
  finally{retry.disabled=false;retry.textContent="إعادة تحميل قائمة اللاعبين"}
 };
 $("formFields").querySelector(".form-grid").appendChild(fallback);
}
}
if(current==="admins"&&create){$("formFields").querySelector('[name="username"]').required=true;$("formFields").querySelector('[name="password"]').required=true}if(current==="admins"&&!create){const u=$("formFields").querySelector('[name="username"]');if(u)u.closest(".form-field").remove();const p=$("formFields").querySelector('[name="password"]');if(p){p.required=false;p.placeholder="اتركها فارغة دون تغيير"}}$("modal").classList.add("open")}
function valueFromForm(form){const fd=new FormData(form),d={};for(const [k,v] of fd.entries()){if(k==="permission")continue;if(v instanceof File)continue;d[k]=v}for(const el of form.querySelectorAll('input[type="checkbox"][name]:not([name="permission"])'))d[el.name]=el.checked;for(const k of ["home_score","away_score","sort_order","played","wins","draws","losses","goals_for","goals_against","points","age","matches","clean_sheets","saves","goals","assists","tackles","readiness"])if(d[k]!==undefined&&d[k]!=="")d[k]=Number(d[k]);if(current==="admins")d.permissions=[...form.querySelectorAll('[name="permission"]:checked')].map(x=>x.value);return d}
async function saveCurrent(event){event.preventDefault();if(current==="reels"){try{await saveReelGroup(event)}catch(e){toast(e.message);setNotice(e.message,"error")}return}const form=event.currentTarget;const cfg=configs[current];if(!cfg)return;const d=valueFromForm(form);if(current==="appUpdates")d.type="app_update";if(current==="exclusiveAlerts")d.type="exclusive";const file=name=>form.querySelector('[name="'+name+'"]')?.files?.[0];try{if(current==="matches"){const holder=form.querySelector("#lineupPlayerRows")?.closest(".form-field");d.lineup=holder?holder._getLineup():[];if(d.lineup.length>11)throw new Error("يمكن اختيار 11 لاعباً فقط في التشكيلة.");const participants=form.querySelector("#playedPlayersList")?.closest(".form-field");d.played_players=participants?participants._getPlayedPlayers():[];if(d.status==="finished"&&!d.played_players.length)throw new Error("حدد اللاعبين الذين شاركوا فعلياً قبل اعتماد انتهاء المباراة.");}
if(configs[current]?.generic){const imageFile=file("image_file");if(imageFile){const uploaded=await upload(imageFile,current);d.image_url=uploaded.url;d.image_key=uploaded.key}const mediaFile=file("media_file");if(mediaFile){const uploaded=await upload(mediaFile,current);d.media_url=uploaded.url;d.media_key=uploaded.key}if(editing!==null){const oldItem=items.find(x=>x.id===editing);d.image_key=d.image_key||oldItem?.image_key||"";d.media_key=d.media_key||oldItem?.media_key||""}}
if(current==="standings"){const f=file("logo_file");if(f)d.logo_url=(await upload(f,"standings")).url;else if(editing!==null){const oldItem=items.find(x=>x.id===editing);d.logo_url=d.logo_url||oldItem?.logo_url||""}}
if(current==="exclusiveAlerts"){const cover=file("cover_file");if(cover)d.cover_image=(await upload(cover,"exclusive-alerts")).url;else if(editing!==null){const old=items.find(x=>String(x.id)===String(editing));d.cover_image=d.cover_image||old?.cover_image||""}const galleryFiles=[...(form.querySelector('[name="gallery_files"]')?.files||[])];if(galleryFiles.length){d.images=[];for(const imageFile of galleryFiles){const uploaded=await upload(imageFile,"exclusive-alerts");d.images.push(uploaded.url)}}else if(editing!==null){const old=items.find(x=>String(x.id)===String(editing));d.images=old?.images||[]}if(!d.body.trim())throw new Error("اكتب النص المختصر الذي سيظهر في الجرس");}
if(current==="news"){const primaryFile=file("image_file");if(primaryFile){const u=await upload(primaryFile,"news");d.image_url=u.url}if(!String(d.image_url||"").trim())throw new Error("أضف الصورة الأساسية للخبر أولاً");const galleryFiles=[...(form.querySelector('[name="gallery_files"]')?.files||[])];if(galleryFiles.length){const gallery=[];for(const galleryFile of galleryFiles){const uploaded=await upload(galleryFile,"news");gallery.push({url:uploaded.url})}d.images=gallery}}
if(current==="players"){const f=file("image_file");if(f)d.image_url=(await upload(f,"team")).url}
if(current==="legends"){
 const oldLegend=editing!==null?items.find(x=>String(x.id)===String(editing)):null;
 const portrait=file("image_file");
 if(portrait){const u=await upload(portrait,"legends");d.image_url=u.url;d.image_key=u.key}
 else if(oldLegend){d.image_url=d.image_url||oldLegend.image_url||"";d.image_key=oldLegend.image_key||""}
 const photoFiles=[...(form.querySelector('[name="photo_files"]')?.files||[])];
 const videoFiles=[...(form.querySelector('[name="video_files"]')?.files||[])];
 d.photos=[];d.videos=[];
 for(const f of photoFiles){const u=await upload(f,"legends");d.photos.push({media_url:u.url,media_key:u.key,title:f.name||"صورة من مسيرة الأسطورة"})}
 for(const f of videoFiles){const u=await upload(f,"legends");d.videos.push({media_url:u.url,media_key:u.key,title:f.name||"فيديو من مسيرة الأسطورة"})}
 if(editing!==null){d.image_key=d.image_key||oldLegend?.image_key||""}
}
if(current==="transfers"){const f=file("image_file");if(f)d.image_url=(await upload(f,"transfers")).url}
if(current==="matches"){for(const [n,scope] of [["opponent_logo_file","matches"],["home_logo_file","matches"]]){const f=file(n);if(f)d[n==="opponent_logo_file"?"opponent_logo_url":"home_logo_url"]=(await upload(f,scope)).url}}
if(current==="media"||current==="archive"){const f=file("media_file");if(f){const u=await upload(f,current==="archive"?"archive":"media");d.media_url=u.url;d.media_key=u.key;d.media_type=u.media_type}if(!String(d.media_url||"").trim())throw new Error("ارفع ملفاً أو أدخل رابط الملف أولاً");if(editing!==null){const oldItem=items.find(x=>x.id===editing);d.media_key=d.media_key||oldItem?.media_key||""}}
if(current==="reels"){const f=file("media_file");if(f){const u=await upload(f,"reels");d.media_url=u.url;d.media_key=u.key;d.media_type=u.media_type==="image"?"image":"video"}const t=file("thumbnail_file");if(t){const u=await upload(t,"reels");d.thumbnail_url=u.url;d.thumbnail_key=u.key}}
if(current==="anthem"){const f=file("audio_file");if(f){const u=await upload(f,"anthems");d.audio_url=u.url;d.file_key=u.key}}
if(current==="carousel"){const f=file("image_file");if(f){const u=await upload(f,"carousel");d.image_url=u.url;d.image_key=u.key}if(editing!==null){const oldItem=items.find(x=>x.id===editing);d.image_key=d.image_key||oldItem?.image_key||""}}
if(current==="media"&&editing!==null){const oldItem=items.find(x=>x.id===editing);d.media_key=d.media_key||oldItem?.media_key||""}
if(current==="reels"&&editing!==null){const oldItem=items.find(x=>x.id===editing);d.media_key=d.media_key||oldItem?.media_key||"";d.thumbnail_key=d.thumbnail_key||oldItem?.thumbnail_key||"";d.media_url=d.media_url||oldItem?.media_url||"";d.thumbnail_url=d.thumbnail_url||oldItem?.thumbnail_url||"";d.media_type=d.media_type||oldItem?.media_type||"video"}
if(current==="anthem"&&editing!==null){const oldItem=items.find(x=>x.id===editing);d.file_key=d.file_key||oldItem?.file_key||"";d.audio_url=d.audio_url||oldItem?.audio_url||""}
if(current==="history"){await api(cfg.endpoint,{method:"PUT",body:d})}
else if(current==="admins"&&!editing&&d.password.length<8)throw new Error("كلمة المرور يجب ألا تقل عن 8 أحرف");
else{const method=editing!==null?"PUT":"POST";let endpoint=cfg.endpoint;if(current==="standings"){const chosenTournamentId=String($("tournamentSelect")?.value||selectedTournamentId||"").trim();if(!chosenTournamentId||!Number.isInteger(Number(chosenTournamentId))||Number(chosenTournamentId)<1)throw new Error("اختر البطولة من القائمة قبل حفظ الفريق");selectedTournamentId=chosenTournamentId;d.tournament_id=Number(chosenTournamentId);endpoint="/api/standings?tournament_id="+encodeURIComponent(chosenTournamentId)}const url=endpoint+(editing!==null?(endpoint.includes("?")?"&":"?")+"id="+encodeURIComponent(editing):"");await api(url,{method,body:d})}
closeEditor();toast("تم حفظ البيانات بنجاح");await loadSection(current);loadStats()
}catch(e){toast(e.message);setNotice(e.message,"error")}}
function closeEditor(){$("modal").classList.remove("open");$("editorForm").reset()}
async function deleteItem(id){if(!confirm("هل تريد حذف هذا العنصر نهائياً؟"))return;const cfg=configs[current];try{const url=cfg.endpoint+(cfg.endpoint.includes("?")?"&":"?")+"id="+encodeURIComponent(id);const result=await api(url,{method:"DELETE"});if(current==="news"&&result?.mediaCleanup){const cleanup=result.mediaCleanup;const held=cleanup.results?.find(item=>item.status==="kept");toast(cleanup.error?"حُذف الخبر، لكن تعذر حذف الصورة من التخزين: "+cleanup.error:held?"حُذف الخبر؛ الصورة محفوظة لأنها مستخدمة في "+held.reference.table+"."+held.reference.column:"تم حذف الخبر والصور من التخزين: "+cleanup.deleted+" ملف");}else{toast("تم الحذف بنجاح")}await loadSection(current);loadStats()}catch(e){toast(e.message)}}
async function loadStats(){const targets=[["statNews","/api/news","news"],["statMatches","/api/matches","matches"],["statPlayers","/api/players","players"],["statMedia","/api/gallery","media"]];await Promise.all(targets.map(async([id,path,key])=>{try{const d=await api(path);const el=$(id);if(el)el.textContent=(d[key]||[]).length}catch{const el=$(id);if(el)el.textContent="—"}}))}
function formatStorageGB(bytes){const gb=bytes/1000000000;return gb.toLocaleString("en-US",{maximumFractionDigits:2})+" GB"}
async function loadStorageUsage(){
 const usedEl=$("storageUsed"),objectsEl=$("storageObjects"),remainingEl=$("storageRemaining"),percentEl=$("storagePercent"),meterEl=$("storageMeter"),statusEl=$("storageStatus"),updatedEl=$("storageUpdated");
 if(!usedEl)return;
 $("refreshStorage").disabled=true;
 statusEl.textContent="يتم قراءة الملفات من R2... قد يستغرق ذلك وقتاً إذا كان عدد الملفات كبيراً.";
 usedEl.textContent="جارٍ الحساب";
 objectsEl.textContent="—";remainingEl.textContent="—";percentEl.textContent="جارٍ القياس";meterEl.style.width="0%";
 let cursor="",totalBytes=0,totalObjects=0,pages=0;
 try{
  do{
   const path="/api/storage-usage"+(cursor?"?cursor="+encodeURIComponent(cursor):"");
   const data=await api(path);
   totalBytes+=Number(data.bytes||0);
   totalObjects+=Number(data.objects||0);
   cursor=data.nextCursor||"";
   pages++;
   const currentGB=totalBytes/1000000000;
   usedEl.textContent=formatStorageGB(totalBytes);
   objectsEl.textContent=totalObjects.toLocaleString("en-US");
   percentEl.textContent=Math.min(100,currentGB/10*100).toFixed(1)+"% من الحد المجاني";
   meterEl.style.width=Math.min(100,currentGB/10*100)+"%";
   remainingEl.textContent="المتبقي تقريباً "+formatStorageGB(Math.max(0,10*1000000000-totalBytes));
   statusEl.textContent=cursor?"تم حساب دفعة "+pages+"؛ جارٍ استكمال بقية الملفات...":"اكتمل فحص جميع الملفات المخزنة.";
  }while(cursor);
  const currentGB=totalBytes/1000000000;
  meterEl.classList.toggle("over-limit",currentGB>10);
  statusEl.textContent=currentGB>10?"الاستخدام الحالي يتجاوز مقدار التخزين المجاني؛ راجع متوسط التخزين والفاتورة في Cloudflare.":"تم حساب جميع الملفات بنجاح. هذا قياس لحظي وليس متوسط الفوترة الشهري.";
  updatedEl.textContent=new Intl.DateTimeFormat("ar-YE",{dateStyle:"short",timeStyle:"short"}).format(new Date());
 }catch(error){
  statusEl.textContent="تعذر جلب بيانات التخزين: "+error.message;
  usedEl.textContent="غير متاح";
 }finally{$("refreshStorage").disabled=false}
}
async function authenticate(){const t=token();if(!t)return false;try{const d=await api("/api/auth");admin=d.admin||{};return true}catch{sessionStorage.removeItem(TOKEN_KEY);admin=null;return false}}
function applyPermissions(){const p=admin?.permissions||[];const owner=admin?.owner===true||admin?.username==="owner"||Number(admin?.id)===0||p.includes("*");document.querySelectorAll(".nav[data-view]").forEach(b=>{const key=b.dataset.view;if(key==="overview")return;const perm=permissionMap[key]||key;b.hidden=!owner&&!p.includes(perm)});$("userLabel").textContent=admin?.display_name||"مدير النظام";$("profileInitial").textContent=(admin?.display_name||"م").trim().charAt(0)||"م";$("loginAction").textContent="تسجيل الخروج";const first=document.querySelector('.nav[data-view]:not([hidden])');if(!document.querySelector('.nav[data-view="'+current+'"]:not([hidden])'))showView(first?.dataset.view||"overview")}
async function start(){if(await authenticate()){applyPermissions();$("loginOverlay").classList.remove("open");loadStats()}else{$("loginOverlay").classList.add("open");$("loginAction").textContent="تسجيل الدخول"}}
document.querySelectorAll("[data-view]").forEach(b=>b.addEventListener("click",()=>showView(b.dataset.view)));
$("menu").addEventListener("click",()=>$("sidebar").classList.toggle("open"));
$("refreshStorage").addEventListener("click",loadStorageUsage);
$("add").addEventListener("click",()=>openEditor());
$("close").addEventListener("click",closeEditor);$("cancelEditor").addEventListener("click",closeEditor);
$("modal").addEventListener("click",e=>{if(e.target===$("modal"))closeEditor()});
$("editorForm").addEventListener("submit",saveCurrent);
$("recordsWrap").addEventListener("click",e=>{const edit=e.target.closest("[data-edit]"),del=e.target.closest("[data-delete]");if(edit){const item=items.find(x=>String(x.id)===edit.dataset.edit);if(item)openEditor(item)}if(del)deleteItem(del.dataset.delete)});
$("formFields").addEventListener("click",e=>{if(e.target.id==="addReelStory"){$("reelStoryRows").insertAdjacentHTML("beforeend",reelStoryRow());return}const row=e.target.closest(".reel-story-row");if(!row)return;if(e.target.closest("[data-story-remove]"))row.remove();else if(e.target.closest("[data-story-up]")&&row.previousElementSibling)row.parentNode.insertBefore(row,row.previousElementSibling);else if(e.target.closest("[data-story-down]")&&row.nextElementSibling)row.parentNode.insertBefore(row.nextElementSibling,row)});
$("search").addEventListener("input",renderTable);
 $("tournamentSelect").addEventListener("change",()=>{selectedTournamentId=$("tournamentSelect").value;loadSection("standings")});
 $("createTournament").addEventListener("click",async()=>{const name=prompt("اكتب اسم البطولة الجديدة:");if(!name||!name.trim())return;const season_year=prompt("اكتب سنة البطولة (مثال: 2026 أو 2026/2027):","2026")||"";try{const d=await api("/api/tournaments",{method:"POST",body:{name:name.trim(),season_year:season_year.trim()}});selectedTournamentId=String(d.id);toast("تم إنشاء البطولة بنجاح");await loadSection("standings")}catch(e){toast(e.message)}});
 $("renameTournament").addEventListener("click",async()=>{const sel=$("tournamentSelect");if(!selectedTournamentId)return;const selected= (await api("/api/tournaments")).tournaments?.find(t=>String(t.id)===String(selectedTournamentId));const name=prompt("تعديل اسم البطولة:",selected?.name||"");if(!name||!name.trim())return;const season_year=prompt("تعديل سنة البطولة:",selected?.season_year||"")||"";try{await api("/api/tournaments?id="+encodeURIComponent(selectedTournamentId),{method:"PUT",body:{name:name.trim(),season_year:season_year.trim()}});toast("تم تعديل اسم البطولة");await loadSection("standings")}catch(e){toast(e.message)}});
$("filter").addEventListener("click",()=>{showHidden=!showHidden;$("filter").textContent=showHidden?"عرض الظاهر":"عرض الكل";renderTable()});
$("loginAction").addEventListener("click",async()=>{if(token()){if(!confirm("تسجيل الخروج من لوحة الإدارة؟"))return;try{await api("/api/auth",{method:"DELETE"})}catch{}sessionStorage.removeItem(TOKEN_KEY);admin=null;$("loginOverlay").classList.add("open");$("loginAction").textContent="تسجيل الدخول";$("userLabel").textContent="غير مسجل";return}$("loginOverlay").classList.add("open")});
$("loginForm").addEventListener("submit",async e=>{e.preventDefault();$("loginError").textContent="";const username=$("loginUsername").value.trim(),password=$("loginPassword").value;if(!password)return;try{const body=username?{username,password}:{password};const r=await fetch(API+"/api/auth",{method:"POST",headers:{"Content-Type":"application/json"},body:JSON.stringify(body)});const d=await r.json();if(!r.ok||!d.success)throw new Error(d.message||"تعذر تسجيل الدخول");sessionStorage.setItem(TOKEN_KEY,d.token);$("loginPassword").value="";await start();toast("تم تسجيل الدخول بنجاح")}catch(err){$("loginError").textContent=err.message}});
start();
})();