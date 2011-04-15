dojo.provide("demos.doh.demoFunctions");

//This file contains a collection of helper functions that are not
//part of any defined dojo class.

demos.doh.demoFunctions.alwaysTrue = function() {
	//	summary:
	//		A simple demo helper function that always returns the boolean true when 
	//		called.
	//	description:
	//		A simple demo helper function that always returns the boolean true when 
	//		called.
	return true; // boolean.
};

demos.doh.demoFunctions.alwaysFalse = function() {
	//	summary:
	//		A simple demo helper function that always returns the boolean false when 
	//		called.
	//	description:
	//		A simple demo helper function that always returns the boolean false when 
	//		called.
	return false; // boolean.
};

demos.doh.demoFunctions.isTrue = function(/* anything */ thing) {
	//	summary:
	//		A simple demo helper function that returns true if the thing passed in is
	//		 logically true.
	//	description:
	//		A simple demo helper function that returns true if the thing passed in is 
	//		logically true.
	//		This means that for any defined objects, or boolean values of true, it 
	//		should return true,
	//		For undefined, null, 0, or false, it returns false.
	//	thing:
	//		Anything.  Optional argument.
	var type = typeof thing;
	if (type === "undefined" || thing === null || thing === 0 || thing === false) {
		return false; //boolean
	}
	return true; // boolean
};

demos.doh.demoFunctions.asyncEcho = function(/* function */ callback, 
											/* string */ message){
	//	summary:
	//		A simple demo helper function that does an asynchronous echo of a message.
	//	description:
	//		A simple demo helper function that does an asynchronous echo of a message.
	//		The callback function is called and passed parameter 'message' two seconds 
	//		after this helper
	//		is called.
	//	callback:
	//		The function to call after waiting two seconds.  Takes one parameter, 
	//		a string message.
	//	message:
	//		The message to pass to the callback function.
	if (dojo.isFunction(callback)) {
		var handle;
		var caller = function() {
			callback(message);
			clearTimeout(handle);
			handle = null;
		};
		handle = setTimeout(caller, 2000);
	}
};
