dojo.provide("davinci.ve.input.DataGridInput");
dojo.require("davinci.ve.input.SmartInput");
//dojo.require("davinci.ve.commands.ModifyFileItemStoreCommand");
dojo.require("davinci.commands.OrderedCompoundCommand");

dojo.declare("davinci.ve.input.DataGridInput", davinci.ve.input.SmartInput, {

	propertyName: "structure",
	
	childType: null,

	property: "structure",
	
	displayOnCreate: "true",
	
	delimiter: ", ",
	
	multiLine: "true",
	supportsHTML: "false", // FIXME: we need to support encoding 
	helpText:  'First line is column headers separated by commons all following lines are data for those columns.',

//	helpText:  'If the CSV data format button is selected enter text in the format: first line is column headers separated by commons all following lines are data for those columns.'+
//    		   ' If the URL button is selected enter the absolute location of the json item file.',



	serialize: function(widget, callback, value) {
        var structure = value || widget.attr('structure');
        var names = [];
        var fields = [];
        for (var i=0; i<structure.length; ++i) {
            fields.push(structure[i].field);
            names.push(structure[i].name);
        }
		callback(fields.join(", ") + '\n' + names.join(", ")); 
	},
	
	// splits the input by rows then columns
	// see @update() for format
	parse: function(input) {
		var values = this.parseGrid(input);
        if (values.length < 2) {
            alert('invalid input (1)');
            return input;
        }
        var fields = values[0];
        var names = values[1];
        if (fields.length < names.length) {
            alert('invalid input (2)');
            return input;
        }
        var structure = [];
        for (var i=0; i<fields.length; ++i) {
            var field = fields[i].text;
            var name = names[i].text;
            var width = 'auto';
            var editor = 'dojox.grid.editors.Input';
            structure.push({field: field, name: name, width: width, editor: editor});
        }
        return structure;
	},
	
    // in this case, the first row is the Fields
    // the second row is the Display Names (column headers)
	update: function(widget, structure) {
	    if (structure.length > 0) {
	        var properties = {structure: structure};
	        var command = new davinci.ve.commands.ModifyCommand(widget, properties, null, this._getContext());
	        this._getContext().getCommandStack().execute(command);
	        return command.newWidget;
	    }
	    return widget;
	    
	},
	
	_getContainer: function(widget){
		while(widget){
			if ((widget.isContainer || widget.isLayoutContainer) && widget.declaredClass != "dojox.layout.ScrollPane"){
				return widget;
			}
			widget = davinci.ve.widget.getParent(widget); 
		}
		return undefined;
	},
	
	_getEditor: function() {
		return top.davinci && top.davinci.Runtime && top.davinci.Runtime.currentEditor;
	},
	
	_getContext: function() {
		var editor = this._getEditor();
		return editor && (editor.getContext && editor.getContext() || editor.context);
	},
	
    cellTypeTranslator: { 'Text':'dojox.grid.cells.Cell',
	                      'CheckBox':'dojox.grid.cells.Bool',
                          'Select':'dojox.grid.cells.Select',
                          'dojox.grid.cells.Cell':'Text',
                          'dojox.grid.cells.Bool':'CheckBox',
                          'dojox.grid.cells.Select':'Select'
	},
	
	
	refreshStoreView: function(){
		var textArea = dijit.byId("davinciIleb");
		var structure = this._widget.attr("structure");
		var value ='';
		for (var x = 0; x < structure.length; x++){
			var pre = (x > 0) ? ', ' : '';
			value += pre + structure[x].name;
		}
		value += '\n';
		for (var i = 0; i <  this._widget.dijitWidget.store._arrayOfAllItems.length; i++){
			var item = this._widget.dijitWidget.store._arrayOfAllItems[i];
			for (var s = 0; s < structure.length; s++){
				var pre = (s > 0) ? ', ' : '';
				value += pre + item[structure[s].field];
			}
			value += '\n';
		}
		this._data = value;
		textArea.attr('value', String(value));
	},
	
	
//    die: function() {
//        this._inline.destroyDescendants();
//        this._inline.destroy();
//        delete this._inline;
//    },

    addOne: function() {
        this._gridColDS.newItem({rowid: this._rowid++, width: "auto", editable: true, hidden: false});
    },
    
    removeOne: function() {
        var gridColDS = this._gridColDS;
        dojo.forEach(this._gridColumns.selection.getSelected(), function(item) {
            gridColDS.deleteItem(item);
        });
    },
    
	
	onOk: function(e){
		var dummyDataRadioButton = dijit.byId("davinci.ve.input.DataGridInput.dummyData");
	    if (dummyDataRadioButton.checked){
	    	this.updateWidget();
	    }else{
	    	this.updateWidgetForUrlStore();
	    	 
	    }
	    this.hide(true); // we already updated the widget so just do a hide like cancel
	},
	
    updateWidget: function() {
        var structure = [];
        
        var context = this._getContext();
        var widget = this._widget;
        	
    	var storeCmd = this.updateStore(structure);
    	structure = this._structure;
        var command = new davinci.ve.commands.ModifyCommand(widget, {structure: structure}, null, context);
        var compoundCommand = new davinci.commands.OrderedCompoundCommand();
        compoundCommand.add(storeCmd);
        compoundCommand.add(command);
        context.getCommandStack().execute(compoundCommand);  
        context.select(command.newWidget);

    },
    
    updateStore: function(structure) {
    	var oldStructure = structure; // we are defining the structure by row one of text area
    	var structure = [];
    	var textArea = dijit.byId("davinciIleb");
    	var value = textArea.attr('value');
		var nodes = value;
		var rows = value.split('\n');
		var cols = rows[0].split(',');
		for (var c = 0; c < cols.length; c++){
			var cell = new Object();
			cell.cellType = 'dojox.grid.cells.Cell';
			cell.width = 'auto';
			cell.name = cols[c];
			cell.field = cols[c].replace(/\s+/g, '_').toLowerCase();
			structure[c] = cell;
		}
		this._structure = structure;
		var data = { identifier: 'uniqe_id', items:[]};
		
		var rows = value.split('\n');
		var items = data.items;
		for (var r = 1; r < rows.length; r++){ // row 0 of the textarea defines colums in data grid structure
			var cols = rows[r].split(',');
		
			var item = new Object();
			item.uniqe_id = r; // unique id for items
			for (var s = 0; s < structure.length; s++){
				var fieldName = structure[s].field;
				if (cols[s])
					item[fieldName] = cols[s];
			}
			items.push(item);
		}
	
		
		return this.replaceDataGridStoreData(data);
	},
	
	replaceStoreData: function(store, data) {
		// Kludge to force reload of store data
		store.clearOnClose = true;
		store.data = data;
		store.close();
		store.fetch({
			query: this.query,
			queryOptions:{deep:true}, 
			onComplete: dojo.hitch(this, function(items){
				for (var i = 0; i < items.length; i++) {
					var item = items[i];
					console.warn("i=", i, "item=", item);
				}
			})
		});
	},

	replaceDataGridStoreData: function(data) {
		var store = this._widget.dijitWidget.store;

		var storeId = this._widget.domNode._dvWidget._srcElement.getAttribute("store");
		var storeWidget = davinci.ve.widget.byId(storeId);
		//this._attr(storeWidget, "data", data);
		var properties = {};
		properties['data'] = data;
		storeWidget._srcElement.setAttribute('url', ''); //wdr 3-11
		properties.url = ''; // this is needed to prevent ModifyCommmand mixin from puttting it back//delete properties.url; // wdr 3-11
		var command = new davinci.ve.commands.ModifyCommand(storeWidget, properties);
		//var command = new davinci.ve.commands.ModifyFileItemStoreCommand(storeWidget, properties);
		store.data = data;

		return command;
	},
		
	_attr: function(widget, name, value) {
		var properties = {};
		properties[name] = value;
		
		var command = new davinci.ve.commands.ModifyCommand(widget, properties);
		this._addOrExecCommand(command);
	},
	
	_addOrExecCommand: function(command) {
		if (this.command && command) {
			this.command.add(command);
		} else {
			this._getContext().getCommandStack().execute(this.command || command);
		}	
	},
	
	toggleInputBoxes: function(e){
		
		var dummyDataRadioButton = dijit.byId("davinci.ve.input.DataGridInput.dummyData");
	    var textArea = dijit.byId("davinciIleb");
	    var tagetObj = dojo.byId("iedResizeDiv");
	    //var urlTextBox = dijit.byId("davinci.ve.input.DataGridInput.url");
	    if (dummyDataRadioButton.checked){
	    	//dojo.style(textArea.domNode, 'display', '');
	    	//dojo.style(urlTextBox.domNode, 'display', 'none');
	    	//this._inline.eb = textArea;
	    	
	    	textArea.setValue( this._data);
	    	//this.multiLine = 'true';
	    	//tagetObj.style.height = '145px';
	    	tagetObj.style.height = '85px';
	    }else{
//	    	dojo.style(textArea.domNode, 'display', 'none');
//	    	dojo.style(urlTextBox.domNode, 'display', '');
//	    	this._inline.eb = urlTextBox;
	    	textArea.setValue( this._url);
	    	//this.multiLine = 'false';
	    	tagetObj.style.height = '40px';

	    }
    	this.resize(null);

	},
	
	updateWidgetForUrlStore: function(){
		
		var structure = [];
    	//var textBox = dijit.byId("davinci.ve.input.DataGridInput.url"); 
    	var textArea = dijit.byId("davinciIleb");
    	var url = textArea.value;
    	//this._widget._edit_context.baseURL = http://localhost:8080/davinci/user/user5/ws/workspace/file1.html
    	//url = 'http://localhost:8080/davinci/user/user5/ws/workspace/' + url;
    	var store = new dojo.data.ItemFileReadStore({url: url});
    	store.fetch({
    		query: this.query,
    		queryOptions:{deep:true}, 
    		onComplete: dojo.hitch(this, this._urlDataStoreLoaded)
    	});
    	this._urlDataStore = store;
    	
    
    	
	},
	
	_urlDataStoreLoaded : function(items){
		var structure = [];
		if (items.length < 1){
			alert('Error: data store empty');
			return;
		}
		var item = items[0];
		for (name in item){
			if (name !== '_0' && name !== '_RI' && name !== '_S'){
				var cell = new Object();
				cell.cellType = 'dojox.grid.cells.Cell';
				cell.width = 'auto';
				cell.name = name;
				cell.field = name;
				structure.push(cell);
			}
		}
		for (var i = 0; i < items.length; i++) {
			var item = items[i];
			console.warn("i=", i, "item=", item);
		}
		//return this.replaceDataGridStoreData(data);
		var store = this._widget.dijitWidget.store;
		var storeId = this._widget.domNode._dvWidget._srcElement.getAttribute("store");
		var storeWidget = davinci.ve.widget.byId(storeId);
		var properties = {};
		var context = this._getContext();
        var widget = this._widget;
		properties['url'] = this._urlDataStore.url;
		storeWidget._srcElement.setAttribute('data', ''); //wdr 3-11
		properties.data = ''; // to prevent ModifyCommand mixin from putting it back//delete properties.data; //3-11
		var storeCmd = new davinci.ve.commands.ModifyCommand(storeWidget, properties);
        var command = new davinci.ve.commands.ModifyCommand(widget, {structure: structure}, null, context);
        var compoundCommand = new davinci.commands.OrderedCompoundCommand();
        compoundCommand.add(storeCmd);
        compoundCommand.add(command);
        context.getCommandStack().execute(compoundCommand);  
        context.select(command.newWidget);

		//this.die();
	},
	
	show: function(widgetId) {
        this._widget = davinci.ve.widget.byId(widgetId);
//	    this._inline = new dijit.Dialog({
//            title: this._widget.type+" Dialog",
//            style: "width: 670px; height:450px"
//        });
	    
	    var width = 200;
		var height = 155;
		this._loading(height, width);
	    
  
        var content = this._getTemplate();
        this._inline.attr("content", content);
       // this._inline.onCancel = dojo.hitch(this, "cancel");
        this._inline.callBackObj = this;
 
        this._connection.push(dojo.connect(this._inline, "onBlur", this, "onOk"));  
		//this._connection.push(dojo.connect(this._inline.eb, "onMouseDown", this, "stopEvent")); 
		//this._connection.push(dojo.connect(this._inline.eb, "onClick", this, "updateSimStyle"));
		this._connectHelpDiv();
		this._connectResizeHandle();
		this._connectSimDiv();
		this.updateFormats();
		this._loadingDiv.style.backgroundImage = 'none'; // turn off spinner
		//dojo.style(this._inline.domNode, 'backgroundColor', 'red');
		//this._inline.eb.focus();
		this.resize(null);

        var dataRadioButton = dijit.byId("davinci.ve.input.DataGridInput.dummyData");
        dataRadioButton.onClick = dojo.hitch(this, "toggleInputBoxes");
        var urlRadioButton = dijit.byId("davinci.ve.input.DataGridInput.urlData");
        urlRadioButton.onClick = dojo.hitch(this, "toggleInputBoxes");
        
        var storeId = this._widget._srcElement.getAttribute("store"); 
   		var storeWidget = davinci.ve.widget.byId(storeId);
        this._data = storeWidget._srcElement.getAttribute('data'); 
        this._url = storeWidget._srcElement.getAttribute('url'); 
       
        
        this._inline.eb = dijit.byId("davinciIleb");
        this._connection.push(dojo.connect(this._inline.eb, "onMouseDown", this, "stopEvent"));
        //if(this._data){ 
        if(true){  // FIXME: this is to hide url for 0.80
        	dataRadioButton.setChecked(true);
        	urlRadioButton.setChecked(false);
        	this._url = ' ';
        	this.refreshStoreView();
        }else{
        	urlRadioButton.setChecked(true);
        	dataRadioButton.setChecked(false);
        	//var urlTextBox = dijit.byId("davinci.ve.input.DataGridInput.url");
        	this._inline.eb.setValue(/* this._widget.dijitWidget.store.url*/ this._url); 
        	this._data = ' ';
        }

        this.toggleInputBoxes(null);
        
	},
	
	updateFormats: function(){
		
		var disabled = true;
		
		// NOTE: if you put a break point in here while debugging it will break the dojoEllipsis
		var localDojo = this._widget.getContext().getDojo();
		var textObj = dojo.byId("davinci.ve.input.SmartInput_radio_text_width_div");
		var htmlRadio = dijit.byId('davinci.ve.input.SmartInput_radio_html');
		var textRadio = dijit.byId('davinci.ve.input.SmartInput_radio_text');
		var table = dojo.byId('davinci.ve.input.SmartInput_table');
		dojo.style(textRadio.domNode, 'display', 'none');
		dojo.style(htmlRadio.domNode, 'display', 'none');
		dojo.style(table, 'display', 'none');
		
		
	},
	
	
	_getTemplate: function(){
		
		var editBox = ''+
		'<div id="iedResizeDiv"  class="iedResizeDiv" style="width: 200px; height: 60px;" >' + 
//	    '    <input type="radio" dojoType="dijit.form.RadioButton" name="dataGridData" id="davinci.ve.input.DataGridInput.dummyData" value="dummyData" /><label for="davinci.ve.input.DataGridInput.dummyData">Create data grid from CSV data:</label><br /> ' +
//        '    <input type="radio" dojoType="dijit.form.RadioButton" name="dataGridData" id="davinci.ve.input.DataGridInput.urlData" value="urlData" /><label for="davinci.ve.input.DataGridInput.urlData">Create data grid from URL data:</label><br /> ' +
        '	<textarea  dojoType="dijit.form.SimpleTextarea" name="davinciIleb"  trim="true" id="davinciIleb" style="width:200px; height:60px;" class="smartInputTextArea" ></textarea>' +
//        '   <input type="text" name="davinci.ve.input.DataGridInput.url" value="" placeHolder="Enter url" dojoType="dijit.form.TextBox"    trim="true" id="davinci.ve.input.DataGridInput.url" /> ' +
			'<div id="smartInputSim" class="smartInputSim" ></div>'+
			'<div id="iedResizeHandle" dojoType="dojox.layout.ResizeHandle" targetId="iedResizeDiv" constrainMin="true" maxWidth="200" maxHeight="600" minWidth="200" minHeight="40"  activeResize="true" intermediateChanges="true" ></div>' +
		'</div>';

		var template = ''+ editBox +
		'<div  id="davinci.ve.input.SmartInput_div"  class="davinciVeInputSmartInputDiv" >' + 
			'<div id="davinci.ve.input.SmartInput_radio_div" class="smartInputRadioDiv" >' + 
				'<table id="davinci.ve.input.DataGridInput_table" style="display:none;"> ' +
					'<tbody>' + 
						'<tr> '+
		 					'<td class="smartInputTd1"> <input type="radio" dojoType="dijit.form.RadioButton" name="dataGridData" id="davinci.ve.input.DataGridInput.dummyData" value="dummyData" />  </td> '+
		 					'<td class="smartInputTd2">'+
		 						'<div  class="smartInputRadioTextDiv">'+
		 							'Create data grid from CSV data:'+
		 						'</div>'+
		     				'</td> '+
							'</tr> '+
							'<tr> '+
		 					'<td class="smartInputTd1"> <input type="radio" dojoType="dijit.form.RadioButton" name="dataGridData" id="davinci.ve.input.DataGridInput.urlData" value="urlData" />  </td> '+
		 					'<td class="smartInputTd2">'+
		 						'<div id="davinci.ve.input.SmartInput_radio_html_width_div" class="smartInputRadioTextDiv">'+
		 							'Create data grid from URL data:'+
		 						'</div>'+
		     				'</td> '+
						'</tr> '+
					'</tbody>'+ 
				'</table> '+
				'<table id="davinci.ve.input.SmartInput_table"> ' +
					'<tbody>' + 
						'<tr> ' +
							'<td class="smartInputTd1" > ' +
								'<input id="davinci.ve.input.SmartInput_radio_text" showlabel="true" type="radio" dojoType="dijit.form.RadioButton" disabled="false" readOnly="false" intermediateChanges="false" checked="true"> </input> '+
	             			'</td> ' +
	             			'<td class="smartInputTd2" >'+ 
	             				'<div id="davinci.ve.input.SmartInput_radio_text_width_div" class="smartInputRadioTextDiv">'+
	             				'</div>'+
             				'</td> ' +
         				'</tr>'+
         				'<tr> '+
         					'<td class="smartInputTd1"> <input id="davinci.ve.input.SmartInput_radio_html" showlabel="true" type="radio" dojoType="dijit.form.RadioButton"> </input>  </td> '+
         					'<td class="smartInputTd2">'+
         						'<div id="davinci.ve.input.SmartInput_radio_html_width_div" class="smartInputRadioTextDiv">'+
         						'</div>'+
             				'</td> '+
     					'</tr> '+
 					'</tbody>'+ 
					'</table> '+
				'<div class="smartInputHelpDiv" > '+
	        		'<span id="davinci.ve.input.SmartInput_img_help"  title="Help" class="inlineEditHelp" > </span>'+
		        	'<span class="smartInputSpacerSpan" >'+
		        	'<button id="davinci.ve.input.SmartInput_ok"  dojoType="dijit.form.Button" type="button" class="inlineEditHelpOk" >OK</button> <button id=davinci.ve.input.SmartInput_cancel dojoType="dijit.form.Button" class="inlineEditHelpCancel"> Cancel</button>  '+
		        	'</span>   '+
		        '</div> '+
		        '<div id="davinci.ve.input.SmartInput_div_help" style="display:none;" class="smartInputHelpTextDiv" > '+
		        	'<div dojoType="dijit.layout.ContentPane" style="text-align: left; padding:0; " >'+this.getHelpText()+ '</div> '+
		        	'<div style="text-align: left; padding:0; height:2px;" ></div> '+
		        '</div> '+
	        '</div>' + 
        '</div> '+
        '';
			return template;
	}
	
	

});