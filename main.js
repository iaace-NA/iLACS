function strictParseInt(str) {
	let ans = ""
	for (let i = 0; i < str.length; ++i) {
		const temp = parseInt(str[i]);
		if (!isNaN(temp)) ans += temp;
		else return NaN;
	}
	return parseInt(ans);
}
const dictionary = {
	normal_abilities: {
		Q: "press Q",
		W: "press W",
		E: "press E",
		R: "press R"
	},
	special_abilities: {
		I: "use ITEM",
		V: "place WARD",
		B: "activate RECALL",
		P: "use PASSIVE",
		A: "auto ATTACK",
		//AA: "auto attack",
		//AM: "attack move",
		F: "FLASH",
		S: "summoner SPELL",
		//SS: "summoner spell",
		M: "MOVE",
		K: "target KNOCKUP",
		"~": "target is CC'd",
		C: "CANCEL action",
		X: "EXIT game",
		T: "TYPE in chat",
		G: "SURRENDER"
	},
	syntax: {//potentially multi character
		" ": " then\n",//end
		"*": " continuously weave in any order with ",
		"/": " continuously weave in order with ",
		"&": " and also ",
		"[": " (start casting)",
		"]": "before the end of ",
		"+": " (activate/turn on)",
		"-": " (deactivate/turn off)"
	}
};
function decodeToEnglish(text) {//text is iLACS
	let answer = "";
	let tab_level = 0;
	let holds = [];//abilities being held (array stack format)
	for (let i = 0; i < text.length; ++i) {
		if (dictionary.normal_abilities[text[i]]) {
			//start of an ability
			answer += dictionary.normal_abilities[text[i]];
		}
		else if (dictionary.special_abilities[text[i]]) {
			//start of a special ability
			answer += dictionary.special_abilities[text[i]];
			if (text[i] === "T") {
				++i;
				answer += multiplyString("\t", 0) + " \"" + decodeComment(text.substring(i, text.indexOf("\"", i + 1) + 1), "\"") + "\"";
				i = text.indexOf("\"", i + 1);
			}
		}
		else if (dictionary.syntax[text[i]]) {
			//start of syntax
			if (text[i] === "[") {
				++tab_level;
				let last_space_index = i;
				for (; last_space_index > 0; --last_space_index) {
					if (text[last_space_index] === " ") {
						++last_space_index;
						break;
					}
				}
				holds.push(text.substring(last_space_index, i));
				text = text.substring(0, i + 1) + " " + text.substring(i + 1);
			}
			if (text[i] === "]") --tab_level;
			if (text[i] === " ") answer += dictionary.syntax[text[i]] + multiplyString("\t", tab_level);
			else if (text[i] === "]") answer += "\n" + multiplyString("\t", tab_level) + dictionary.syntax[text[i]] + holds.pop() + ".";
			else answer += dictionary.syntax[text[i]];
		}
		else if (text[i] === "<") {//beginning of duration
			let hold = true;//set to true if not a delay
			if (i - 1 < 0 || text[i - 1] == " ") hold = false;//is a delay
			answer += multiplyString("\t", tab_level) + " and " + decodeDuration(text.substring(i, text.indexOf(">", i + 1) + 1));
			i = text.indexOf(">", i + 1);
		}
		else if (text[i] === "(") {//beginning of a time duration
			answer += multiplyString("\t", tab_level) + " and " + decodeTimeMarker(text.substring(i, text.indexOf(")", i + 1) + 1));
			i = text.indexOf(")", i + 1);
		}
		else if (text[i] === "_") {//beginning of a note/comment
			answer += multiplyString("\t", 0) + " NOTE: " + decodeComment(text.substring(i, text.indexOf("_", i + 1) + 1), "_");
			i = text.indexOf("_", i + 1);
		}
		else {
			answer += text[i];
		}
		if (tab_level < 0) throw new Error("misplaced square brackets");
	}
	if (tab_level !== 0) throw new Error("misplaced square brackets");
	return answer;
}
function decodeDuration(text, hold) {
	if (text == "<exp>") return "hold until it expires";
	else if (text == "<max>") return "hold for maximum duration";
	else if (text == "<min>") return "hold for minimum duration";
	else if (text == "<cxl>") return "hold, then cancel";
	else if (text == "<>") return "hold for any duration";
	else {
		if (text[0] !== "<" || text[text.length - 1] !== ">") throw new Error("decodeDuration() invalid entry missing opening or closing angle brackets:\n" + text);
		else {//opens and closes with angle brackets
			const duration = parseFloat(text.substring(1, text.length - 1));
			if (isNaN(duration)) throw new Error("decodeDuration() invalid duration:\n" + text);
			else return "hold for " + duration + " seconds";
		}
	}
}
function decodeTimeMarker(text) {
	if (text[0] !== "(" || text[text.length - 1] !== ")") throw new Error("decodeTimeMarker() invalid entry missing opening or closing parenthesis:\n" + text);
	else {//opens and closes with parenthesis
		const duration = parseFloat(text.substring(1, text.length - 1));
		if (isNaN(duration)) throw new Error("decodeTimeMarker() invalid duration:\n" + text);
		else return "at " + duration + " seconds";
	}
}
function decodeComment(text, surrounder) {
	if (text[0] !== surrounder || text[text.length - 1] !== surrounder) throw new Error("decodeComment() invalid entry missing opening or closing syntax:\n" + text);
	else {//opens and closes with underscore
		return text.substring(1, text.length - 1);
	}
}
function multiplyString(text, num) {
	let answer = "";
	for (let i = 0; i < num; ++i) answer += text;
	return answer;
}
//console.log(decodeToEnglish("Q1 Q2 E[Q3[F A E[Q1[R]]]]"));
console.log("airblade yasuo\n" + decodeToEnglish("Q1 Q2 Q3[E[Q1[R]]] Q2"));
console.log("\n\n\n");
console.log("shen flash taunt\n" + decodeToEnglish("E[F]"));
console.log("\n\n\n");
console.log("keyblade yasuo\n" + decodeToEnglish("Q1 Q2 E[Q3[F A E[Q1[R]]]]"));
console.log("\n\n\n");
console.log("keyblade yasuo v2\n" + decodeToEnglish("Q1 Q2 E[Q3[F]] A E[Q1[R]]"));
console.log("\n\n\n");
console.log("vi Q\n" + decodeToEnglish("Q<cxl>[C] Q<1>[V] Q<1.5>[V] Q<max>[V] Q<min>[V] Q<exp>"));


console.log("\n\n\n");
console.log("alistar combo\n" + decodeToEnglish("W[Q] E"));
console.log("\n\n\n");
console.log("lee sin combo\n" + decodeToEnglish("V W1 Q1 Q2 F R W2"));
console.log("\n\n\n");
console.log(decodeToEnglish("W+ Q E/A W-"));
console.log("\n\n\n");
console.log(decodeToEnglish("Q1 Q2 W[Q3]"));
console.log("\n\n\n");
console.log("riven fast combo\n" + decodeToEnglish("A1[Q1 _activate Q1 after A1 damage_] A2[Q2] A3[Q3]"));
console.log("\n\n\n");
console.log("the ragequit\n" + decodeToEnglish("T\"open mid\" G@15mins X"))
