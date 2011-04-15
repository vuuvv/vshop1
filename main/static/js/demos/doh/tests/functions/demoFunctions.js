dojo.provide("demos.doh.tests.functions.demoFunctions");

//Import in the code being tested.
dojo.require("demos.doh.demoFunctions");

doh.register("demos.doh.tests.functions.demoFunctions", [

	function test_alwaysTrue(){
		//	summary:
		//		A simple test of the alwaysTrue function
		//	description:
		//		A simple test of the alwaysTrue function
		doh.assertTrue(demos.doh.demoFunctions.alwaysTrue());
	},
	function test_alwaysFalse(){
		//	summary:
		//		A simple test of the alwaysFalse function
		//	description:
		//		A simple test of the alwaysFalse function
		doh.assertTrue(!demos.doh.demoFunctions.alwaysFalse());
	},
	function test_isTrue(){
		//	summary:
		//		A simple test of the isTrue function
		//	description:
		//		A simple test of the isTrue function with multiple permutations of 
		 //		calling it.
		doh.assertTrue(demos.doh.demoFunctions.isTrue(true));
		doh.assertTrue(!demos.doh.demoFunctions.isTrue(false));
		doh.assertTrue(demos.doh.demoFunctions.isTrue({}));
		doh.assertTrue(!demos.doh.demoFunctions.isTrue());
		doh.assertTrue(!demos.doh.demoFunctions.isTrue(null));
		doh.assertTrue(!demos.doh.demoFunctions.isTrue(0));
	},
	{
		//This is a full test fixture instead of a stand-alone test function.  
		//Therefore, it allows over-riding of the timeout period for a deferred test.  
		//You can also define setup and teardown function
		//for complex tests, but they are unnecessary here.
		name: "test_asyncEcho",
		timeout: 5000, // 5 seconds.
		runTest: function() {
			//	summary:
			//		A simple async test of the asyncEcho function.
			//	description:
			//		A simple async test of the asyncEcho function.
			var deferred = new doh.Deferred();
			var message  = "Success";
			function callback(string){
				try {
					doh.assertEqual(message, string);
					deferred.callback(true);
				} catch (e) {
					deferred.errback(e);
				}
			}
			demos.doh.demoFunctions.asyncEcho(callback, message);
			return deferred; 	//Return the deferred.  D.O.H. will 
								//wait on this object for one of the callbacks to 
								//be called, or for the timeout to expire.
		}
	}
]);
