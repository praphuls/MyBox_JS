// ************************************************************
/*
	Author: Praphul Sinha
	Name: _Array
	Description: This class mimics the behaviour of an javscript Array class
*/
// ************************************************************

var _Array = (function(){

	/*
	Private Property
	NAME: max_Index_Value
	DES: 	This is the max number that can be taken as value of index.
	*/
	var max_Index_Value = Math.pow(2, 32) - 1 
	var arrayObject = {};

	var evt = new Event("ARRAY_CHANGED");
	this.addEventListener("ARRAY_CHANGED", updateArray, false);
	
	var __length;
	var __array;

	/*
	Private Function
	NAME: ToUint32(value) 
	PARAMETERS: any signed/unsigned number
	RETURNS: a positive number
	DES: 	This function returns a value whose sign is not preserved, 
			the result is always a Uint32. Unsigned shifts convert their 
			left-hand side to Uint32. Shifting by 0 digits returns the converted value.
	*/
	function ToUint32(value) {
        return value >>> 0;
    }


    /*
    Private Function
	NAME: maximumIndexValue(object) 
	DES: 	This function returns the max number that can be taken as value of index. 
			This is used while calculating the length of the array object.
	*/
    function maximumIndexValue(object){
    	var maxIndex = -1;
    	for(var _prop in object){
    		if(String(ToUint32(_prop)) === _prop && ToUint32(_prop) !== max_Index_Value){ 
    			if(ToUint32(_prop) >= maxIndex){
    				maxIndex = parseInt(_prop);
    			}

    		}
    	}
    	return maxIndex;
    }

    /*
    Private Function
	NAME: setInitialValuesToArray(object) 
	DES: Sets the value in array object, initally
	*/
    function setInitialValuesToArray(object){
    	if(calculateLength(arrayObject)>0){
    		arrayObject = {};	
    	}

    	if(object.length >0){
    		for(var i=0; i<object.length; i++){
				arrayObject[i] = object[i];
			}
			dispatchEvent(evt);
    	}
    	else{
    		arrayObject = {};
    	}
		
	}

	/*
    Private Function
	NAME: calculateLength(object) 
	DES: Calculates the length of the array object
	*/
    function calculateLength(object){
    	var value = Object.keys(object).length;
    	var length = value;
		var constrainedValue = ToUint32(value);

       	if (constrainedValue !== +value) {
        	throw new RangeError();
        }

        length = constrainedValue;

        var maxIndexProperty = +maximumIndexValue(this);
	    return Math.max(length, maxIndexProperty + 1);
	}

	/*
    Private Function
	NAME: pushArray(value) 
	DES: adds an element to the array object at the end
	*/
	function pushArray(value){
		var currentIndex = calculateLength(arrayObject)-1;
		arrayObject[currentIndex+1] = value;

		return calculateLength(arrayObject);
	}

	/*
    Private Function
	NAME: popArray() 
	DES: Removes the last element of an array
	*/
	function popArray(){
		var index = calculateLength(arrayObject)-1;
		var poppedElem;
		for(var prop in arrayObject){
			if(prop == index){
				poppedElem = arrayObject[prop]
				delete arrayObject[prop];
			}
		}
		return poppedElem;
	}

	/*
    Private Function
	NAME: indexOfArray(value) 
	DES: Search the array for an element and returns its position
	*/
	function indexOfArray(value){
		var index = -1; 

		if(typeof value === 'object'){
			return -1;
		}
		
		for(var prop in arrayObject){
			if(arrayObject[prop] === value){
				index = parseInt(prop);
			}
		}
		return index;
	}

	/*
    Private Function
	NAME: reverseArray() 
	DES: Reverses the order of the elements in an array
	*/
	function reverseArray(){
		var strLen = calculateLength(arrayObject);
		var revObj = {};
		
		for(var i=0; i<strLen; i++){
			revObj[i] = arrayObject[strLen-i-1];
		}
		return revObj;
	}

	/*
    Private Function
	NAME: shiftArray() 
	DES: Removes the first element of an array
	*/
	function shiftArray(){
		var index = 0;
		var shiftedElem;
		for(var prop in arrayObject){
			if(prop == index){
				shiftedElem = arrayObject[prop]
				delete arrayObject[prop];
			}
		}
		var tempObj = getClonedArray(arrayObject);
		reOrderArray_after_shift(tempObj);
		return shiftedElem;
	}

	/*
    Private Function
	NAME: unShiftArray() 
	DES: Adds new elements to the beginning of an array
	*/
	function unShiftArray(value){
		var strLen = calculateLength(arrayObject);
		var tempObj = getClonedArray(arrayObject);
		var index = 0;
		arrayObject = {};
		
		arrayObject[index] = value;

		for(var i=0; i<strLen; i++){
			arrayObject[i+1] = tempObj[i];
		}
		
		dispatchEvent(evt);
		return calculateLength(arrayObject);
	}

	/*
    Private Function
	NAME: reOrderArray_after_shift(clonedObj) 
	DES: helper function - used to rearrange the array ordering
	*/
	function reOrderArray_after_shift(clonedObj){
		var strLen = calculateLength(clonedObj);
		arrayObject = {};
		for(var i=0; i<strLen; i++){
			arrayObject[i] = clonedObj[i+1];
		}
		return arrayObject;
		dispatchEvent(evt);
	}

	/*
    Private Function
	NAME: sliceArray(i, j) 
	DES: Selects a part of an array, and returns the new array
	*/
	function sliceArray(i, j){
		var start = i;
		var end = j;
		var index = 0;
		var newArray = {};
		var arrLen = calculateLength(arrayObject);

		for(var prop in arrayObject){
			if(i >= 0 && j >= 0){
				if(prop == start){
					while(index < end){
						if(typeof arrayObject[index] == 'object'){
							newArray[index] = JSON.stringify(arrayObject[index])
						}
						else
							newArray[index] = arrayObject[index];
						index += 1;
					}
				}
			}
			else{
				index = arrLen + start;
				if(prop == index){
					while(index < (arrLen+end)){
						if(typeof arrayObject[index] == 'object'){
							newArray[index] = JSON.stringify(arrayObject[index])
						}
						else
							newArray[index] = arrayObject[index];
						index += 1;
					}
				}
			}
					
		}
		return newArray;
	}

	/*
    Private Function
	NAME: joinArray(str) 
	DES: Joins all elements of an array into a string
	*/
	function joinArray(str){
		var arrStr = '';
		var joinStr;
		if(str ==null || str == undefined)
			joinStr = ', ';
		else
			joinStr = ' ' + str +' ';
		var len = calculateLength(arrayObject);

		for(var prop in arrayObject){
			if(prop == len-1){
				if(typeof arrayObject[prop] == 'object')
					arrStr += JSON.stringify(arrayObject[prop]);
				else
					arrStr += arrayObject[prop];
			}
			else{
				if(typeof arrayObject[prop] == 'object')
					arrStr += JSON.stringify(arrayObject[prop]) + joinStr;
				else
					arrStr += arrayObject[prop] + joinStr;
			}
		}
		
		return arrStr
	}

	/*
    Private Function
	NAME: getClonedArray(obj) 
	DES: helper function - creates the copy of an object and returns it
	*/
	function getClonedArray(obj){
		var clonedObj = (JSON.parse(JSON.stringify(obj)));
		return clonedObj;
	}

	/*
    Private Function
	NAME: updateArray(e) 
	DES: callback function of Event("ARRAY_CHANGED")
	*/
	function updateArray(e){
		__length = calculateLength(arrayObject);
		__array = getArray(arrayObject);
	}

	/*
    Private Function
	NAME: getArray(arr) 
	DES: returns the elements of the array object as string
	*/
	function getArray(arr){
		var arrStr = '[';
		for(var prop in arr){
			if(typeof arr[prop] == 'object')
				arrStr += JSON.stringify(arr[prop]) + ', '
			else
				arrStr += arr[prop] + ', ';
			
		}
		__array = (arrStr + ']').replace(', ]', ']');
		return __array
	}

	/*
    Private Function
	NAME: getArrayValues(index) 
	DES: returns an element of the array object at any index
	*/
	function getArrayValues(index){
		var arrVal = '';
		var arrLen = calculateLength(arrayObject);
		if(index !== null || index !== undefined){

			if(index > arrLen)
				throw new RangeError;

			for(var prop in arrayObject){
				if(prop == index){
					arrVal = arrayObject[prop]
				}
			}
			return arrVal
		}

		return arrVal
		dispatchEvent(evt);
		
	}

	/*
    Private Function
	NAME: returnArrayObj() 
	DES: returns the copy of the array object
	*/
	function returnArrayObj(){
		var obj = {};
		for(var prop in arrayObject){
				obj[prop] = arrayObject[prop];
		}
		return obj;
	}


	/*
    Private Function
	NAME: getArrayObj(arr) 
	DES: helper function for sortBy()
	*/
	function getArrayObj(val){
		var key = val;
		var obj = {};

		if(val == 'values'){
			obj = {};
			for(var prop in arrayObject){
				if(typeof arrayObject[prop] === 'object'){
					var tempObj = arrayObject[prop]
					for(var p in tempObj){
						obj[tempObj[p]] = prop;
					}
				}
				else
					obj[arrayObject[prop]] = prop;
			}
		}
		else if(val == 'keys'){
			obj = {};
			for(var prop in arrayObject){
				if(typeof arrayObject[prop] === 'object'){
					var tempObj = arrayObject[prop]
					for(var p in tempObj){
						obj[prop] = tempObj[p];
					}
				}
				else
					obj[prop] = arrayObject[prop];
			}
		}
		else
			throw new Error('Please pass only "keys" or "values" as field')

		return obj;
	}

	/*
    Private Function
	NAME: sortedBy(field, order) 
	DES: retuns an array after sorting
	*/
	function sortedBy(field, order)
	{
		var sorted;
		var list;

		if(field == null && order == null){
			sorted = _sorter(getArrayObj('values'), 'ascending');
		}

		if(typeof order !== 'function'){
			if(((typeof field !== null && typeof field !== "undefined")) && 
				(typeof order !== null && typeof order !== "undefined"))
			{	
				sorted = _sorter(getArrayObj(field), order, field);
			}
			else
			{
				if(typeof field !== null && typeof field !== "undefined"){
					sorted = _sorter(getArrayObj(field), 'ascending');
				}
				else{
					list = getArrayObj('values');
					sorted = _sorter(list, 'ascending');
				}

			}
		}
		else if(typeof order == 'function'){
			if(((typeof field !== null && typeof field !== "undefined")) && 
				(typeof order !== null && typeof order !== "undefined"))
			{	
				sorted = _sorterFn(getArrayObj(field), order);
			}
		}
		
		return sorted;
	}

	/*
    Private Function
	NAME: _sorter(list, order)
	DES: helper function for sortBy()
	*/
	function _sorter(list, order, field){
		var sorted;
		if(order == 'descending'){
			sorted = (Object.keys(list).sort(function(a,b){
				return list[b]-list [a]}));
		}
		else if(order == 'ascending'){
			sorted = (Object.keys(list).sort(function(a,b){
				return list[a]-list [b]}));
		}

		return sorted;
	}

	/*
    Private Function
	NAME: _sorter(list, order)
	DES: helper function for sortBy()
	*/
	function _sorterFn(list, func){
		var sorted;
		sorted = (Object.keys(list).sort(func));
		return sorted;
	}


	/*
    	This class returns a function which exposed public API's
    	****** Retuned function starts ******
	*/
	return function(values){

		setInitialValuesToArray(arguments);

		return {

			/*
			    Public Property
				DES: Sets or returns the number of elements in an array
			*/
			_length : __length,

			/*
			    Public Function
				DES: Adds new elements to the end of an array, and returns the new length
			*/
			_push	: function(value){
				var pushed = pushArray(value);
				dispatchEvent(evt);
				this._length = __length;

				return pushed;
			},

			/*
			    Public Function
				DES: Removes the last element of an array, and returns that element
			*/
			_pop: function(){
				var popped = popArray();

				dispatchEvent(evt);
				this._length = __length;
				return popped;
			},

			/*
			    Public Function
				DES: Search the array for an element and returns its position
			*/
			_indexOf: function(value){
				return(indexOfArray(value));
			},

			/*
			    Public Function
				DES: Reverses the order of the elements in an array
			*/
			_reverse: function(){
				return reverseArray();
			},

			/*
			    Public Function
				DES: Removes the first element of an array, and returns that element
			*/
			_shift: function(){
				var shifted = shiftArray();

				dispatchEvent(evt);
				this._length = __length;
				return shifted;
			},

			/*
			    Public Function
				DES: Adds new elements to the beginning of an array, and returns the new length
			*/
			_unShift: function(value){
				var unshift = unShiftArray(value);

				dispatchEvent(evt);
				this._length = __length;
				return unshift;
			},

			/*
			    Public Function
				DES: Selects a part of an array, and returns the new array
			*/
			_slice: function(i, j){
				return sliceArray(i, j);
			},

			/*
			    Public Function
				DES: Joins all elements of an array into a string
			*/
			_join: function(str){
				return joinArray(str);
			},

			/*
			    Public Function
				DES: Sorts the elements of an array
				USE: sortBy(field*, order* || sortFunc)
					field can be: 'keys' || 'values'
					order can be: 'ascending' || 'descending'
						Example: 	arr._sortBy('values', 'descending'),
									arr._sortBy('keys', 'ascending')
				
					sortFunc can be: function(a,b){return b-a}
						Example: 	arr._sortBy('values', function(a,b){return b-a}),
									arr._sortBy('keys', function(a,b){return b-a})

				    IMP:by default: returns arr._sortBy('values', 'ascending'), 
						when no arguments is passed.
						it behaves like _sort() function.

			*/			
			_sortBy: function(field, order){
				return sortedBy(field, order);
			},

			/*
			    Public Function
				DES: Returns an element at any position
			*/
			_arrayValuesByIndex: function(index){
				dispatchEvent(evt);
				return getArrayValues(index);
			},

			/*
			    Public Function
				DES: Returns the copy of the array object
			*/
			_arrayObj: function(){
				return returnArrayObj();
			},

			/*
			    Public Function
				DES: Sorts the elements of an array - default sorting
			*/
			_sort: function(){
				dispatchEvent(evt);
				return sortedBy();
			},

			/*
			    Public Function
				DES: Searched Returns an element at any position
			*/
			_find: function(index){
				dispatchEvent(evt);
				return getArrayValues(index);
			}
		}
	}
})()

