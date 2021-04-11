let instance = null
let teamRepo = require('../repository/teamRepo')
teamRepo = teamRepo.getInstance()

let playerService = require('../service/playerService')
playerService = playerService.getInstance()

class TeamService {
    static getInstance() {
        if (instance === null) {
            return new TeamService()
        }

        return instance
    }

    async addTeam(team) {
        const teamId = await teamRepo.addTeam(team)

        if (teamId === 0) {
            return false
        }

        return teamId
    }

    async getTeamAndPlayersById(teamId) {
        const teamData = await teamRepo.getTeamAndPlayersById(teamId)

        if (!teamData.length) {
            return false
        }

        const playerDetails = teamData.map(({
            playerId,
            playerName,
            playerPosition,
            playerNumber
        }) => ({
            playerId,
            playerName,
            playerNumber,
            playerPosition
        }))

        return {
            teamId: teamData[0].teamId,
            teamName: teamData[0].teamName,
            city: teamData[0].city,
            playerDetails
        }
    }

    async getAllTeams() {
        const teams = await teamRepo.getAllTeams()

        const teamData = {}
        const playerDetails = {}
        const teamArray = []

        if (!teams.length) {
            return []
        }

        teams.forEach(({
            teamId,
            city,
            teamName,
            playerId,
            playerName,
            playerNumber,
            playerPosition
        }) => {
            if (!teamData.hasOwnProperty(teamId)) {
                teamData[teamId] = {
                    teamId,
                    teamName,
                    city
                }
            }
            if (!playerDetails.hasOwnProperty(teamId)) {
                playerDetails[teamId] = []
            }

            playerDetails[teamId].push({
                playerId,
                playerName,
                playerNumber,
                playerPosition
            })
        })

        for (let teamId in teamData) {
            if (teamData.hasOwnProperty(teamId)) {
                teamArray.push({
                    ...teamData[teamId],
                    playerDetails: playerDetails[teamId]
                })
            }
        }

        return teamArray
    }

    async updateTeam(teamData) {
        const currentTeam = await this.getTeamAndPlayersById(teamData.teamId)
        let updateResponse

        const teamPropertiesToUpdate = this.findTeamPropertiesToUpdate(
            {
                city: currentTeam.city,
                teamName: currentTeam.teamName
            },
            {
                city: teamData.city,
                teamName: teamData.teamName
            }
        )

        const playersToBeUpdated = playerService.findPlayersToUpdate(
            currentTeam.playerDetails, 
            teamData.playerDetails
        )

        const playersToBeInserted = playerService.findPlayersToInsert( 
            teamData.playerDetails
        )

        const playersToBeDeleted = playerService.findPlayersToDelete(
            currentTeam.playerDetails,
            teamData.playerDetails
        )
        
        if (teamPropertiesToUpdate.length) {
            updateResponse = teamRepo.updateTeam(teamData.teamId, teamPropertiesToUpdate)
        }

        if (playersToBeUpdated.length) {
            updateResponse = playerService.updatePlayersByTeamId(
                teamData.teamId, 
                playersToBeUpdated
            )
        }

        if (playersToBeInserted.length) {
            updateResponse = playerService.addPlayersByTeamId(
                teamData.teamId,
                playersToBeInserted
            )
        }

        if (playersToBeDeleted.length) {
            updateResponse = playerService.deletePlayersByTeamId(
                teamData.teamId,
                playersToBeDeleted
            )
        }

        return updateResponse
    }

    findTeamPropertiesToUpdate(currentTeam, newTeam) {
        const teamPropertiesToUpdate = []

        for (let teamProperty in currentTeam) {
            if (currentTeam.hasOwnProperty(teamProperty)) {
                if (currentTeam[teamProperty] !== newTeam[teamProperty]) {
                    teamPropertiesToUpdate.push({
                        [teamProperty]: newTeam[teamProperty]
                    })
                }
            }
        }

        return teamPropertiesToUpdate
    }
}

module.exports = TeamService