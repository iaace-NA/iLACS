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
		I: "use item",
		W: "use ward",
		B: "activate recall",
		P: "use passive",
		A: "auto attack",
		//AA: "auto attack",
		//AM: "attack move",
		F: "flash",
		S: "summoner spell",
		//SS: "summoner spell",
		M: "move"
	},
	syntax: {//potentially multi character
		" ": "then",
		"*": "continuously weave in any order",
		"/": "continuously weave in order",
		"&": "and also",
		"[": "start casting",
		"]": "before end of cast",
		"+": "activate/turn on",
		"-": "deactivate/turn off"
	}
};
function decodeToEnglish(text) {//text is iLACS
	let answer = "";
	for (let i = 0; i < text.length; ++i) {
		if (dictionary.normal_abilities[text[i]]) {
			//start of an ability
			answer += dictionary.normal_abilities[text[i]];
		}
		else if (dictionary.special_abilities[text[i]]) {
			//start of a special ability
			answer += dictionary.special_abilities[text[i]];
		}
		else if (dictionary.syntax[text[i]]) {
			//start of syntax
			answer += dictionary.syntax[text[i]];
		}
		else if (text[i] === "<") {//beginning of duration
			let hold = true;//set to true if not a delay
			if (i - 1 < 0 || text[i - 1] == " ") hold = false;//is a delay
			answer += decodeDuration(text.substring(i, text.indexOf(">", i) + 1));
			i = text.indexOf(">", i);
		}
		else if (text[i] === "(") {//beginning of a time duration
			answer += decodeTimeMarker(text.substring(i, text.indexOf(")", i) + 1));
			i = text.indexOf(")", i);
		}
		else answer += text[i];
	}
	return answer;
}
function decodeDuration(text, hold) {
	if (text == "<exp>") return "hold and expire";
	else if (text == "<max>") return "hold for maximum duration";
	else if (text == "<min>") return "hold for minimum duration";
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
console.log(decodeToEnglish("Q1 Q2 E[Q3[F A E[Q1[R]]]]"));