dojo.provide("demos.doh.tests.module");
//This file loads in all the test definitions.  

try{
	//Load in the demoFunctions module test.
	dojo.require("demos.doh.tests.functions.demoFunctions");
	//Load in the widget tests.
	dojo.require("demos.doh.tests.widgets.DemoWidget");
}catch(e){
	doh.debug(e);
}

