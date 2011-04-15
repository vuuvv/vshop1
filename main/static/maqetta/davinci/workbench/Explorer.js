dojo.provide("davinci.workbench.Explorer");

dojo.require("davinci.Workbench");
dojo.require("davinci.workbench.ViewPart");
dojo.require("davinci.ui.widgets.ResourceTreeModel");
dojo.require("davinci.ui.widgets.Tree");
dojo.require("davinci.model.Resource");

dojo.declare("davinci.workbench.Explorer", davinci.workbench.ViewPart, {
	
	toolbarID: "workbench.Explorer",
	getActionsID: function () {
	
		//	return "davinci.ve.VisualEditorOutline";

		return "davinci.workbench.Explorer";
	},
	
	postCreate: function(){
		this.inherited(arguments);

		
		var dragSources=davinci.Runtime.getExtensions("davinci.dnd", function (extension){
			 if (dojo.some(extension.parts,function(item){ return item=="davinci.ui.navigator"; }))
					 if (extension.dragSource)
						 return true;
		});
		
		var model= new davinci.ui.widgets.ResourceTreeModel();
		this.tree = new davinci.ui.widgets.Tree({
			showRoot:false,
			model: model, id:'resourceTree',
			labelAttr: "name", childrenAttrs:"children",
			getIconClass: dojo.hitch(this,this._getIconClass),
			filters : [davinci.model.Resource.alphabeticalSortFilter],
			isMultiSelect : true,
			dragSources:dragSources});

		this.setContent(this.tree); 
		this.tree.startup();
		dojo.connect(this.tree, 'onDblClick',  
				dojo.hitch(this,this._dblClick ));
		this.tree.notifySelect=dojo.hitch(this, function (item)
				{
					var items = dojo.map(this.tree.getSelectedItems(),function(item){ return {resource:item}});
					this.publish("/davinci/ui/selectionChanged",[items,this]);

				});	
		
		var popup=davinci.Workbench.createPopup({ partID: 'davinci.ui.navigator',
				domNode: this.tree.domNode, openCallback:this.tree.getMenuOpenCallback()});

	},

	destroy: function(){
		this.inherited(arguments);
	},
	
	_dblClick: function(node)
	{
		if (node.elementType=="File")
		{
			davinci.Workbench.openEditor({
				fileName: node,
				content: node.getContents()
			});
		}
	},
	
	_getIconClass: function(item, opened){

		if (item.elementType=="Folder")
			return  opened ? "dijitFolderOpened" : "dijitFolderClosed";
		if (item.elementType=="File")
		{
			var icon;
			var fileType=item.getExtension();
			var extension=davinci.Runtime.getExtension("davinci.fileType", function (extension){
				return extension.extension==fileType;
			});
			if (extension)
				icon=extension.iconClass;
			return icon ||	"dijitLeaf";

		}
		return "dijitLeaf";
	}

});