# Specification for iaace's League Ability Combo Syntax (iLACS)

## Normal Abilities
- Q; Q1, Q2,.. used for distinct abilities, not casts. eg. yasuo Q1 Q2, Vi Q<1>
- W; W1, W2,..
- E; E1, E2,..
- R; R1, R2,..
- Q/: repeat Q for an indeterminate amount of times
- Qs: for all Q activations
- Qx: for a indeterminate Q activation
- Q+: activate Q passive
- Q-: deactivate Q passive

## Special Abilities
- I, I1, I2, I3: item active
- V: vision ward
- B: recall
- P: passive
- %: rune
- A: attack
- ~~AA: auto attack (deprecated)~~
- ~~AM: attack move (deprecated)~~
- F: flash
- S: summoner spell
- ~~SS: summoner spell (deprecated)~~
- S1/S2: summoner spell 1, summoner spell 2
- ~~S1.1 S1.2: ss activation 1, ss activation 2 (deprecated)~~
- M: move character
- X: exit game
- T"abc": type abc in chat
- D: die
- K: get a kill
- G: forfeit (/ff, /surrender)
- C: cancel action


## Syntax
- `[`: cast start
- `]`: cast end
- `?<1.5>`: seconds duration to hold
- `?<1.5>[]`: seconds duration to hold with actions in between
- `<exp>`: expire duration
- `<max>`: hold for maximum duration
- `<min>`: hold for minimum duration
- `<cxl>`: hold, then cancel
- `<>`: hold for indeterminate duration
- `<1.5>`: seconds duration to delay (relative time)
- `(1.5)`: seconds marker (absolute time)
- `/`: weave in any order
- `*`: weave in specific order
- `&: press at same time Q1&Q2
- `_comment here_`: comments surrounded by underscores
- X: alt f4

- ~~K: knockup state (deprecated)~~
- ~~CC: unspecified CC (deprecated)~~
- ~: unspecified CC

## Examples:

- karma root combo: `W[R] Q`
- shen E-flash: `E[F]`
- shen E-flash long combo: `E[F] M Q&W S A/ K`
- shen flash-E: `F E`
- ahri: `E Q W`
- alistar: `W[Q] E`
- wukong: `E Q A W`
- amumu: `W+ Q E/A W-`
- riven fast combo: `A1[Q1 _activate Q1 after A1 damage_] A2[Q2] A3[Q3]`
- vi Q: `Q<> Q<1> Q<1.5> Q<max> Q<min> Q<exp>`
- lee sin: `V W Q1 Q2 F R`
- brand: `E Q ~W`
- rakan: `E1 E2 R[F W] Q`
- katarina: `Q W[M] E E`
- xayah: `W P A1 A2 A3 Q[P A[E P]] A/`
- thresh: `hexF<max> Q1<max> Q2 R E`
- thresh escape: `W1 W2[F*M]`
- darius: `E W A Q[M/]`
- zed: `W1[E&Q W2 %] A Iduskblade&P`

- WQ animation cancel yasuo: `Q1 Q2 W[Q3]`
- beyblade yasuo: `Q1 Q2 E[Q3[F]]`
- airblade yasuo: `Q1 Q2 Q3[E[Q1[R]]] Q2`
- keyblade yasuo: `Q1 Q2 E[Q3[F A E[Q1[R]]]]`
- keyblade yasuo v2: `Q1 Q2 E<cxl>[Q3<cxl>[F]] A E<cxl>[Q1<cxl>[R]] Q2 Q3`
