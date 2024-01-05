class UserGameDTO {
    myColor
    enemyColor
    playerId
    gameId
    canMove
    positions
    piecesTaken = {
        white: [],
        black: []
    }
}

module.exports = UserGameDTO