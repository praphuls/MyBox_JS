// ************************************************************
/*
  Author: Praphul Sinha
  Name: Tests
*/
// ************************************************************

QUnit.test( "_Array test cases", function( assert ) {
  
  //create object
  var newArr = new _Array({'name': 'Henry'});
  assert.ok(typeof newArr === "object", "Instance of _Array [Object]");

  //length
  assert.equal(newArr._length, 1, "After creating an instance of _Array with one object value. The length of newArr object is 1");

  //Push
  newArr._push({'name': 'Henry'});
  newArr._push({'name': 'Larry'})
  newArr._push({'name': 'Surgey'})
  newArr._push({'name': 'Frank'})
  assert.equal(newArr._length, 5, "After pushing 4 more objects. the length should be 5");

  //pop a value from an array
  assert.equal(typeof newArr._pop(), 'object', "Pop a value from the array.");
  assert.equal(newArr._length, 4, "New length of newArr is 4.");

  //indexof
  assert.equal(newArr._indexOf(2), -1, "No value exist in array hence it returns -1");

  newArr._push(007)
  assert.equal(newArr._indexOf(007), 4, "Value exists in array object");
  newArr._pop();
  //reverse
  assert.equal(typeof newArr._reverse(), 'object', "Reversed array.");

  //shift a value
  assert.deepEqual(newArr._shift(), {'name': 'Henry'}, "Element at zeroth element removed. {'name': 'Henry'} is removed");
  assert.equal(newArr._length, 3, "New length of the array is 3");

  //unshift
  assert.equal(newArr._unShift('Ramanujan'), 4, "Element is inserted at position 0. New length is 4.");
  newArr._shift();

  //sortBy
  newArr._push({'name': 'Newton'})
  assert.deepEqual(newArr._sortBy(), ["Henry", "Larry", "Surgey", "Newton"], "default sortBy()");
  assert.deepEqual(newArr._sortBy('keys'), ["0", "1","2","3"], "sortBy - with only field");
  assert.deepEqual(newArr._sortBy('values', 'ascending'), ["Henry", "Larry", "Surgey", "Newton"], "sortBy('values', 'ascending')");
  assert.deepEqual(newArr._sortBy('values', 'descending'),["Newton", "Surgey","Larry","Henry"], "sortBy('values', 'descending')");
});