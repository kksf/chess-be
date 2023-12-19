var express = require('express');
const { MongoClient } = require('mongodb');
const {generateRandomString, rspn} = require("./helpers");
const {dbUri, dbName} = require("./constants");
const ChessDatabase = require("./db");
var router = express.Router();

router.post('/', async function(req, res, next) {
    let data = {
        gameId: generateRandomString(6, ['num', 'lwr']),
        gamePass: generateRandomString(4, ['num'])
    }

    const DB = new ChessDatabase()
    await DB.connect()
    const id = await DB.createGame(data)

    res.json(rspn({...id, ...data}, true))
});

router.get('/',  async function(req, res, next) {
    const DB = new ChessDatabase()
    await DB.connect()
    const game = await DB.findGame(req.query.id)

    res.json(rspn(game, true))
});

router.put('/', async function(req, res, next) {
    const data = {
        gameId: req.query.gameId,
        gamePass: req.query.gamePass,
        data: req.query.data,
    }

    const DB = new ChessDatabase()
    await DB.connect()
    await DB.updateGame(req.query.id, data)

    res.json(rspn(data, true))
});

module.exports = router;
