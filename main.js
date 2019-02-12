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
		P: "proc PASSIVE",
		A: "auto ATTACK",
		//AA: "auto attack",
		//AM: "attack move",
		F: "FLASH",
		S: "summoner SPELL",
		//SS: "summoner spell",
		M: "MOVE",
		K: "get a KILL",
		"~": " (while) target is CC'd, ",
		C: "CANCEL action",
		X: "EXIT the game",
		"\"": "TYPE in chat",
		G: "SURRENDER",
		D: "DIE",
		"%": "proc RUNES",
		".": "STOP command",
		"?": "PING",
		L: "go AFK"
	},
	syntax: {//potentially multi character
		" ": " then\n",//end
		"/": " (spam), spam ",
		"*": ", weave in order with ",
		"&": " and simultaneously ",
		"|": " or ",
		"[": " (start casting)",
		"]": "before the end of ",
		"(": "optionally",
		")": "end of option",
		"+": " (activate/turn on)",
		"-": " (deactivate/turn off)",
		"$": " as self cast",
		"@": "at time ",
		"!": "do NOT ",
		"^": "recommended: ",
		"T": "teammate "
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
			if (text[i] === "K" && text[i + 1] === "K") {
				let kill_count = 0;
				while (text[i] === "K") {
					++i;
					++kill_count;
				}
				--i;
				if (kill_count <= 5) {
					answer += "get a " + ["DOUBLE", "TRIPLE", "QUADRA", "PENTA"][kill_count - 2] + " KILL";
				}
				else answer += "get " + kill_count + " KILLs";
			}
			else {
				answer += dictionary.special_abilities[text[i]];
				if (text[i] === "?" && text[i + 1] === "?") {
					while (text[i] === "?") {
						++i;
						answer += " MIA";
					}
					--i;
				}
				if (text[i] === "\"") {
					answer += multiplyString("\t", 0) + " \"" + decodeComment(text.substring(i, text.indexOf("\"", i + 1) + 1), "\"") + "\"";
					i = text.indexOf("\"", i + 1);
				}
			}
		}
		else if (dictionary.syntax[text[i]]) {
			//start of syntax
			if (text[i] === "[" || text[i] === "(") {
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
			if (text[i] === "]" || text[i] === ")") --tab_level;
			if (text[i] === " ") answer += dictionary.syntax[text[i]] + multiplyString("\t", tab_level);
			else if (text[i] === "]" || text[i] === ")") answer += "\n" + multiplyString("\t", tab_level) + dictionary.syntax[text[i]] + holds.pop() + ".";
			else if (text[i] === "/" && (dictionary.syntax[text[i + 1]] || i + 1 === text.length)) answer += " spam";
			else answer += dictionary.syntax[text[i]];
		}
		else if (text[i] === "<") {//beginning of duration
			let hold = true;//set to true if not a delay
			if (i - 1 < 0 || text[i - 1] == " ") hold = false;//is a delay
			answer += (hold ? "" : multiplyString("\t", tab_level)) + " " + decodeDuration(text.substring(i, text.indexOf(">", i + 1) + 1), hold);
			i = text.indexOf(">", i + 1);
		}
		/*
		else if (text[i] === "(") {//beginning of a time duration
			answer += multiplyString("\t", tab_level) + " (and) " + decodeTimeMarker(text.substring(i, text.indexOf(")", i + 1) + 1));
			i = text.indexOf(")", i + 1);
		}*/
		else if (text[i] === "_") {//beginning of a note/comment
			answer += multiplyString("\t", 0) + " NOTE: " + decodeComment(text.substring(i, text.indexOf("_", i + 1) + 1), "_");
			i = text.indexOf("_", i + 1);
			if (text[i + 1] === " ") {
				++i;//skip thens after comments if a comment is followed by a space
				answer += "\n" + multiplyString("\t", tab_level);
			}
			else answer += " ";
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
	if (text == "<exp>") return "and hold until it expires.";
	else if (text == "<max>") return "and keep for maximum duration.";
	else if (text == "<min>") return "and keep for minimum duration.";
	else if (text == "<cxl>") return "and hold while preparing to cancel.";
	else if (text == "<>") return "and keep for any duration.";
	else {
		if (text[0] !== "<" || text[text.length - 1] !== ">") throw new Error("decodeDuration() invalid entry missing opening or closing angle brackets:\n" + text);
		else {//opens and closes with angle brackets
			const duration = parseFloat(text.substring(1, text.length - 1));
			if (isNaN(duration)) throw new Error("decodeDuration() invalid duration:\n" + text);
			else {
				return (hold ? "and keep" : "wait") + " for " + duration + " seconds.";
			}
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
if (document) {
	document.getElementById('b1').onclick = updateWebsite;
	document.getElementById('i1').onkeyup = updateWebsite;
	document.getElementById('i1').onchange = updateWebsite;
	document.getElementById('i1').value = getParameterByName("input");
	updateWebsite();
}
function updateWebsite() {
	document.getElementById('o1').value = decodeToEnglish(document.getElementById('i1').value);
	const url = "https://supportbot.tk/f/ilacs_t.html?input=" + encodeURIComponent(document.getElementById('i1').value);
	document.getElementById('d1').innerHTML = "URL to current translation: <a href=\"" + url + "\">" + url + "</a>";
}
function getParameterByName(name, url) {
	if (!url) url = window.location.href;
	name = name.replace(/[\[\]]/g, "\\$&");
	var regex = new RegExp("[?&]" + name + "(=([^&#]*)|&|#|$)"),
		results = regex.exec(url);
	if (!results) return null;
	if (!results[2]) return '';
	return decodeURIComponent(results[2].replace(/\+/g, " "));
}
//console.log(decodeToEnglish("Q1 Q2 E[Q3[F A E[Q1[R]]]]"));
/*
console.log("airblade yasuo\n" + decodeToEnglish("Q1 Q2 Q3[E[Q1[R]]] Q2"));
console.log("\n\n\n");
console.log("shen flash taunt\n" + decodeToEnglish("E[F]"));
console.log("\n\n\n");
console.log("keyblade yasuo\n" + decodeToEnglish("Q1 Q2 E[Q3[F A E[Q1[R]]]]"));
console.log("\n\n\n");
console.log("keyblade yasuo v2\n" + decodeToEnglish("Q1 Q2 E[Q3[F]] A E[Q1[R]]"));
console.log("\n\n\n");
console.log("vi Q\n" + decodeToEnglish("Q<cxl>[C] Q<1>[V] Q<1.5>[V] Q<max>[V] Q<min>[V] Q<exp>"));
*/

console.log("\n\n\n");
console.log("alistar combo\n" + decodeToEnglish("W[Q] E"));
console.log("\n\n\n");
console.log("lee sin combo\n" + decodeToEnglish("V W1 Q1 Q2 F R W2"));
console.log("\n\n\n");
console.log("amumu simple engage\n" + decodeToEnglish("W+ Q E/A W-"));
console.log("\n\n\n");
console.log(decodeToEnglish("Q1 Q2 W[Q3]"));
console.log("\n\n\n");
console.log("riven fast combo\n" + decodeToEnglish("A1[Q1 _activate Q1 after A1 damage_] A2[Q2] A3[Q3]"));
console.log("\n\n\n");
console.log("the ragequit\n" + decodeToEnglish("??? T\"/all open mid\" @15mins G ^(L|X)"));
