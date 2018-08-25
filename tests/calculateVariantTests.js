var assert = require('assert');
var calculate_variant = require('../src/variant_calculator.js')

describe('calculate_variant', function() {
  it('Should return first variant for 100 distribution', function() {
    let expectedVariantName = "OnlyVariant";
    let user = {
      id: "TestUser",
    }

    let experiment = {
      id: "TestId",
      variants: [
        {
          name: expectedVariantName,
          percentage: 100
        }
      ]
    }
    let calculatedVariant = calculate_variant(user, experiment)
    assert.equal(calculatedVariant.name, expectedVariantName)
  })

  it('Should return second variant for 50/50 distribution', function() {
    //Calculated percentage for TestUserTestId is 51, so it should fall into second group
    let expectedVariantName = "secondVariant";
    let user = {
      id: "TestUser",
    }

    let experiment = {
      id: "TestId",
      variants: [
        {
          name: "firstVariant",
          percentage: 50
        },
        {
          name: expectedVariantName,
          percentage: 50
        }
      ]
    }

    let calculatedVariant = calculate_variant(user, experiment)
    assert.equal(calculatedVariant.name, expectedVariantName)
  })

  it('Should return third variant for 30/30/40 distribution', function() {
    //Calculated percentage for TestUserTestId is 67, so it should fall into the third group
    let expectedVariantName = "thirdVariant";
    let user = {
      id: "TestUser",
    }

    let experiment = {
      id: "TestId",
      variants: [
        {
          name: "firstVariant",
          percentage: 30
        },
        {
          name: "secondVariant",
          percentage: 30
        },
        {
          name: expectedVariantName,
          percentage: 40
        }
      ]
    }

    let calculatedVariant = calculate_variant(user, experiment)
    assert.equal(calculatedVariant.name, expectedVariantName)
  })


    it('Should return first variant for 70/10/20 distribution', function() {
      //Calculated percentage for TestUserTestId is 67, so it should fall into the third group
      let expectedVariantName = "firstVariant";
      let user = {
        id: "TestUser",
      }

      let experiment = {
        id: "TestId",
        variants: [
          {
            name: expectedVariantName,
            percentage: 70
          },
          {
            name: "secondVariant",
            percentage: 10
          },
          {
            name: "thirdVariant",
            percentage: 20
          }
        ]
      }

      let calculatedVariant = calculate_variant(user, experiment)
      assert.equal(calculatedVariant.name, expectedVariantName)
    })

    //Validation of returned fields in the variant
    it('Should return the experimentId, the variant name and the variables', function() {
      let expectedVariantName = "OnlyVariant";
      let expectedVariables = { variable1: true}
      let expectedExperimentId = "TestId"

      let user = {
        id: "TestUser",
      }

      let experiment = {
        id: expectedExperimentId,
        variants: [
          {
            name: expectedVariantName,
            percentage: 100,
            variables:expectedVariables
          }
        ]
      }
      let calculatedVariant = calculate_variant(user, experiment)
      assert.equal(calculatedVariant.name, expectedVariantName)
      assert.equal(calculatedVariant.experimentId, expectedExperimentId)
      assert.equal(calculatedVariant.variables, expectedVariables)
    })

})
