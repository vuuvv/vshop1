dojo.provide("demos.doh.tests.widgets.DemoWidget");

if(dojo.isBrowser){
	//Define the HTML file/module URL to import as a 'remote' test.
	doh.registerUrl("demos.doh.tests.widgets.DemoWidget", 
					dojo.moduleUrl("demos", "doh/tests/widgets/DemoWidget.html"));
}

