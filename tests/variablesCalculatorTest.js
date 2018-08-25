var assert = require('assert');
var calculateVariables = require('../src/variables_calculator.js')

describe('calculateVariables', function() {
  it("Should calculate empty variables when there are no segments", function(){
    //user, segments, configurations, experiments
    let user = {}
    let segments = []
    let configurations = []
    let experiments = []
    let result = calculateVariables(user, segments, configurations, experiments)
    assert.deepEqual(result.variables, {})
    assert.deepEqual(result.variants, {})
  })

  it("Should return an aggregation of the variables in the configurations, the experiments, and the user", function(){
    let user = {
      id: "TestUser",
      variables: { userVariable: true},
      attributes: {
        name:"TestUser"
      }
    }

    let segments = [
      {
        id:"testSegment",
        condition:{
          name: "TestUser"
        }
      }
    ]

    let configurations = [
      {
        segments: ["testSegment"],
        variables:{
          configurationVariable: true
        }
      }
    ]

    //Use a single 100% experiment for this case
    let experiments = [
      {
        id: "experiment1",
        segments: ["testSegment"],
        variants: [{
          name: "variant1",
          percentage: 100,
          variables:{
            variantVariable : true
          }
        }]
      }
    ]

    let result = calculateVariables(user, segments, configurations, experiments)

    assert.deepEqual(result.variables,
      {
        userVariable: true,
        variantVariable: true,
        configurationVariable: true
      }
    );
  })
  it("Should override configuration variables in the right order", function(){
    let user = {
      id: "TestUser",
      variables: {
        overridesExperimentFromUser : true,
        overridesConfigurationFromUser : true,
        specificUserConfiguration: true
      },
      attributes: {
        name:"TestUser"
      }
    }

    let segments = [
      {
        id:"testSegment",
        condition:{
          name: "TestUser"
        }
      }
    ]

    let configurations = [
      {
        segments: ["testSegment"],
        variables:{
          overridesConfigurationFromUser : true,
          overridesConfigurationFromExperiment : "false",
          notOverridenConfiguration: false
        }
      }
    ]

    //Use a single 100% experiment for this case
    let experiments = [
      {
        id: "experiment1",
        segments: ["testSegment"],
        variants: [{
          name: "variant1",
          percentage: 100,
          variables:{
            overridesExperimentFromUser : false,
            overridesConfigurationFromExperiment : "true",
            notOverridenExperiment: "false"
          }
        }]
      }
    ]

    let result = calculateVariables(user, segments, configurations, experiments)

    assert.deepEqual(result.variables,
      {
        overridesExperimentFromUser : true,
        overridesConfigurationFromUser : true,
        specificUserConfiguration: true,
        notOverridenExperiment: "false",
        overridesConfigurationFromExperiment : "true",
        notOverridenConfiguration: false
      }
    );
  })
})
