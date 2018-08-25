let md5 = require('md5')
module.exports = function(user, experiment){
  // We are going to use the monkeyBranchId of the user if available
  // Else we revert to the user id
  let monkeyId = user.monkeyBranchId || user.Id;
  let hash = md5(monkeyId + experiment.id)
  // Get a smaller version of the hash and convert it to int
  // Then we the modulo by 100 to get a percentage were to locate the user
  let userLocation = parseInt(hash.substring(20), 16) % 100

  //Calculate specific variant for the user
  let currentPercentage = 0;
  for(let i in experiment.variants){
    let currentVariant = experiment.variants[i]
    currentPercentage += currentVariant.percentage
    if(userLocation < currentPercentage){
      return currentVariant
    }
  }
}
