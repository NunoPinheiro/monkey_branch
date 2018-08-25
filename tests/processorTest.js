var assert = require('assert');
var isSegmentForUser = require('../src/segment_calculator.js')

describe('isSegment', function() {
  // Simple cases for expression evaluators
  it('Should identify User as being in the segment if segment has empty conditions', function() {
    let segment = {
      condition : {}
    }
    let user = {
      attributes: {
        'country': "Japan"
      }
    }
    assert.equal(isSegmentForUser(segment, user), true);
  })

  it('Should identify User as being in the segment for simple field match on string', function() {
    let segment = {
      condition:{
        'country' : "Finland"
      }
    }
    let user = {
      attributes:{
        'country': "Finland"
      }
    }

    assert.equal(isSegmentForUser(segment, user), true);
  });

  it('Should identify User as being in the segment for simple field match on integer', function() {
    let segment = {
      condition:{
        'age' : 11
      }
    }
    let user = {
      attributes:{
        'age': 11
      }
    }

    assert.equal(isSegmentForUser(segment, user), true);
  });

  it('Should identify User as not being in the segment for a simple field match', function() {
    let segment = {
      condition:{
        'country' : "Finland"
      }
    }

    let user = {
      attributes:{
        'country': "Angola"
      }
    }

    assert.equal(isSegmentForUser(segment, user), false);
  });

  it('Should identify User as being in the segment when a endswithField is used', function() {
    let segment = {
      condition:{
        'country' : {endsWith: "land"}
      }
    }

    let user = {
      attributes:{
        'country': "Finland"
      }
    }

    assert.equal(isSegmentForUser(segment, user), true);
  });

  it('Should identify User as not being in the segment when a endswithField is used', function() {
    let segment = {
      condition:{
        'country' : {endsWith: "al"}
      }
    }

    let user = {
      attributes:{
        'country': "Finland"
      }
    }

    assert.equal(isSegmentForUser(segment, user), false);
  });

  it('Should identify User as being in the segment when a startsWith field is used', function() {
    let segment = {
      condition:{
        'city' : {startsWith: "Li"}
      }
    }

    let user = {
      attributes:{
        'city': "Lisbon"
      }
    }
    assert.equal(isSegmentForUser(segment, user), true);
  });

  it('Should identify User as not in the segment when a startsWith field is used', function() {
    let segment = {
      condition:{
        'city' : {startsWith: "Li"}
      }
    }

    let user = {
      attributes:{
        'city': "Helsinki"
      }
    }
    assert.equal(isSegmentForUser(segment, user), false);
  });

  it('Should identify User as being in the segment when a contains field is used', function() {
    let segment = {
      condition:{
        'city' : {contains: "sink"}
      }
    }

    let user = {
      attributes:{
        'city': "Helsinki"
      }
    }
    assert.equal(isSegmentForUser(segment, user), true);
  });
  it('Should identify User as not being in the segment when a contains field is used', function() {
    let segment = {
      condition:{
        'city' : {contains: "sink"}
      }
    }

    let user = {
      attributes:{
        'city': "Lisbon"
      }
    }
    assert.equal(isSegmentForUser(segment, user), false);
  });

  it('Should identify User as being in the segment when an or expression is used', function() {
    let segment = {
      condition:{
        'city' : {or:["Lisbon", "Luanda"]}
      }
    }

    let user = {
      attributes:{
        'city': "Luanda"
      }
    }
    assert.equal(isSegmentForUser(segment, user), true);
  });

  it('Should identify User as being in the segment when an or expression is used with inner expressions', function() {
    let segment = {
      condition:{
        'city' : {or:[{startsWith:"Lis"}, "Luanda"]}
      }
    }

    let user = {
      attributes:{
        'city': "Lis"
      }
    }
    assert.equal(isSegmentForUser(segment, user), true);
  });

  it('Should not identify User as being in the segment when an or expression is used and none of the fields is true', function() {

    let segment = {
      condition:{
        'city' : {or:["Lisbon", "Luanda"]}
      }
    }

    let user = {
      attributes:{
        'city': "Maputo"
      }
    }
    assert.equal(isSegmentForUser(segment, user), false);
  });

  it('Should identify User as being in the segment when an and expression is used with the same value repeated', function() {
    let segment = {
      condition:{
        'city' : {and:["Lisbon", "Lisbon"]}
      }
    }

    let user = {
      attributes:{
        'city': "Lisbon"
      }
    }
    assert.equal(isSegmentForUser(segment, user), true);
  });

  it('Should identify User as being in the segment when an and expression is used with inner expressions', function() {
    let segment = {
      condition:{
        'nickname' : {and:[{startsWith: "Master"}, {endsWith: "Darkness"}]}
      }
    }

    let user = {
      attributes:{
        'nickname': "Master of the real Darkness"
      }
    }
    assert.equal(isSegmentForUser(segment, user), true);
  });

  //Stupid error cases

  it('Should consider user as part of the segment if there is no valid expressionEvaluator for the expression', function(){
    // We assume that is an expression defined in the segment has no expressionEvaluator, then we should consider the user as valid
    let segment = {
      condition : {
        nonexistingExpression : {}
      }
    }
    let user = {
      attributes: {
        'country': "Japan"
      }
    }
    assert.equal(isSegmentForUser(segment, user), true);
  })

  /*
  TODO this test is commented until we get a expression evaluator that can fail when there are issues in the condition writing
  This also expresses that they need to have better validation

  it.only('Should consider user as part of the segment if the expression written in the field is not valid', function(){
    // We assume that is an expression defined in the segment has no expressionEvaluator, then we should consider the user as valid
    let segment = {
      condition : {
        country : {or: 11}
      }
    }
    let user = {
      attributes: {
        'country': "Japan"
      }
    }
    assert.equal(isSegmentForUser(segment, user), true);
  })

  */
  it('Should not consider user as part of the segment if the user attribute is not compatible with the expression evaluated', function(){
    // We get all exceptions from the expression evaluator as a meaning that the parameters given by the user are not valid
    let segment = {
      condition : {
        country : { endsWith: "ki"}
      }
    }
    let user = {
      attributes: {
        'country': 11
      }
    }
    assert.equal(isSegmentForUser(segment, user), false);
  })
});
