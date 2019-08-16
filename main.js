/*
v1.0.0
*/
function strictParseInt(str) {
	let ans = ""
	for (let i = 0; i < str.length; ++i) {
		const temp = parseInt(str[i]);
		if (!isNaN(temp)) ans += temp;
		else return NaN;
	}
	return parseInt(ans);
}
const normal_dictionary = {
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
		S: "use SUMMONER SPELL",
		//SS: "summoner spell",
		M: "MOVE",
		K: "get a KILL",
		C: "CANCEL action",
		X: "EXIT the game",
		"\"": "TYPE in chat",
		G: "SURRENDER",
		D: "DIE",
		"%": "proc RUNES",
		".": "use STOP command",
		"?": "PING",
		L: "go AFK",
		Y: "move CAMERA to"
	},
	syntax: {//potentially multi character
		" ": " then\n",//end
		"/": " (spam), spam ",
		"*": ", weave in order with ",
		"&": " and simultaneously ",
		"|": " or ",
		"[": " (start casting)",
		"]": "before the cast ends on ",
		"(": "optionally",
		")": "end of option",
		"{": ", finish casting, and during the spell's effects,",
		"}": "before the effects end on ",
		"+": " (activate/turn on)",
		"-": " (deactivate/turn off)",
		"$": " as self cast",
		"#": " normal cast",
		"=": " as smart/quick cast",
		"@": " at ",
		"!": "(do) NOT ",
		"^": "recommended: ",
		"T": " Teammate ",
		"U": " until ",
		"O": " Opponent ",
		",": ", miss,",
		":": ", for all casts, ",
		";": ", for any cast, ",
		"'": " in range of ",
		"~": " (while) target is CC'd, ",
	}
};
const html_dictionary = {
	normal_abilities: {
		Q: "press <span class=\"ability\">Q</span>",
		W: "press <span class=\"ability\">W</span>",
		E: "press <span class=\"ability\">E</span>",
		R: "press <span class=\"ultimate\">R</span>"
	},
	special_abilities: {
		I: "use <span class=\"special\">ITEM</span>",
		V: "place <span class=\"special\">WARD</span>",
		B: "activate <span class=\"special\">RECALL</span>",
		P: "proc <span class=\"special\">PASSIVE</span>",
		A: "auto <span class=\"special\">ATTACK</span>",
		//AA: "auto attack",
		//AM: "attack move",
		F: "<span class=\"special\">FLASH</span>",
		S: "use <span class=\"special\">SUMMONER SPELL</span>",
		//SS: "summoner spell",
		M: "<span class=\"special\">MOVE</span>",
		K: "get a <span class=\"special\">KILL</span>",
		C: "<span class=\"special\">CANCEL action</span>",
		X: "<span class=\"special\">EXIT the game</span>",
		"\"": "<span class=\"special\">TYPE in chat</span>",
		G: "<span class=\"special\">SURRENDER</span>",
		D: "<span class=\"special\">DIE</span>",
		"%": "proc <span class=\"special\">RUNES</span>",
		".": "use <span class=\"special\">STOP command</span>",
		"?": "<span class=\"special\">PING</span>",
		L: "go <span class=\"special\">AFK</span>",
		Y: "<span class=\"special\">move CAMERA</span> to "
	},
	syntax: {//potentially multi character
		" ": " then\n",//end
		"/": " <span class=\"modifier\">(spam), spam</span> ",
		"*": ", <span class=\"modifier\">weave in order</span> with ",
		"&": " <span class=\"modifier\">and simultaneously</span> ",
		"|": " <span class=\"modifier\">or</span> ",
		"[": " <span class=\"modifier\">(start casting)</span>",
		"]": "before the <span class=\"modifier\">cast ends</span> on ",
		"(": "<span class=\"modifier\">optionally</span>",
		")": "end of option",
		"{": ", <span class=\"modifier\">finish casting</span>, and <span class=\"modifier\">during the spell's effects</span>,",
		"}": "before the <span class=\"modifier\">effects end</span> on ",
		"+": " <span class=\"modifier\">(activate/turn on)</span>",
		"-": " <span class=\"modifier\">(deactivate/turn off)</span>",
		"$": " as <span class=\"modifier\">self cast</span>",
		"#": " <span class=\"modifier\">normal cast</span>",
		"=": " as <span class=\"modifier\">smart/quick cast</span>",
		"@": " <span class=\"modifier\">at</span> ",
		"!": "(do) <span class=\"modifier\">NOT</span> ",
		"^": "<span class=\"modifier\">recommended:</span> ",
		"T": " <span class=\"teammate\">Teammate</span> ",
		"U": " <span class=\"modifier\">until</span> ",
		"O": " <span class=\"opponent\">Opponent</span> ",
		",": ", <span class=\"modifier\">miss</span>,",
		":": ", <span class=\"modifier\">for <b>all</b> casts</span>, ",
		";": ", <span class=\"modifier\">for <b>any</b> cast</span>, ",
		"'": " <span class=\"modifier\">in range</span> of ",
		"~": " (while) target is <span class=\"modifier\">CC'd</span>, ",
	}
};
function colorCodeInput(text) {
	let answer = "";
	const dictionary = normal_dictionary;
	for (let i = 0; i < text.length; ++i) {
		if (dictionary.normal_abilities[text[i]]) {
			//start of an ability
			answer += "<span class=\"ability\">" + text[i] + "</span>";
		}
		else if (dictionary.special_abilities[text[i]]) {
			//start of a special ability
				if (text[i] === "\"") {
					answer += "<span class=\"comment\">";
					appendToAnswerHTML("\"");
					answer += decodeComment(text.substring(i, text.indexOf("\"", i + 1) + 1), "\"", false);
					appendToAnswerHTML("\"");
					answer += "</span>";
					i = text.indexOf("\"", i + 1);
				}
				else {
					answer += "<span class=\"special\">" + text[i] + "</span>";
				}
		}
		else if (dictionary.syntax[text[i]]) {
			//start of syntax
			if (text[i] !== "T" && text[i] !== "O") answer += "<span class=\"modifier\">";
			else if (text[i] === "T") answer += "<span class=\"teammate\">";
			else answer += "<span class=\"opponent\">";
			appendToAnswerHTML(text[i]);
			answer += "</span>";
		}
		else if (text[i] === "<") {//beginning of duration
			answer += "<span class=\"duration\">";
			appendToAnswerHTML(text.substring(i, text.indexOf(">", i + 1) + 1));
			answer += "</span>";
			i = text.indexOf(">", i + 1);
		}
		else if (text[i] === "_") {//beginning of a note/comment
			answer += "<span class=\"comment\">";
			appendToAnswerHTML(text.substring(i, text.indexOf("_", i + 1) + 1));
			answer += "</span>";
			i = text.indexOf("_", i + 1);
		}
		else {
			answer += "<span class=\"suffix\">";
			appendToAnswerHTML(text[i]);
			answer += "</span>";
		}
	}
	return answer;
	function appendToAnswerHTML(new_string) {//escapes HTML specials
		answer += new_string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\t/g, "&#9;");
	}
}
function decodeToEnglish(text, html = false) {//text is iLACS
	let answer = "";
	let tab_level = 0;
	let holds = [];//abilities being held (array stack format)
	const dictionary = html ? html_dictionary : normal_dictionary;
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
					answer += "get a ";
					if (html) answer += "<span class=\"special\">";
					answer += ["DOUBLE", "TRIPLE", "QUADRA", "PENTA"][kill_count - 2] + " KILL";
					if (html) answer += "</span>";
				}
				else {
					answer += "get ";
					if (html) answer += "<span class=\"special\">";
					answer += kill_count + " KILLs";
					if (html) answer += " </span>";
				}
			}
			else {
				answer += dictionary.special_abilities[text[i]];
				if (text[i] === "?" && text[i + 1] === "?") {
					if (html) answer += "<span class=\"special\">";
					while (text[i] === "?") {
						++i;
						answer += " MIA";
					}
					--i;
					if (html) answer += "</span>";
				}
				if (text[i] === "\"") {
					appendToAnswerHTML(multiplyString("\t", 0));
					if (html) answer += " <span class=\"comment\">";
					appendToAnswerHTML("\"" + decodeComment(text.substring(i, text.indexOf("\"", i + 1) + 1), "\"", false) + "\"");
					if (html) answer += "</span>";
					i = text.indexOf("\"", i + 1);
				}
			}
		}
		else if (dictionary.syntax[text[i]]) {
			//start of syntax
			if (text[i] === "[" || text[i] === "(" || text[i] === "{") {
				++tab_level;
				let last_space_index = i;
				for (; last_space_index > 0; --last_space_index) {
					if (text.substring(last_space_index, last_space_index + 1) === " ") {
						++last_space_index;
						break;
					}
				}
				holds.push(text.substring(last_space_index, i));
			}
			if (text[i] === "]" || text[i] === ")" || text[i] === "}") --tab_level;
			if (text[i] === " ") {
				answer += dictionary.syntax[text[i]];
				appendToAnswerHTML(multiplyString("\t", tab_level));
			}
			else if (text[i] === "]" || text[i] === ")" || text[i] === "}") {
				appendToAnswerHTML("\n" + multiplyString("\t", tab_level));
				answer += dictionary.syntax[text[i]];
				appendToAnswerHTML(holds.pop() + ".");
			}
			else if (text[i] === "/" && (dictionary.syntax[text[i + 1]] || i + 1 === text.length)) {
				if (html) answer += " <span class=\"modifier\">spam</span>";
			}
			else answer += dictionary.syntax[text[i]];
			if (text[i] === "[" || text[i] === "(" || text[i] === "{") {
				answer += dictionary.syntax[" "];
				appendToAnswerHTML(multiplyString("\t", tab_level));
			}
		}
		else if (text[i] === "<") {//beginning of duration
			let hold = true;//set to true if not a delay
			if (i - 1 < 0 || text[i - 1] == " ") hold = false;//is a delay
			appendToAnswerHTML((hold ? "" : multiplyString("\t", tab_level)) + " ");
			answer += decodeDuration(text.substring(i, text.indexOf(">", i + 1) + 1), hold, html);
			i = text.indexOf(">", i + 1);
		}
		else if (text[i] === "_") {//beginning of a note/comment
			appendToAnswerHTML(multiplyString("\t", 0));
			if (html) answer += " <span class=\"comment\">NOTE:</span> ";
			else answer += " NOTE: ";
			answer += decodeComment(text.substring(i, text.indexOf("_", i + 1) + 1), "_", html);
			i = text.indexOf("_", i + 1);
			if (text[i + 1] === " ") {
				++i;//skip thens after comments if a comment is followed by a space
				appendToAnswerHTML("\n" + multiplyString("\t", tab_level));
			}
			else answer += " ";
		}
		else {
			if (html) answer += "<span class=\"suffix\">";
			appendToAnswerHTML(text[i]);
			if (html) answer += "</span>";
		}
		if (tab_level < 0) throw new Error("misplaced square brackets");
	}
	if (tab_level !== 0) throw new Error("misplaced square brackets");
	return answer;
	function appendToAnswerHTML(new_string) {//escapes HTML specials
		if (html) answer += new_string.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;").replace(/\t/g, "&#9;");
		else answer += new_string;
	}
}
function decodeDuration(text, hold, html) {
	let answer = "";
	let prefix = "and ";
	if (text == "<exp>") answer = "hold until it expires.";
	else if (text == "<max>") answer = "keep for maximum duration.";
	else if (text == "<min>") answer = "keep for minimum duration.";
	else if (text == "<cxl>") answer = "hold while preparing to cancel.";
	else if (text == "<>") answer = "keep for any duration.";
	else {
		if (text[0] !== "<" || text[text.length - 1] !== ">") throw new Error("decodeDuration() invalid entry missing opening or closing angle brackets:\n" + text);
		else {//opens and closes with angle brackets
			const duration = parseFloat(text.substring(1, text.length - 1));
			if (isNaN(duration)) throw new Error("decodeDuration() invalid duration:\n" + text);
			else {
				if (!hold) prefix = "";
				answer = (hold ? "keep" : "wait") + " for " + duration + " seconds.";
			}
		}
	}
	if (html) {
		return prefix + "<span class=\"duration\">" + answer + "</span>";
	}
	else return prefix + answer;
}
function decodeTimeMarker(text) {//not currently used
	if (text[0] !== "(" || text[text.length - 1] !== ")") throw new Error("decodeTimeMarker() invalid entry missing opening or closing parenthesis:\n" + text);
	else {//opens and closes with parenthesis
		const duration = parseFloat(text.substring(1, text.length - 1));
		if (isNaN(duration)) throw new Error("decodeTimeMarker() invalid duration:\n" + text);
		else return "at " + duration + " seconds";
	}
}
function decodeComment(text, surrounder, html) {
	if (text[0] !== surrounder || text[text.length - 1] !== surrounder) throw new Error("decodeComment() invalid entry missing opening or closing syntax:\n" + text);
	else {//opens and closes with underscore
		if (html) return "<span class=\"comment\">" + text.substring(1, text.length - 1) + "</span>";
		else return text.substring(1, text.length - 1);
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
	document.getElementById('o1').innerHTML = decodeToEnglish(document.getElementById('i1').value, true);
	document.getElementById('o2').innerHTML = colorCodeInput(document.getElementById('i1').value);
	const non_html_occ = decodeToEnglish(document.getElementById('i1').value, false).length;
	const url = window.location.origin + window.location.pathname + "?input=" + encodeURIComponent(document.getElementById('i1').value);
	document.getElementById('d1').innerHTML = "URL to current translation: <a href=\"" + url + "\">" + url + "</a>";
	window.history.pushState({}, "", url);
	document.getElementById('s1').innerHTML = document.getElementById('i1').value.length + " characters";
	document.getElementById('s2').innerHTML = non_html_occ + " characters";
	document.getElementById('d2').innerHTML = ((document.getElementById('i1').value.length / non_html_occ) * 100) + "% of original size&nbsp;&nbsp;&nbsp;&nbsp;" + (non_html_occ / document.getElementById('i1').value.length) + "x more efficient";
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
*/
console.log(decodeToEnglish("E[F]{M Q&W S} A/ K"));
