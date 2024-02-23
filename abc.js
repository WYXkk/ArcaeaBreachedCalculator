let displayLines=5;

let boostInfo=[
	{
		description:"进度 = 超量 + 步数/2",
		formula:x=>(x.overdrive+x.prog/2)/50,
		show:true
	},
	{
		description:"进度 x= 搭档残片值",
		formula:x=>(x.overdrive/50)*(x.frag/50),
		show:true
	},
	{
		description:"进度 x= max(1.0, 2.0 - 0.1 x 等级)",
		formula:x=>(x.overdrive/50)*Math.max(1,2-0.1*x.level),
		show:true
	},
	{
		description:"进度 = 超量 - ||超量-搭档残片值|-|超量-步数||",
		formula:x=>(x.overdrive-Math.abs(Math.abs(x.overdrive-x.frag)-Math.abs(x.overdrive-x.prog)))/50,
		show:true
	},
];

let a=JSON.parse(document.body.innerText);
let b=a.value.character_stats;

{ // 处理搭档技能
	let ilith=b.find(x=>x.character_id==10);
	if(ilith&&ilith.is_uncapped) b.push({
		display_name:{"zh-Hans":"伊莉丝"},
		extraInfo:"发动觉醒技能",
		level:ilith.level,
		frag:ilith.frag,
		prog:ilith.prog+6,
		overdrive:ilith.overdrive
	});

	let vita=b.find(x=>x.character_id==54);
	if(vita) {vita.extraInfo="最大over";vita.overdrive+=10;}

	let mika=b.find(x=>x.character_id==65);
	if(mika) b.push({
		display_name:{"zh-Hans":"百合咲美香"},
		extraInfo:"发动技能",
		level:mika.level,
		frag:mika.frag*2,
		prog:mika.prog*2,
		overdrive:mika.overdrive*2
	});

	let ilithIvy=b.find(x=>x.character_id==69);
	if(ilithIvy){
		ilithIvy.extraInfo="平均情况";
		ilithIvy.frag+=50/3;
		ilithIvy.prog+=50/3;
		ilithIvy.overdrive+=50/3;
	}

	let hikariVanessa=b.find(x=>x.character_id==70);
	if(hikariVanessa){
		hikariVanessa.extraInfo="不扣减";
	}
}

let c=b.map(x=>{return{
	name:`${x.display_name["zh-Hans"]}${x.variant?`（${x.variant["zh-Hans"]}）`:""}${x.extraInfo?`（${x.extraInfo}）`:""}`,
	boosts:boostInfo.map(t=>t.formula(x))
};});

let actualLines=Math.min(c.length,displayLines);

for(let t in boostInfo) if(boostInfo[t].show){
	c.sort((x,y)=>y.boosts[t]-x.boosts[t]);
	let logStr=`对于「${boostInfo[t].description}」：`;
	for(let i=0;i<actualLines;i++){
		logStr+=`\n${i+1}. ${c[i].name} x${c[i].boosts[t]}`;
	}
	console.log(logStr);
}