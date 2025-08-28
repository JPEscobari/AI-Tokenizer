# Tokenizer Edge Case Test Plan

| **Test Case** | **Input** | **Expected Output** | **Actual Output** | **Pass/Fail** | **Notes** |
|---------------|-----------|----------------------|-------------------|---------------|-----------|
| **Chinese compound word segmentation** | `中华人民共和国` | Tokenize into meaningful units: `[中华, 人民, 共和国]` | TBD |  | Ensure tokenizer doesn’t go character-by-character. |
| **Chinese + English acronym** | `今天我去KFC吃饭 🍗` | Words: `[今天, 我, 去, KFC, 吃饭, 🍗]` | TBD |  | Should treat English acronym & emoji as separate tokens. |
| **Chinese numbers** | `我有三百二十一个苹果` | Numbers grouped as one token: `[我, 有, 三百二十一, 个, 苹果]` | TBD |  | Clarify if numbers should stay whole or split by character. |
| **Spanish contraction** | `del` | Keep as `[del]`, not `[de, el]` | TBD |  | Rule needed for contractions. |
| **Spanish verb + clitic** | `dámelo` | Split as `[da, me, lo]` or keep as `[dámelo]` | TBD |  | Need prompt clarity on whether to split clitics. |
| **Accented Spanish word** | `camión` | `[camión]` with preserved accent | TBD |  | Must not lose diacritics. |
| **Spanglish** | `Voy a hacer jogging después de la cena` | `[Voy, a, hacer, jogging, después, de, la, cena]` | TBD |  | Ensure foreign word kept intact. |
| **Chinese + Spanish mixed** | `我喜欢 paella y churros` | `[我, 喜欢, paella, y, churros]` with detected_language `"Chinese"` (if majority) | TBD |  | Clarify majority-language vs. first-language tie-break rule. |
| **Emoji only** | `😂👍🔥` | Each emoji a separate token: `[😂, 👍, 🔥]` with empty definition | TBD |  | Ensure no crash or undefined values. |
| **Heavy punctuation** | `¿Qué???!!!` | `[¿, Qué, ?, ?, ?, !, !, !]` | TBD |  | Confirm punctuation splits correctly. |
| **Mixed symbols/numbers** | `123 $$$ ###` | `[123, $, $, $, #, #, #]` | TBD |  | Clarify numbers vs digits: one token or split digits? |
| **Nonsense string** | `asdfgh qwerty zxcvbn` | Return `"detected_language": "Unable to determine"` | TBD |  | Should not attempt definitions. |
| **Chinese idiom (成语)** | `画蛇添足` | `[画蛇添足]` (keep idiom intact, not per-character) | TBD |  | Clarify handling of fixed expressions. |
| **Spanish with abbreviation** | `Sr. Gómez` | `[Sr., Gómez]` | TBD |  | Ensure abbreviation stays intact. |
| **Spanish with numbers** | `Tengo 25 años` | `[Tengo, 25, años]` | TBD |  | Number should be a separate token. |
| **Spanish with emoji** | `Estoy feliz 😊` | `[Estoy, feliz, 😊]` | TBD |  | Emoji separated cleanly. |
| **Mixed language short phrase** | `Hola 世界` | `[Hola, 世界]` | TBD |  | Detected language should be based on majority rule. |
