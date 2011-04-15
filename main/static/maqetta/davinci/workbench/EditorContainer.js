dojo.provide("davinci.workbench.EditorContainer");
dojo.require("davinci.workbench._ToolbaredContainer");
dojo.declare("davinci.workbench.EditorContainer",davinci.workbench._ToolbaredContainer, {

	constructor:function(args){
		// Menu routines in Dojo and Workbench require unique names
		var unique="m"+(new Date().getTime());
		this.toolbarMenuActionSets=[
      		{
      			 id: unique+"-DropdownMenuActionSet",
      			 visible:true,
      			 menu: [
      				{ 
      					__mainMenu : true,
      					separator :
      					[
      					 	"dropdown",false
      					]
      				},
      				{ 
      					 label : "",
      					 path : "dropdown",
      					 id : unique+"-DropdownMenu",
      					 separator :
      						  [ unique+"-DropdownMenu.action1",true,
      						  unique+"-DropdownMenu.action2",true
      						  ]
      				 }/*, 
      				 { 
      					 label : "Do Something",
      					 path : unique+"-DropdownMenu/"+unique+"-DropdownMenu.action1",
      					 id : unique+"-DropdownMenu.action1",
      					 run: "alert('something works')"
      				 }, 
      				 { 
      					 label : "Do Something Else",
      					 path : unique+"-DropdownMenu/"+unique+"-DropdownMenu.action2",
      					 id : unique+"-DropdownMenu.action2",
      					 run: "alert('something else works')"
      				 }*/
      			],
      			actions:[]
      		}
      	];
	},
	
	setEditor: function(editorExtension,fileName,content,file){
		
		this.editorExtension=editorExtension;
		var constr=dojo.getObject(editorExtension.editorClass);
		var editor = this.editor=new constr(this.containerNode);
		this.containerNode = editor.domNode || this.containerNode;
		editor.editorID=editorExtension.id;
		editor.isDirty= (editor.isReadOnly) ? false : this.isDirty;
		this._createToolbar();
		if (!content)
		{
			content=editor.getDefaultContent();
			editor.isDirty=!editor.isReadOnly;
			editor.lastModifiedTime=new Date().getTime();
		}
		if (!content)
			content="";
		editor.resourceFile=file;
		editor.setContent(fileName,content);
		editor.editorContainer=this;
		this.setDirty(editor.isDirty);
		//dojo.publish("/davinci/ui/EditorOpening", [this.editor]);
	},

	setDirty : function (isDirty)
	{
		var title=this.attr("title");
		if (title[0]=="*")
			title=title.substring(1);
		if (isDirty)
			title="*"+title;
		davinci.Workbench.editorTabs.setTitle(this,title);
		this.lastModifiedTime=new Date().getTime();
		this.isDirty = isDirty;
	},
	
	save : function(isWorkingCopy){
		this.editor.save(isWorkingCopy);
		this.setDirty(isWorkingCopy);
		
	},
	_close : function(editor, dirtycheck){
		dojo.publish("/davinci/ui/EditorClosing", [editor]);
		var okToClose = true;
		if (dirtycheck && editor && editor.isDirty){
		     okToClose=confirm("This file has unsaved changes. Are you sure you want to close WITHOUT saving?");
		}
		if (okToClose ){
	    	
			//this.editor.resourceFile.removeWorkingCopy();
			if(editor.getFileEditors){
				function removeWorkingCopy(editor){
					if (editor.isReadOnly) return;
					editor.resourceFile.removeWorkingCopy();
				}
				dojo.forEach(editor.getFileEditors(), function (editor){
					removeWorkingCopy(editor);
				});	
			}else if(editor.resourceFile){
				editor.resourceFile.removeWorkingCopy();	 
			}
	 	}
		return okToClose;
	},
	/* Callback to handle notifier when parent widget closes an
	 * editor tab, usually in response to user clicking on "x" close icon.
	 */
	onClose : function(){
		return this._close(this.editor, true);
	},
	/* forceClose is where daVinci actively removes a child editor.
	 * (eg, saveas might close old editor before creating new editor)
	 */
	forceClose : function(editor, dirtycheck){
		this._close(editor, dirtycheck);
		var parent = this.getParent();
		if(parent){	
			parent.removeChild(this);
			this.destroyRecursive();
		}
	},
	_getViewActions: function()
	{
		var editorID=this.editorExtension.id;
		var editorActions=[];
		var extensions = davinci.Runtime.getExtensions('davinci.editorActions', function(ext){
			if (editorID==ext.editorContribution.targetID)
			{
				editorActions.push(ext.editorContribution);
				return true;
			}
		});
		return editorActions;
	},

	_getViewContext : function()
	{
		return this.editor;
	},

	destroy : function()
	{
		this.inherited(arguments);
		//TODO: should we implement getChildren() in _ToolbaredContainer instead so that the children will get destroyed automatically?
        if (this.editor)
        	this.editor.destroy();
        delete this.editor;
	}
});
