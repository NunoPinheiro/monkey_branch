// For current version, our database functions are dumb
// We are just gonna test the database function generators
var rewire = require('rewire')
var databaseModule = rewire('../src/database/database.js');
get = databaseModule.__get__('getterFor')("TestKey")
set = databaseModule.__get__('setterFor')("TestKey")
list = databaseModule.__get__('listerFor')("TestKey")
del = databaseModule.__get__('deleterFor')("TestKey")

var assert = require('assert');

describe('database access', function() {
  it('Write element, read it, delete it and confirm failed read', async function() {
    let expectedAttr = "setterValue"
    let testId = "testId"
    await set({id: testId, attr: expectedAttr})
    let readObject = await get(testId)
    assert.equal(readObject.attr, expectedAttr)

    //Now let's remove the object from the database

    del(testId)

    let readObjectAfterDel = await get(testId)
    assert.equal(readObjectAfterDel, null)

  })

  it('Write 3 elements and list them', async function() {
    let attrs = ["attr1", "at2", "atttrr3"]
    for(let i in attrs){
        await set({id: i, attr: attrs[i]})
    }

    let elements = await list();

    assert.equal(elements.length, 3)
    for(let i in elements){
      //Ensure that the attr value for the returned elements is in the original list
      assert.equal(attrs.includes(elements[i].attr), true)

    }
  })
})
