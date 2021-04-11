const { response } = require("express");
const connection = require("../db");

let instance = null;

class PlayerRepo {
  static getInstance() {
    if (instance === null) {
      return new PlayerRepo();
    }

    return instance;
  }

  async addPlayersByTeamId(teamId, playerDetails) {
    const insertValues = [];

    try {
      playerDetails.forEach(({
        playerName,
        playerNumber,
        playerPosition
      }) => {
        insertValues.push([
          teamId,
          playerName,
          playerNumber,
          playerPosition
        ])
      });

      return await new Promise((resolve, reject) => {
        connection.query(
          "INSERT INTO players (team_id, player_name, player_number, player_position) VALUES ?",
          [insertValues],
          (error) => {
            if (error) {
              reject(new Error(error.message));
            }
            resolve(true)
          }
        );
      });
    } catch (error) {
      console.log("addPlayersByTeamId" + error);
      return false;
    }
  }

  async deletePlayersByTeamId(teamId, playerIds) {
    try {
      return await new Promise((resolve, reject) => {
        connection.query(
          "DELETE FROM players WHERE team_id = ? AND id IN (?)",
          [teamId, playerIds],
          error => {
            if (error) {
              reject(new Error(error))
            }
            resolve(true)
          }
        )
      })
    } catch (error) {
      console.log(`deletePlayersByTeamId - ${error}`)
      return false
    }
  }

  async updatePlayersByTeamId(teamId, playerDetails) {
    const playerMap = {
      playerName: 'player_name',
      playerNumber: 'player_number',
      playerPosition: 'player_position'
    }

    let updateValues
    const updateQueries = []
    let sql
    let playerKeyCounter = 1

    playerDetails.forEach((player) => {
      sql = "UPDATE players SET"
      updateValues = []
      const numberOfPlayerKeys = Object.keys(player).length - 1
      playerKeyCounter = 1
      for (let playerProperty in player) {
        if (player.hasOwnProperty(playerProperty) && 
            playerProperty !== 'playerId'
        ) {

          sql += ` ${playerMap[playerProperty]} = ?`
          updateValues.push(player[playerProperty])

          if (playerKeyCounter !== numberOfPlayerKeys) {
            sql += ','
          }
          playerKeyCounter++
        }
      }

      sql += " WHERE team_id = ? AND id = ?"
      updateValues.push(teamId, player.playerId)

      updateQueries.push({
        query: sql,
        properties: updateValues
      })
    })

    try {
      const responses = await Promise.all(
        updateQueries.map(async ({
          query,
          properties
        }) => {
          return await new Promise((resolve, reject) => {
            connection.query(
              query,
              properties,
              error => {
                if (error) {
                  console.log(error)
                  reject(false)
                }
                resolve(true)
              }
            )
          })
        })
      )

      return responses.includes(false) ? false : true    
    } catch (error) {
      console.log(`updatePlayers - ${error}`)
      return false
    }
  }
}

module.exports = PlayerRepo;
