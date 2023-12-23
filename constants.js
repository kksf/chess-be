module.exports = {
    COLOR_WHITE: 'white',
    COLOR_BLACK: 'black',
    COLOR_ANY: 'any',

    TYPE_PAWN: 'pawn',
    TYPE_ROOK: 'rook',
    TYPE_KNIGHT: 'knight',
    TYPE_BISHOP: 'bishop',
    TYPE_KING: 'king',
    TYPE_QUEEN: 'queen',

    DEFAULT_POSITIONS: {
        '1': {
            '1': {type: 'rook', color: 'white'},
            '2': {type: 'knight', color: 'white'},
            '3': {type: 'bishop', color: 'white'},
            '4': {type: 'king', color: 'white'},
            '5': {type: 'queen', color: 'white'},
            '6': {type: 'bishop', color: 'white'},
            '7': {type: 'knight', color: 'white'},
            '8': {type: 'rook', color: 'white'}
        },
        '2': {
            '1': {type: 'pawn', color: 'white'},
            '2': {type: 'pawn', color: 'white'},
            '3': {type: 'pawn', color: 'white'},
            '4': {type: 'pawn', color: 'white'},
            '5': {type: 'pawn', color: 'white'},
            '6': {type: 'pawn', color: 'white'},
            '7': {type: 'pawn', color: 'white'},
            '8': {type: 'pawn', color: 'white'}
        },
        '7': {
            '1': {type: 'pawn', color: 'black'},
            '2': {type: 'pawn', color: 'black'},
            '3': {type: 'pawn', color: 'black'},
            '4': {type: 'pawn', color: 'black'},
            '5': {type: 'pawn', color: 'black'},
            '6': {type: 'pawn', color: 'black'},
            '7': {type: 'pawn', color: 'black'},
            '8': {type: 'pawn', color: 'black'}
        },
        '8': {
            '1': {type: 'rook', color: 'black'},
            '2': {type: 'knight', color: 'black'},
            '3': {type: 'bishop', color: 'black'},
            '4': {type: 'king', color: 'black'},
            '5': {type: 'queen', color: 'black'},
            '6': {type: 'bishop', color: 'black'},
            '7': {type: 'knight', color: 'black'},
            '8': {type: 'rook', color: 'black'}
        }
    },








    _DEFAULT_GAME: {
        "players": [],
        "myColor": null,
        "enemyColor": null,
        "playerId": null,
        "gameId": null,
        "canMove": false,
        "positions": {
            '1': {
                '1': {type: 'king', color: 'white'},
                '2': {type: 'pawn', color: 'white'},
            },
            '8': {
                '7': {type: 'pawn', color: 'black'},
                '8': {type: 'king', color: 'black'},
            }
        }
    },

    DEFAULT_GAME: {
        "dateCreated": null,
        "dateUpdated": null,
        "players": [],
        "myColor": null,
        "enemyColor": null,
        "playerId": null,
        "gameId": null,
        "canMove": false,
        "positions": {
            '1': {
                '1': {type: 'rook', color: 'white'},
                '2': {type: 'knight', color: 'white'},
                '3': {type: 'bishop', color: 'white'},
                '4': {type: 'king', color: 'white'},
                '5': {type: 'queen', color: 'white'},
                '6': {type: 'bishop', color: 'white'},
                '7': {type: 'knight', color: 'white'},
                '8': {type: 'rook', color: 'white'}
            },
            '2': {
                '1': {type: 'pawn', color: 'white'},
                '2': {type: 'pawn', color: 'white'},
                '3': {type: 'pawn', color: 'white'},
                '4': {type: 'pawn', color: 'white'},
                '5': {type: 'pawn', color: 'white'},
                '6': {type: 'pawn', color: 'white'},
                '7': {type: 'pawn', color: 'white'},
                '8': {type: 'pawn', color: 'white'}
            },
            '7': {
                '1': {type: 'pawn', color: 'black'},
                '2': {type: 'pawn', color: 'black'},
                '3': {type: 'pawn', color: 'black'},
                '4': {type: 'pawn', color: 'black'},
                '5': {type: 'pawn', color: 'black'},
                '6': {type: 'pawn', color: 'black'},
                '7': {type: 'pawn', color: 'black'},
                '8': {type: 'pawn', color: 'black'}
            },
            '8': {
                '1': {type: 'rook', color: 'black'},
                '2': {type: 'knight', color: 'black'},
                '3': {type: 'bishop', color: 'black'},
                '4': {type: 'king', color: 'black'},
                '5': {type: 'queen', color: 'black'},
                '6': {type: 'bishop', color: 'black'},
                '7': {type: 'knight', color: 'black'},
                '8': {type: 'rook', color: 'black'}
            }
        }
    }


};