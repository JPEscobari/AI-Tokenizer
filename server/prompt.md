1. tell the AI what its job is generally (Your job is to process a non-English language text into word for a language learner to study from. ...)

2. Tell the AI what input to expect. (You will receive a text that is written in 1 or more non-English languages)

3. Tell the AI what to do with the input
(First, identify all the languages used in the input text. Then go word by word and create an array of word objects in the following structure: 
```
[
  {
     word: "string",
     pronunciation: "string",
     meaning: "string",
     ...
]
```

4. Tell the AI what to do in cases of ambiguity (If you're unsure how to parse a word, make your best guess. ... etc)

5. Outline any rules the AI should follow (Return JSON object only, don't edit the original text in any way, how to handle special characters, numbers etc)