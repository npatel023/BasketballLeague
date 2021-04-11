let instance = null
let playerRepo = require('../repository/playerRepo')
playerRepo = playerRepo.getInstance()

class PlayerService {
    static getInstance() {
        if (instance === null) {
            return new PlayerService()
        }

        return instance
    }

    async addPlayersByTeamId(teamId, playerDetails) {
        return await playerRepo.addPlayersByTeamId(teamId, playerDetails)
    }
    async deletePlayersByTeamId(teamId, playerIds) {
        return await playerRepo.deletePlayersByTeamId(teamId, playerIds)
    }

    async updatePlayersByTeamId(teamId, playerDetails) {
        return await playerRepo.updatePlayersByTeamId(teamId, playerDetails)
    }

    findPlayersToUpdate(currentPlayers, newPlayers) {
        const playersToBeUpdated = []
        const currentPlayerMap = {}

        currentPlayers.forEach(({
            playerId,
            playerName,
            playerNumber,
            playerPosition
        }) => {
            currentPlayerMap[playerId] = {
                playerId,
                playerName,
                playerNumber,
                playerPosition
            }
        })

        newPlayers.forEach(({
            playerId,
            playerName,
            playerNumber,
            playerPosition
        }) => {
            const updateObject = {}
            if (currentPlayerMap.hasOwnProperty(playerId)) {
                const currentPlayerDetails = currentPlayerMap[playerId]
                if (playerName !== currentPlayerDetails.playerName) {
                    updateObject.playerName = playerName
                }
                if (playerNumber !== currentPlayerDetails.playerNumber) {
                    updateObject.playerNumber = playerNumber
                }
                if (playerPosition !== currentPlayerDetails.playerPosition) {
                    updateObject.playerPosition = playerPosition
                }
            }

            if (Object.keys(updateObject).length) {
                updateObject.playerId = playerId
                playersToBeUpdated.push(updateObject)
            }
        })

        return playersToBeUpdated
    }

    findPlayersToInsert(newPlayers) {
        const playersToBeInserted = []

        newPlayers.forEach(({
            playerId,
            playerName,
            playerNumber,
            playerPosition
        }) => {
            if (playerId === 0) {
                playersToBeInserted.push({
                    playerName,
                    playerNumber,
                    playerPosition
                })
            }
        })

        return playersToBeInserted
    }

    findPlayersToDelete(currentPlayers, newPlayers) {
        const playersToBeDeleted = []

        const newPlayerIds = newPlayers.map(player => player.playerId)

        currentPlayers.forEach((player) => {
            if (!newPlayerIds.includes(player.playerId)) {
                playersToBeDeleted.push(player.playerId)
            }
        })

        return playersToBeDeleted
    }
}

module.exports = PlayerService