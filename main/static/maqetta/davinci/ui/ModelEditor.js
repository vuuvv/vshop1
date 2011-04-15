dojo.provide("davinci.ui.ModelEditor");
 
dojo.require("davinci.ui.TextEditor");
//dojo.require("davinci.ui.widgets.HoverHelp");


dojo.declare("davinci.ui.ModelEditor", davinci.ui.TextEditor, {

	  constructor : function (element) {
		this.model=null;
		this.subscribe("/davinci/ui/selectionChanged", this.selectModel);

	},
	colorize : function (text)
	{
	return null;
	},
	
	setContent : function (filename, content) {
		this.inherited(arguments);
		this.model.fileName=filename;
		
		this.model.setText(content);
	
//		var hoverHelp=new davinci.ui.widgets.HoverHelp({label:"programmatically created tooltip", connectId:[this._getEditorID()]});
//		hoverHelp.getTextForPosition=dojo.hitch(this, "getHoverText");
	},
	
	
    getHoverText : function(x,y)
	{
			var lineColPos=this.convertMouseToLine(x,y);
			var childModel=this.model.findChildAtPosition(
					{startOffset:lineColPos.row,endOffset:lineColPos.col});
			return childModel.getLabel();
	        
	},
	
	handleChange: function (text)
	{
		this.inherited(arguments);

		var oldChildren = this.model.children;
		var oldLabel = this.model.getLabel();
		this.model.setText(text);
		
		var notifyChanges=false;
		var modelChanges=[];
		
		if (notifyChanges)
		{
		debugger;
		
		function calculateChange(model, oldChildren,oldModel)
		{
			var newLength = model.length;
			var oldLength = oldChildren.length;
			var newInx = 0, oldInx = 0;

			if (oldLength == newLength) {
				for ( var i = 0; i < newLength; i++) {
					if (model[i].getLabel() != oldChildren[i].getLabel()) {
						modelChanges.push( {
							type : 'change',
							model : model[i]
						});
					}
					calculateChange(model[i].children, oldChildren[i].children,
							oldChildren[i]);
				}
			} else {
				var startNew = 0;
				for ( var oldInx = 0; oldInx < oldLength; oldInx++) {
					var same_found = false;
					var added = [];
					for ( var newInx = startNew; newInx < newLength; newInx++) {
						if (oldChildren[oldInx].getLabel() == model[newInx]
								.getLabel()) {
							sameFound = model[newInx];
							calculateChange(model[i].children,
									oldChildren[i].children, oldChildren[i]);
							startNew = newInx + 1;
							break;
						} else {
							added.push(model[newInx]);
						}
					}
					if (sameFound) {
						for ( var j = 0; j < pluses.length; j++) {
							modelChanges.push( {
								type : 'new',
								model : added[j],
								parent : oldModel
							});
						}
					} else {
						modelChanges.push( {
							type : 'delete',
							model : oldChildren[oldInx],
							parent : oldModel
						});
					}
				}

				// pushing down the trailing elements
				for ( var newInx = startNew; newInx < newLength; newInx++) {
					modelChanges.push( {
						type : 'new',
						model : model[newInx],
						parent : oldModel
					});
				}
			}
		
		}
		
		calculateChange(this.model.children, oldChildren,this.model);
		}
		var changeEvent={newModel:this.model};
		
		dojo.publish("/davinci/ui/modelChanged",[changeEvent]);		
//		for (var i=0;i<this.changeListeners.length; i++)
//			if (notifyChanges)
//				this.changeListeners[i].modelChanged(modelChanges);
//			else
//				this.changeListeners[i].modelChanged(this.model);
	},
	
	selectModel : function (selection)
	{
		if (this.publishingSelect)
			return;
		if (selection.length>0)
		{
			if (selection[0].model)
			{
				var model=selection[0].model;
				if (model.elementType)
					this.select({ startOffset:model.startOffset, endOffset:model.endOffset});
			}
		}
	},


	selectionChange : function (selection)
	{
	   var childModel=this.model.findChildAtPosition(selection);
	   selection.model=childModel;
//		for (var i=0;i<this.selectionListeners.length; i++)
//			if (this.selectionListeners[i] instanceof Function)
//				this.selectionListeners[i](selection);
//			else
//			this.selectionListeners[i].selectionChanged(selection);
	   if (childModel!=this._selectedModel)
		{
			this.publishingSelect=true;
			dojo.publish("/davinci/ui/selectionChanged",[[selection],this]);		
			this.publishingSelect=false;
		   
		}
	   this._selectedModel=childModel;
		
	},


	getSyntaxPositions : function (text,lineNumber)
	{
		
		this.model.setText(text);
		
		if (this.model.getSyntaxPositions)
		{
			var positions=this.model.getSyntaxPositions(lineNumber);
		
			function sortPositions(a,b)
			{
				if (a.line!=b.line)
					return a.line-b.line;
				return a.col-b.col;
			}
			positions=positions.sort(sortPositions);
			return positions;
		}
	},
	

	save : function ()
	{
		var text= this.getText();
		this.model.setText(text);
		this.inherited(arguments);
		
	},
	getErrors : function ()
	{
		return this.model.errors;
	}

});

 