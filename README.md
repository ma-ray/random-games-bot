# **Random Games Bot**

A discord bot with some common games to kill time.

## Games
* **Hangman:** The classic guessing game! Make sure to guess the word before the stick figure is fully drawn. You can guess by letter or you can guess the entire word at once.There are two modes: `regular` and `random`.
	* `regular:` picks a word from list of words made by me.
	* `random:` picks a word from the [random-word-api](https://random-word-api.herokuapp.com/home) (difficulty varies)
* **Blackjack:** Face off against the dealer! Should you hit or stay? 🤔 Beat the dealer or go bust. 

## Running the bot for your own use
Create a `config.json` with the following contents (you can change the prefix if you want):
```json
{
	"prefix": ">",
	"token": "YOUR TOKEN HERE"
}
```
Now run the following command:
```
node ./index.js
```
