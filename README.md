# Chess Back-end
Do not use this project in real life. It is created with educational purposes only.

## Links
 - FE: https://github.com/kksf/chess-fe
 - BE: https://github.com/kksf/chess-be

## How to run
Create mongo database;
Create .env file with the following content:
```
MONGODB_URI=mongodb+srv://chessusr:PASSWORD_HERE@mongoHost.org/?retryWrites=true&w=majority
MONGODB_DBNAME=chess
CORS_ALLOWED=https://chess-fe.yourdomain.com
```

In the proect root execute:
`npm run devStart`

## TODO
- [x] Max users on server
- [x] Delete obsolete games
- [x] Add game history
- [x] Detect user goes offline and auto-cancel the game

## Demo