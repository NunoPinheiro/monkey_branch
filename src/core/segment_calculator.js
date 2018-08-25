var expressionEvaluators = {
  'endsWith' : endsWithExpressionEvaluator,
  'startsWith' : startsWithExpressionEvaluator,
  'contains': containsExpressionEvaluator,
  'or': orExpressionEvaluator,
  'and': andExpressionEvaluator
  /*
    TODO: We should add more expression evaluators:
      Date based evaluators: (before, after)
      Number based evaluators: gt, gte, lt, lte
      String based evaluators: regex expression evaluator
      Array based evaluators: containsElement (to distinguish from contains?), size?
  */
}

function equalityExpressionEvaluator(params,fieldValue){
  //TODO Define behaviour on equality for different types: e.g is 11 the same as "11"?
  return params == fieldValue
}

function endsWithExpressionEvaluator(params,fieldValue){
  return fieldValue.endsWith(params)
}

function startsWithExpressionEvaluator(params,fieldValue){
  return fieldValue.startsWith(params)
}

function containsExpressionEvaluator(params, fieldValue){
  return fieldValue.includes(params)
}

function orExpressionEvaluator(params, fieldValue){
  for(let i in params){
    let expressionResult = evaluateAttr(params[i], fieldValue)
    if(expressionResult){
      return true
    }
  }
  return false;
}

function andExpressionEvaluator(params, fieldValue){
  for(let i in params){
    let expressionResult = evaluateAttr(params[i], fieldValue)
    if(!expressionResult){
      return false
    }
  }
  return true;
}

function isObject(ref) {
    return (!!ref) && (ref.constructor === Object);
};

function evaluateAttr(params, userFieldValue){
  if(isObject(params)){
    // Assuming here that the object will only have one field for now
    let expressionEvaluatorName = Object.keys(params)[0];
    let expressionEvaluationParams = params[expressionEvaluatorName]
    let expressionEvaluator = expressionEvaluators[expressionEvaluatorName];
    if(!expressionEvaluator){
      // Ignore this expression evaluator if it does not exist
      return true
    }
    let matchesExpression = false;
    try{
      matchesExpression = expressionEvaluator(expressionEvaluationParams, userFieldValue)
    }
    catch(e){
      //For any error inside an expression evaluator, we consider the expression not to be matched
      //TODO we would probably like to add some logging in this situation
    }
    return matchesExpression
  }
  else{
    return equalityExpressionEvaluator(params, userFieldValue)
  }
}

module.exports = function(segment, user){
  if(!user.attributes){
    return false;
  }
  for(let attr in segment.condition){
    let evaluation = evaluateAttr(segment.condition[attr], user.attributes[attr]);
    if(!evaluation){
      //Abort if we found one field that does not match
      return false;
    }
  }
  // Always returns true if no condition aborted
  return true
}
