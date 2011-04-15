dojo.require("davinci.ve.themeEditor.commands.ThemeEditorCommand");
dojo.provide("davinci.ve.themeEditor.commands.StateChangeCommand");
dojo.declare("davinci.ve.themeEditor.commands.StateChangeCommand", davinci.ve.themeEditor.commands.ThemeEditorCommand, {

	constructor: function(args){
		dojo.mixin(this, args);
	},
	execute: function(){
		//debugger;;
		this.old_selectedWidget = this._themeEditor._selectedWidget;
		this.old_selectedSubWidget = this._themeEditor._selectedSubWidget;
		this._themeEditor._currentState = this._newState; // the state is for all the widgets on the page
		var widgetName = null;
    	var subWidgetName = null;
    	

		if(!this._widgets){
			//this._widgets = dojo.query('[dvThemeWidget="true"]');
			this._widgets = this._themeEditor.getContext().getDocument().querySelectorAll('.dvThemeWidget');
		}
		var widgets = this._widgets; 
		for (var i=0; i<widgets.length; i++){
			// enable the widget
			this._themeEditor.enableWidget(widgets[i]._dvWidget);
			if((!this._oldState) || (this._themeEditor._theme.isStateValid(widgets[i]._dvWidget,this._oldState))){// the init state is undefined we want to get to a know state
				// remove the styles from all widgets and subwidgets that supported the state
				this._themeEditor._theme.removeWidgetStyleValues(widgets[i]._dvWidget,this._oldState);
			} 
			if(this._themeEditor._theme.isStateValid(widgets[i]._dvWidget,this._newState)){
	    		// set the style on all widgets and subwidgets that support the state	
	    		this._themeEditor._theme.setWidgetStyleValues(widgets[i]._dvWidget,this._newState);
			} else{
				// disable the widget
				this._themeEditor.disableWidget(widgets[i]._dvWidget);
				
			}

		}

		if (!this._firstRun){
			this._widget.processingUndoRedo = true;
			dojo.publish("/davinci/states/state/changed", [{widget:'$all', newState:this._newState, oldState:this._oldState, origin: this.declaredClass}]); 
		}
		this._firstRun = false;
		this.updatePropertiesView();
		
	},
	undo: function(){
		//debugger;
		this._themeEditor._selectedWidget = this.old_selectedWidget;
		this._themeEditor._selectedSubWidget = this.old_selectedSubWidget;
		this._themeEditor._currentState = this._oldState; // the state is for all the widgets on the page
    	var widgets = this._widgets; // so we saved them in execute to use here
		for (var i=0; i<widgets.length; i++){
			if(!this._themeEditor._theme.isStateValid(widgets[i]._dvWidget,this._newState)){
				// enable the widget
				this._themeEditor.enableWidget(widgets[i]);
			}
			if(this._themeEditor._theme.isStateValid(widgets[i]._dvWidget,this._oldState)){
				// enable the widget
				this._themeEditor.enableWidget(widgets[i]._dvWidget);
			} else {
				// disable the widget
				this._themeEditor.disableWidget(widgets[i]._dvWidget);
			}
    		// remove the styles from all widgets and subwidgets that supported the state
    		this._themeEditor._theme.removeWidgetStyleValues(widgets[i]._dvWidget,this._newState);
    		// set the style on all widgets and subsidgets that support the state	
    		this._themeEditor._theme.setWidgetStyleValues(widgets[i]._dvWidget,this._oldState);
    		
		}

		this._widget.processingUndoRedo = true;
		//davinci.ve.states.setState(this._widget, this._oldState); 
		this.updatePropertiesView();

		dojo.publish("/davinci/states/state/changed", [{widget:'$all', newState:this._oldState, oldState:this._newState, origin: this.declaredClass}]); 
		
						
	}
});