const validator = require('validator').default
const playerConstants = require('../constants/player')

function validateIntegerGreaterThanZero(input) {
    const inputString = input.toString()
    return validator.isNumeric(inputString) && input > 0
}

function validateInteger(input) {
    input = input.toString()
    return validator.isNumeric(input)
}

function validateText(input) {
    input = input.toString()
    return validator.isAlpha(input.trim(), ['en-US'], {
        ignore: ' '
    })
}

function validatePlayerDetailsArray(input) {
    let validData = true
    // TODO add validation for player id

    input.forEach(({
        playerName,
        playerNumber,
        playerPosition
    }) => {
        if (!validateText(playerName) ||
            !validateInteger(playerNumber) ||
            !playerConstants.positions.hasOwnProperty(playerPosition)
        ) {
            validData = false
        }
    })

    return validData
}

module.exports = {
    validateInteger,
    validateText,
    validatePlayerDetailsArray,
    validateIntegerGreaterThanZero
}