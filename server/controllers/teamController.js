let instance = null;
let teamService = require("../service/teamService")
let playerService = require('../service/playerService')
const teamValidatorService = require("../service/teamValidatorService")

teamService = teamService.getInstance()
playerService = playerService.getInstance()

class TeamController {
  static getInstance() {
    if (instance === null) {
      return new TeamController();
    }

    return instance;
  }

  async addTeam(request, response) {
    try {
      const { teamData } = request.body;

      if (
        !teamValidatorService.validateInteger(teamData.teamId) ||
        !teamValidatorService.validateText(teamData.city) ||
        !teamValidatorService.validateText(teamData.teamName) ||
        !teamValidatorService.validatePlayerDetailsArray(teamData.playerDetails)
      ) {
        response.status(400);
        return response.json({
          success: false,
          message: 'Invalid Request'
        })
      }

      const teamId = await teamService.addTeam({
        teamName: teamData.teamName,
        city: teamData.city,
      })

      if (teamId === false) {
        response.status(500);
        return response.json({
          success: false,
          message: "Error adding team",
        })
      }

      const playerSaveReponse = playerService.addPlayersByTeamId(teamId, teamData.playerDetails)

      if (playerSaveReponse === false) {
        response.status(500)
        return response.json({
          success: false,
          message: "Error adding players to team",
        })
      }

      const team = await teamService.getTeamAndPlayersById(teamId)

      if (team === false) {
        response.status(500)
        return response.json({
          success: false,
          message: 'Error retrieving saved team details'
        })
      }

      response.json({
        success: true,
        team,
      })
    } catch (error) {
      console.log(error)
      response.json({
        success: false,
        message: 'Error adding team'
      })
    }
  }

  async getAllTeams(request, response) {
    try {
      const teams = await teamService.getAllTeams()

      response.json({
        success: true,
        teamData: teams
      })
    } catch (error) {
      console.log(error)
      response.json({
        success: false,
        message: 'Error retrieving team data'
      })
    }
  }

  async updateTeam(request, response) {
    const { teamData } = request.body;
    try {
      if (
        !teamValidatorService.validateInteger(teamData.teamId) ||
        !teamValidatorService.validateText(teamData.city) ||
        !teamValidatorService.validateText(teamData.teamName) ||
        !teamValidatorService.validatePlayerDetailsArray(teamData.playerDetails)
      ) {
        response.status(400);
        return response.json({
          success: false,
          message: 'Invalid Request'
        })
      }

      const updateResponse = await teamService.updateTeam(teamData)

      if (!updateResponse) {
        return response.json({
          success: false,
          error: 'Error updating team data'
        })
      }

      const team = await teamService.getTeamAndPlayersById(teamData.teamId)

      response.json({
        success: true,
        team
      })

    } catch (error) {
      console.log(error)
      response.json({
        success: false,
        message: 'Error updating team data'
      })
    }
  }
}

module.exports = TeamController;
