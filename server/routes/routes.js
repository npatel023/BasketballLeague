const router = require('express').Router()

const { response } = require('express')
let teamController = require('../controllers/teamController')


router.post('/addTeam', (request, response) => {
    const controller = teamController.getInstance()

    controller.addTeam(request, response)
})

router.get('/getAllTeams', (request, response) => {
    const controller = teamController.getInstance()
    controller.getAllTeams(request, response)
})

router.patch('/updateTeam', (request, response) => {
    const controller = teamController.getInstance()
    controller.updateTeam(request, response)
})

module.exports = router