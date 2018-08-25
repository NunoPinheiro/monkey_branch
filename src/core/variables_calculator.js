let isSegmentForUser = require("./segment_calculator.js")
let calculateVariant = require("./variant_calculator.js")

module.exports = function(user, segments, configurations, experiments){
  let segmentsForUser = segments.filter(segment => isSegmentForUser(segment, user));
  let segmentIdsForUser = segments.map(s => s.id);
  let configurationsForUser = configurations.filter(c => filterBySegment(c, segmentIdsForUser))
  let experimentsForUser = experiments.filter(e => filterBySegment(e, segmentIdsForUser))
  let userVariants = experimentsForUser.map(ex => calculateVariant(user, ex))

  let variables = calculateVariables(user, configurationsForUser, userVariants)

  let processedVariants = userVariants.map(v => function(){
    return {
      name: v.name,
      experimentId: v.ExperimentId
    }
  })
  // We return both the variables of the user and the variants to which they belong
  return {
    variables: variables,
    variants: processedVariants
  }
}

function filterBySegment(element, segmentIds){
  for(let i in element.segments){
    let segment = element.segments[i];
    if(segmentIds.includes(segment)){
      return true;
    }
  }
  return false;
}

/**
  We add the variables in the following order:
    - Configuration variables
    - Variants variables
    - User variables

  In terms of business, this means we are setting first the most generic variables
  Then we are setting experiment variables to the user
  And last we are setting variables that were written directly to the user

  The reason why user varibles always win is because we may want to override the configuration for a specific user,
  regardless of their configurations and experiments.
  Notice that in general, a speicifc user should not have configurations.
**/
function calculateVariables(user, configurations, userVariants){
  let variables = {}
  //Add all the sources to a single list
  let orderedSources = configurations.concat(userVariants)
  orderedSources.push(user);

  let orderedVariables = orderedSources.map(x => x.variables)
  for(let i in orderedVariables){
    let newVariables = orderedVariables[i];
    for(let variable in newVariables){
      variables[variable] = newVariables[variable]
    }
  }
  return variables;
}
