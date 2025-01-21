let resultLines=10;
let enableNoChallengeDivisor=true;
let enableFatalisStaminaDivisor=false;

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
	function fromID(x) {return b.find(y=>y.character_id==x);}
	let ilith=fromID(10); // 依莉丝
	if(ilith&&ilith.is_uncapped) {
		let tmp=structuredClone(ilith);
		tmp.extraInfo="成功发动觉醒技能";
		tmp.prog+=6;
		b.push(tmp);
	}

	let vita=fromID(54); // 维塔
	if(vita) {
		let tmp=structuredClone(vita);
		tmp.extraInfo="最大加成";
		tmp.overdrive+=10;
		b.push(tmp);

		vita.extraInfo="不计加成";
	}

	let hikariFatalis=fromID(55); // 光（Fatalis）
	if(hikariFatalis) {
		hikariFatalis.extraInfo=`双倍体力 x0.5${enableFatalisStaminaDivisor?"":"[未计入]"}`;
		if(enableFatalisStaminaDivisor) hikariFatalis.extraMult=0.5;
	}

	let amane=fromID(58); // 天音
	if(amane) {
		let tmp=structuredClone(amane);
		tmp.extraInfo="成绩低于EX";
		tmp.extraMult=0.5;
		b.push(tmp);

		amane.extraInfo="成绩达到EX";
	}

	let mika=fromID(65); // 百合咲美香
	if(mika) {
		let tmp=structuredClone(mika);
		tmp.extraInfo="发动技能";
		tmp.frag*=2;
		tmp.prog*=2;
		tmp.overdrive*=2;
		b.push(tmp);
	} // 唯 一 真 神

	let ilithIvy=fromID(69); // Ilith & Ivy
	if(ilithIvy) {
		let tmp=structuredClone(ilithIvy);
		tmp.extraInfo="最大加成，平均情况";
		tmp.frag+=50/3;
		tmp.prog+=50/3;
		tmp.overdrive+=50/3;
		b.push(tmp);

		ilithIvy.extraInfo="不计加成";
	}

	let hikariVanessa=fromID(70); // Hikari & Vanessa
	if(hikariVanessa) {
		let tmp=structuredClone(hikariVanessa);
		tmp.extraInfo="2次扣减，平均情况";
		tmp.frag-=20/3;
		tmp.prog-=20/3;
		tmp.overdrive-=20/3;
		b.push(tmp);

		hikariVanessa.extraInfo="不计扣减";
	}

	let maya=fromID(71); // 摩耶
	if(maya) {
		let tmp=structuredClone(maya);
		tmp.extraInfo="发动第二技能";
		tmp.extraMult=2;
		b.push(tmp);
	}

	let insight=fromID(72); // 洞烛
	if(insight) {
		let tmp=structuredClone(insight);
		tmp.extraInfo="入侵时";
		tmp.extraMult=2;
		b.push(tmp);
	}

	let etoHoppe=fromID(77); // 爱托 & 荷珀
	if(etoHoppe) {
		let tmp=structuredClone(etoHoppe);
		tmp.extraInfo="发动技能";
		tmp.extraMult=2;
		b.push(tmp);
	}

	let chinatsu=fromID(79); // 千夏
	if(chinatsu) {
		let tmp=structuredClone(chinatsu);
		tmp.extraInfo="5次加成，平均情况";
		tmp.frag+=25/3;
		tmp.prog+=25/3;
		tmp.overdrive+=25/3;
		b.push(tmp);

		chinatsu.extraInfo="不计加成";
	}

	let nai=fromID(81); // 奈伊
	if(nai) {
		nai.extraInfo="不计扣减";
	}

	let seleneSheryl=fromID(82); // 赛润妮·雪儿（MIR-203）
	if(seleneSheryl) {
		let tmp=structuredClone(seleneSheryl);
		tmp.extraInfo="最大加成";
		tmp.prog+=30;
		b.push(tmp);

		seleneSheryl.extraInfo="不计加成";
	}

	let noChallenge=[
		28, // 潘多拉涅墨西斯（MTA-XXX）
		34, // DORO*C
		35, // 对立（Tempest）
		55, // 光（Fatalis）
		67, // 不来方永爱
		68, // 奈美（暮光）
	]
	for(let i=0;i<noChallenge.length;i++) {
		let tmp=fromID(noChallenge[i]);
		if(tmp) {
			tmp.noChallenge=true;
			if(enableNoChallengeDivisor) tmp.extraMult=(tmp.extraMult??1)*0.67;
		}
	}

	// 上次更新到的搭档 id：82
}

let c=b.map(x=>{return{
	name:
		x.display_name["zh-Hans"]+
		(x.variant?`（${x.variant["zh-Hans"]}）`:"")+
		(x.extraInfo?`【${x.extraInfo}】`:"")+
		(x.noChallenge?`【无挑战 x0.67${enableNoChallengeDivisor?"":"[未计入]"}】`:""),
	boosts:boostInfo.map(t=>t.formula(x)*(x.extraMult??1))
};});

let actualLines=Math.min(c.length,resultLines);

for(let t in boostInfo) if(boostInfo[t].show){
	c.sort((x,y)=>y.boosts[t]-x.boosts[t]);
	let logStr=`对于「${boostInfo[t].description}」：`;
	for(let i=0;i<actualLines;i++){
		logStr+=`\n${i+1}. ${c[i].name} x${c[i].boosts[t].toFixed(6)}`;
	}
	console.log(logStr);
}