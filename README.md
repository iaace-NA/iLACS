![iLACS logo](logo_rectangular.png)
# Specification for iaace's League Ability Combo Syntax (iLACS) v0.1.2
translator located at https://ilacs.iaace.gg/
## Normal Abilities
- `Q`; `Q1`, `Q2`,.. used for distinct abilities, not casts. eg. yasuo Q1 Q2, Vi Q<1>
- `W`; `W1`, `W2`,..
- `E`; `E1`, `E2`,..
- `R`; `R1`, `R2`,..
- `Q/`: repeat Q for an indeterminate amount of times
- `Q:`: for all Q activations
- `Q;`: for any Q activation
- `Q+`: activate Q passive
- `Q-`: deactivate Q passive

## Special Abilities
- `I`, `I1`, `I2`, `I3`: item active
- `V`: vision ward
- `B`: recall
- `P`: passive
- `%`: rune
- `A`: attack
- `F`: flash
- `S`: summoner spell
- `S1`/`S2`: summoner spell 1, summoner spell 2
- `M`: move character
- `X`: exit game
- `L`: go AFK
- `"abc"`: type abc in chat
- `D`: die
- `K`: get a kill
- `KK`: double kill
- `KKKKK`: penta kill
- `G`: forfeit (/ff, /surrender)
- `C`: cancel action
- `.`: stop command
- `?`: ping map
- `??`: MIA ping
- `????????`: MIA ping


## Syntax
- `[`: cast start
- `]`: cast end
  - NOTE: during spell cast start/end, you are normally not allowed to cast other abilities such as auto attacks. To denote actions during a spell's effects (and not during its initial cast), use `{}`
- `?<1.5>`: seconds duration to hold
- `?<1.5>[]`: seconds duration to hold with actions in between
- `<exp>`: expire duration
- `<max>`: hold for maximum duration
- `<min>`: hold for minimum duration
- `<cxl>`: hold, then cancel
- `<>`: hold for indeterminate duration
- `<1.5>`: seconds duration to delay (relative time)
- `@`: at
- `/`: weave in any order
- `*`: weave in specific order
- `&`: press at same time Q1&Q2
- `|`: or
- `U`: until
- `T`: teammate
- `T1`: teammate 1
- `O`: opponent
- `O1`: opponent 1
- `Q$`: self cast Q
- `!Q`: do not press Q
- `^Q`: it is recommended to press Q
- `()`: optional actions
- `Q,`: miss an ability (added after the ability)
- `_comment here_`: comments surrounded by underscores
- `X`: alt f4
- `Q#`: normal cast an ability
- `Q=`: smart cast/quick cast an ability

- `~`: unspecified CC

- Note: lowercase words and numbers will generally pass through untouched. but SPACE is a special syntax character (for "then") so it is recommended to make phrases using \_underscore comment notation\_. Exceptions include: `Ibork` for `ITEMbork` etc

## Common Phrases:
- `:=` all abilities quickcasted
- `Izhonyas`, `Iduskblade`, `Ilocket` items
- `Q@O1` use Q at opponent 1
- `^()` a recommended option

## Champion Specific Examples:
- the ragequit: `_if_T:,@O&TD@yourO ???@T "gg" "/all open mid" ^(D/@O|L|X) U@15mins G X`
- karma root combo: `W{~R{Q}}`
- shen E-flash: `E[F]`
- shen E-flash long combo: `E[F]{M Q&W S} A/ K`
- shen flash-E: `F E`
- ahri: `E{Q W}`
- alistar: `W[Q] E`
- wukong: `E Q A W<>{M/}`
- amumu: `W+<>{Q E/A} W-`
- riven fast combo: `A1[Q1 _activate Q1 after A1 damage_] A2[Q2] A3[Q3]`
- vi Q: `Q<> Q<1> Q<1.5> Q<max> Q<min> Q<exp>`
- lee sin: `V W@ward Q1{Q2} F R`
- brand: `E P1{Q} P2{~W} P3`
- rakan: `E1{E2} R[F@O ~W] Q`
- katarina: `Q W{M} E E`
- xayah: `W P A1 A2 A3 Q[P A[E P]] A/`
- thresh: `hexF<max> Q1<max>[Q2] R E`
- thresh escape: `W1 TW2[F M/]`
- darius: `E W % A Q[M/]`
- zed: `W1[E&Q&%]{W2} A Iduskblade&P`
- lissandra self ult engage: `E1{E2} W{Q R$}`
- lissandra ult engage: `E1{E2} W&Q R Izhonyas`
- lissandra fake E: `E1<exp>{M/ !E2}`
- nautilus `R Q W{A&P E S A/}`
- zoe `E ~Q1{R[Q2 A&P]}`
- master yi `R{M/ (F) Ibork Q E{A/|(W<>)} KKKKK} W<max>`
- old alistar recall combo (patched) `:= W[Q<cxl>[B]] E Q/A`

- WQ animation cancel yasuo: `Q1 Q2 W[Q3]`
- beyblade yasuo: `Q1 Q2 E[Q3[F]]`
- airblade yasuo: `Q1 Q2 Q3{E[Q1[R]]} Q2`
- keyblade yasuo: `Q1 Q2 E[Q3[F A E[Q1[R]]]] Q2 Q3`
- keyblade yasuo v2: `Q1 Q2 E<cxl>[Q3<cxl>[F]] A E<cxl>[Q1<cxl>[R]] Q2 Q3`

- Faker vs Ryu: `OA OIbork OA[OSignite] Iyoumuu R1<min>[E,]{OR1[OW1[R2 OE,]] Iqss OW2 Q OA<cxl>[F OA,] OQ, Signite} OF OA<cxl>[W1[W2{OA, E}]] OD`
