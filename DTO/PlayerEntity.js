class PlayerEntity {
    _id
    gameId
    socketId
    myColor
    enemyColor
    canMove = false
    dateCreated
    dateUpdated

    //
    // constructor(data) {
    //     if(data._id) {
    //         this._id = data._id
    //     }
    //     if(data.gameId) {
    //         this.gameId = data.gameId
    //     }
    //     if(data.socketId) {
    //         this.socketId = data.socketId
    //     }
    //     if(data.color) {
    //         this.myColor = data.color
    //     }
    //     if(data.enemyColor) {
    //         this.enemyColor = data.enemyColor
    //     }
    //     if(data.canMove) {
    //         this.canMove = data.canMove
    //     }
    //     if(data.dateCreated) {
    //         this.dateCreated = data.dateCreated
    //     }
    //     if(data.dateUpdated) {
    //         this.dateUpdated = data.dateUpdated
    //     }
    // }
}

module.exports = PlayerEntity