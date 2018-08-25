// Current database implementation is a simple Redis broker that saves our main objects.
// We are assuming that this redis storage will be persistent.
// By using redis we can allow our accesses to be sharded based on the user keys.
// Keys for the configuration of the system will still be not sharded, and end always in the same node
// For now this won't be considered a problem since most of this information can also be stored in memory with a TTL
// We may also want to separate the configuration data from the users data since those have different database requirements
// TODO at least for MVP we are not adding any validations to the database schemas

var redis = require("redis")
const {promisify} = require('util');

var client = redis.createClient();
const get = promisify(client.get).bind(client);
const mget = promisify(client.mget).bind(client);
const put = promisify(client.set).bind(client);
const scan = promisify(client.scan).bind(client);
const del = promisify(client.del).bind(client);


client.on("error", function (err) {
  //TODO define what to do with the client in these events
    console.log("Error " + err);
});

function getterFor(key){
  return async function(id){
    let object = await get(key + id)
    return JSON.parse(object)
  }
}

function setterFor(key){
  return async function(object){
    if(object.id == null){
      //TODO return some kind of error here
      return
    }
    await put(key + object.id, JSON.stringify(object));
  }
}

function listerFor(key){
  return async function(){
    //Right now we do a simple listing since we probably won't have a big ammount of configurations
    let scanResult = await scan(0, "MATCH", key + "*");
    let mgetResults = await mget(scanResult[1])
    //Return desserialized version of objects
    return mgetResults.map(obj => JSON.parse(obj))
  }
}

function deleterFor(key){
  return async function(id){
    await del(key + id);
  }
}

//Database functions for User
module.exports.getUser = getterFor("User")
module.exports.setUser = setterFor("User")
// Not adding support for user listing or deleting

//Database functions for Configurations
module.exports.getConfiguration = getterFor("Configuration")
module.exports.setConfiguration = setterFor("Configuration")
module.exports.listConfigurations = listerFor("Configuration")
module.exports.deleteConfiguration = deleterFor("Configuration")


//Database functions for Experiments
module.exports.getExperiment = getterFor("Experiment")
module.exports.setExperiment = setterFor("Experiment")
module.exports.listExperiments = listerFor("Experiment")
module.exports.deleteExperiment = deleterFor("Experiment")

//Database functions for Segments
module.exports.getSegment = getterFor("Segment")
module.exports.setSegment = setterFor("Segment")
module.exports.listSegment = listerFor("Segment")
module.exports.deleteSegment = deleterFor("Segment")
