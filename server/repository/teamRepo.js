let instance = null;
const connection = require("../db");

class TeamRepo {
  static getInstance() {
    if (instance === null) {
      return new TeamRepo();
    }

    return instance;
  }

  async addTeam({ teamName, city }) {
    try {
      return await new Promise((resolve, reject) => {
        connection.query(
          "INSERT INTO teams (team_name, team_city) VALUE (?, ?)",
          [teamName, city],
          (error, results) => {
            if (error) {
              reject(new Error(error.message));
            }
            resolve(results.insertId);
          }
        );
      });
    } catch (error) {
      console.log("addTeam Repo - " + error);
      return 0;
    }
  }

  async getTeamAndPlayersById(teamId) {
    try {
      const selects = [
        'teams.id AS teamId',
        'team_city AS city',
        'team_name AS teamName',
        'players.id AS playerId',
        'player_name AS playerName',
        'player_number AS playerNumber',
        'player_position AS playerPosition'
      ]

      return await new Promise((resolve, reject) => {
        connection.query(
          `SELECT ${selects.join()} FROM teams INNER JOIN players ON teams.id = players.team_id WHERE teams.id = ?`,
          [teamId],
          (error, results) => {
            if (error) {
              reject(new Error(error))
            }
            resolve(results)
          }
        )
      })
    } catch (error) {
      console.log('getTeamAndPlayersById ' + error)
      return []
    }
  }

  async getAllTeams() {
    const selects = [
      'teams.id AS teamId',
      'team_city AS city',
      'team_name AS teamName',
      'players.id AS playerId',
      'player_name AS playerName',
      'player_number AS playerNumber',
      'player_position AS playerPosition'
    ]

    try {
      return await new Promise((resolve, reject) => {
        connection.query(
          `SELECT ${selects.join()} FROM teams INNER JOIN players ON teams.id = players.team_id`,
          [],
          (error, results) => {
            if (error) {
              reject(new Error(error))
            }
            resolve(results)
          }
        )
      })
    } catch (error) {
      console.log('getAllTeams ' + error)
      return []
    }
  }

  async updateTeam(teamId, teamProperties) {
    const mapProperties = {
      city: 'team_city',
      teamName: 'team_name' 
    }

    const updateValues = []
    let sql = "UPDATE teams SET"
    let updateComma = ''

    teamProperties.forEach((teamProperty, index) => {
      const key = Object.keys(teamProperty)[0]
      const mapKey = mapProperties[key]

      if (index > 0 && updateComma === '') {
        updateComma = ','
      } else {
        updateComma = ''
      }

      sql += `${updateComma} ${mapKey} = ?`
      updateValues.push(teamProperty[key])
      
    })

    sql += " WHERE id = ?"

    try {
      return await new Promise((resolve, reject) => {
        connection.query(
          sql,
          [...updateValues, teamId],
          error => {
            if (error) {
              reject(new Error(error))
            }
            resolve(true)
          }
        )
      })
    } catch (error) {
      console.log(`updateTeam - ${error}`)
      return false
    }
  }
}

module.exports = TeamRepo;