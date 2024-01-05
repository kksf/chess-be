class GameEntity {
    _id
    players = []
    positions = {}
    piecesTaken = {
        white: ['pawn', 'pawn', 'pawn', 'pawn'],
        black: ['pawn', 'pawn', 'pawn', 'pawn'],
    }
    dateCreated
    dateUpdated
}

module.exports = GameEntity