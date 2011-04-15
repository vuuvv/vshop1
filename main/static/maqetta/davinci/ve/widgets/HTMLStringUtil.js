dojo.provide("davinci.ve.widgets.HTMLStringUtil");
dojo.require("davinci.ve.widgets.MultiInputDropDown");
dojo.require("davinci.ve.widgets.MetaDataStore");
dojo.require("davinci.ve.widgets.FontDataStore");
dojo.require("dijit.form.ComboBox");
dojo.require("dijit.TitlePane");
dojo.require("davinci.ve.widgets.ColorPicker");
dojo.require("davinci.ve.widgets.EventSelection");
dojo.require("davinci.ve.widgets.CommonProperties");
dojo.require("davinci.ve.widgets.WidgetProperties");
dojo.require("davinci.ui.widgets.FileFieldDialog");
dojo.require('davinci.ve.widgets.Trblbox');


davinci.ve.widgets.HTMLStringUtil.__id = 0;
davinci.ve.widgets.HTMLStringUtil.idPrefix = "davinci_ve_widgets_properties_generated";
davinci.ve.widgets.HTMLStringUtil._currentPropSection = null;
davinci.ve.widgets.HTMLStringUtil.getCurrentPropSection = function(){
	return davinci.ve.widgets.HTMLStringUtil._currentPropSection;
}

davinci.ve.widgets.HTMLStringUtil.getId = function(){
	
	return  (davinci.ve.widgets.HTMLStringUtil.idPrefix + (davinci.ve.widgets.HTMLStringUtil.__id++));
	
}

davinci.ve.widgets.HTMLStringUtil.injectId = function(htmlText,id){
	/* attempts to inject an ID in the top HTML element */
	
	var firstEndTag = htmlText.indexOf(">");
	
	if(!firstEndTag)
		return "<span id='" + id + "'>" + htmlText + "</span";
	
	return htmlText.substring(0,firstEndTag) + " id='" + id + "'" + htmlText.substring(firstEndTag, htmlText.length);
	
}

davinci.ve.widgets.HTMLStringUtil.getEditor = function(jsonString){
	
	
	var metaType = jsonString.type; 
	var id = davinci.ve.widgets.HTMLStringUtil.getId();
	var extraAttribs = "";
	
	jsonString['id'] = id;
	
	
	/*
	 * 
	 * when writing dijit markup BE SURE TO INCLUDE class='propertyPaneEditableValue' to signify a onChange target and property target
	 * as well as the 'extraAttributes' string, which will contain the inputs target as parsed from JSON template.
	 */
	
	switch (metaType){
		case "trblbox":
			var text="<div dojoType='davinci.ve.widgets.Trblbox' shorthand='\"" + jsonString['shorthand'] + "\"'></div>";
			
			return text;
		case "multi":
			var valuesText = "";
			if(jsonString.values){
				valuesText = "data='"
					+ dojo.toJson(dojo.map(jsonString.values, function(v){ return {value: v}; })) 
					+ "'";
			}
			var text = "<div dojoType='davinci.ve.widgets.MultiInputDropDown' " + valuesText + "  class='propertyPaneEditablevalue' style='display:inline-block; width:100%;' id='"+ id + "'></div>";
			
	        return text;
		case "boolean":
			var text = "<input type='checkbox' class='propertyPaneEditablevalue' style='display:inline-block;margin-left:5px' id='"+ id + "'></input>";
	        return text;
		case "combo":
			var values = jsonString['values'];
			var text = "<select style='display:inline-block; width:100%;' id='"+ id + "' >";
			for(var i = 0;i<values.length;i++)
				text+="<option value='" + values[i] + "'>" + values[i] + "</option>"
			text+="</select>";
			return text;
		case "font":
			var text = "<div dojoType='davinci.ve.widgets.FontDataStore' jsId='"+ id + ('_fontStore') + "'>";
				text+= "<div dojoType='dijit.form.ComboBox' value='" + davinci.ve.widgets.FontDataStore.fonts[0].value + "' store='"+ id + ('_fontStore') + "'  id='"+ id +"' class='propertyPaneEditablevalue' style='display:inline-block; width:100%;'></div>";
			return text;
		case "state":
			var text="<div dojoType='davinci.ve.widgets.MetaDataStore' jsId='davinci.properties.event"+ (id) + ('_Store') + "'>";
			text+="<div dojoType='dijit.form.ComboBox' id='"+ id +"'store='davinci.properties.event"+ (id) + ('_Store') + "' class='propertyPaneEditablevalue' style='display:inline-block; width:100%;'></div>";
			return text;
		case "color":
			var text = "<div class='propertyPaneEditablevalue' dojoType='davinci.ve.widgets.ColorPicker' id='"+ id + "' ></div>";
			return text;
			/*todo - write color chooser widget */
			
		case "file":
			var text="<div dojoType='davinci.ui.widgets.FileFieldDialog' id='" + id + "'></div>";
			return text;
		case "border":
			/* todo - write border widget */
		case "number":
		case "object":
		case "text":
		case "array":
		case "string":
		default:
			var text = "<input type='text' class='propertyPaneEditablevalue' style='display:inline-block; width:100%;' id='"+ id + "'></input>";
			return text;
	}
}

davinci.ve.widgets.HTMLStringUtil.loadTemplate = function(templatePath, nameSpaceBase){
	var url = templatePath;
	if(nameSpaceBase){
		url = (nameSpaceBase.split('.')).join("/") + "/" + templatePath;
		
	}
	var text = davinci.Runtime.serverJSONRequest({url:url, handleAs:"text", sync:true  });
	return text;
}


davinci.ve.widgets.HTMLStringUtil.generateMainSection = function(jsonTemplate){
	jsonTemplate.id =  davinci.ve.widgets.HTMLStringUtil.getId();
	var title = jsonTemplate.title;
	
	var htmlText = "";
	 htmlText+="<div class='property_toc_item hideInThemeEditor' id='" + jsonTemplate.id + "'>";
	 htmlText+="<table cellspacing='0' cellpadding='0' border='0' class='property_toc_item_table'>";
	 htmlText+="<colgroup><col style='width: auto;'/><col style='width: 1px;'/></colgroup>";
	 htmlText+="<tr><td class='property_toc_item_label'>" + title  + "</td><td class='property_toc_item_arrow'></td></tr>";
	 htmlText+="</table>";
     htmlText+="</div>";
     return htmlText;
	
}


davinci.ve.widgets.HTMLStringUtil.generateTable = function(page,rowsOnly){
	var htmlText = "";
	if(page.html){
		page.id=davinci.ve.widgets.HTMLStringUtil.getId();
		return davinci.ve.widgets.HTMLStringUtil.injectId(page.html,page.id);
	}
	
	var tableHtml = "<table class='property_table_stretchable' border='0' width='100%' align='center' cellspacing='0' cellpadding='0'>";
	tableHtml += "<colgroup>"; 
	tableHtml += "<col style='width:15px;' />"
	tableHtml +="<col class='gap02' />";
	tableHtml +="<col class='gap03' />";
	tableHtml +="<col style='width:24px;' />";
	tableHtml += "<col style='width:8px;' />"
	tableHtml +="</colgroup>";
//	tableHtml +="<tr class='property_table_rowgap property_table_rowgap_group_separator'><td colspan='7'/></tr>";
	if(!rowsOnly)
		htmlText+=tableHtml;
	
	for(var i=0;i<page.length;i++){
			
			if(page[i].widgetHtml){
				
				page[i].id=davinci.ve.widgets.HTMLStringUtil.getId();
				page[i]['rowId'] = davinci.ve.widgets.HTMLStringUtil.getId();
				htmlText+= "<tr id='" + page[i]['rowId'] +"'";
				
				if( page[i]['rowClass']){
					htmlText+=" class='" + page[i]['rowClass'] + "'";
				}
				htmlText+=">";
				htmlText+= "<td colspan='5' width='100%'>";
				htmlText+= davinci.ve.widgets.HTMLStringUtil.injectId(page[i].widgetHtml,page[i].id);
				htmlText+="</td>";
				htmlText+= "</tr>";
			}else if(page[i].html){
			
				page[i].id=davinci.ve.widgets.HTMLStringUtil.getId();
				page[i]['rowId'] = davinci.ve.widgets.HTMLStringUtil.getId();
				htmlText+= "<tr id='" + page[i]['rowId'] +"'";
				htmlText+= " class='cssPropertySection";
				
				if( page[i]['rowClass']){
					htmlText+=" " + page[i]['rowClass'];
				}
				htmlText+="'>";
				htmlText+= "<td colspan='5' width='100%'>";
				htmlText+= page[i].html;
				htmlText+="</td>";
				htmlText+= "</tr>";
			}else if(page[i].type=="toggleSection"){
			
				htmlText+= "<tr id='" + page[i].id + "'  class='cssPropertySection'><td colspan='5'>";
			
				var onclick = "";
				var moreTable = davinci.ve.widgets.HTMLStringUtil.generateTable(page[i].pageTemplate, true);
				for(var j=0;j<page[i].pageTemplate.length;j++){
					if(page[i].pageTemplate[j]['rowId']){
						onclick+= "dojo.toggleClass('" + page[i].pageTemplate[j]['rowId'] + "','propertiesSectionHidden');";
					}
					if(page[i].pageTemplate[j]['cascadeSectionRowId']){
						onclick+= "if(this.checked){dojo.removeClass('" + page[i].pageTemplate[j]['cascadeSectionRowId'] + "','propertiesSectionHidden');}else{{dojo.addClass('" + page[i].pageTemplate[j]['cascadeSectionRowId'] + "','propertiesSectionHidden');}}";
					}
				}
				
				
				htmlText+="<input type='checkbox' onclick=\"" + onclick + "\"></input>";
				htmlText+= page[i].display;
				htmlText+="</td></tr>";			
			
				
				
				
				htmlText+=moreTable;
			
			
			}else if(page[i].display){
				page[i]['toggleCascade'] = davinci.ve.widgets.HTMLStringUtil.getId();
			//	page[i]['showHelp'] = davinci.ve.widgets.HTMLStringUtil.getId();
				page[i]['cascadeSection'] = davinci.ve.widgets.HTMLStringUtil.getId();
				page[i]['rowId'] = davinci.ve.widgets.HTMLStringUtil.getId();
				page[i]['cascadeSectionRowId'] = davinci.ve.widgets.HTMLStringUtil.getId();
				
				htmlText+= "<tr id='" + page[i]['rowId'] +"'";
				htmlText+=" class='cssPropertySection";
				if( page[i]['rowClass']){
					htmlText+=" " + page[i]['rowClass'];
				}
				htmlText+="'";
				htmlText+=" propName='"+page[i].display+"'";
				htmlText+=">";
				htmlText+="<td/>";
				htmlText+="<td class='propertyDisplayName'>" + page[i].display + ":&nbsp;</td>";
				
				htmlText+="<td class='propertyInputField'>" + davinci.ve.widgets.HTMLStringUtil.getEditor(page[i]) + "</td>";
				htmlText+="<td class='propertyExtra' nowrap='true'>";
				if(page[i].target && !page[i].hideCascade){
	
					htmlText+= "<div width='100%'><button class='showCss propertyButton' id='" + page[i]['toggleCascade'] + "'";
					htmlText+= " onClick=\"davinci.ve.widgets.HTMLStringUtil.showProperty(";
					htmlText+= "'"+page[i]['rowId']+"'";
					htmlText+= ")\">&gt;</button>";
					htmlText+="</div>";
				}
				htmlText+="<td/>";
				htmlText+= "</tr>";
				if(page[i].target && !page[i].hideCascade){
					var toggleClasses = "{'cascadeSectionRowId':\"" + page[i]['cascadeSectionRowId'] + "\",'toggleCascade':\"" + page[i]['toggleCascade'] +'\"}';
					htmlText+= "<tr id='" + page[i]['cascadeSectionRowId'] +"' class='cssCascadeSection cascadeRowHidden'>";
					htmlText+="<td colspan='5' width='100%' class='showCascadeDiv'><div dojoType='davinci.ve.widgets.Cascade' toggleClasses=" + toggleClasses + " target='" + dojo.toJson(page[i]['target'])+"' targetField='\"" + page[i]['id']+"\"' id='" + page[i]['cascadeSection'] + "'></div></td></tr>";
				}
			}else{
				htmlText+="</table>";
				htmlText+=davinci.ve.widgets.HTMLStringUtil.getEditor(page[i]);
				htmlText+=tableHtml;
			}
	}
	if(!rowsOnly)
		htmlText+="</table>";
	return htmlText;
	
}
davinci.ve.widgets.HTMLStringUtil.generateTemplate = function(jsonString){
	
	var htmlText = "";
	
	if(jsonString['pageTemplate']){
		if( jsonString['title']){
			jsonString['id'] = davinci.ve.widgets.HTMLStringUtil.getId();
			htmlText = "<div class='propGroup' id='" + jsonString['id'] +"' propGroup='"+jsonString['title']+"'>";
		}	
			
		htmlText+=davinci.ve.widgets.HTMLStringUtil.generateTable(jsonString['pageTemplate']);
		htmlText+="</div>";
	}else if(jsonString['html']){
		htmlText+=jsonString['html'];
	}else if(jsonString['widgetHtml']){
	
		jsonString['id'] = davinci.ve.widgets.HTMLStringUtil.getId();
		htmlText+= davinci.ve.widgets.HTMLStringUtil.injectId(jsonString['widgetHtml'],jsonString['id']);
	}
	return htmlText;
}

//propvieweffects.css should NOT be built!
davinci.ve.widgets.HTMLStringUtil.stylesheetHref = "propvieweffects.css";
davinci.ve.widgets.HTMLStringUtil.animShowSectionClass = "propRootDetailsContainer";
davinci.ve.widgets.HTMLStringUtil.animShowSectionClassSelector = "."+davinci.ve.widgets.HTMLStringUtil.animShowSectionClass;
davinci.ve.widgets.HTMLStringUtil.animShowDetailsClass = "property_table_stretchable";
davinci.ve.widgets.HTMLStringUtil.animShowDetailsClassSelector = "."+davinci.ve.widgets.HTMLStringUtil.animShowDetailsClass;
davinci.ve.widgets.HTMLStringUtil.showPropAnimClasses = 
	["propRowFadeIn","propRowFadeOut","propRowTransparent","propRowOpaque","propRowHidden"];

davinci.ve.widgets.HTMLStringUtil.showRoot = function(){
	var Util = davinci.ve.widgets.HTMLStringUtil;
	Util._hideSectionShowRoot();
	Util._currentPropSection = null;
	return false;
}

davinci.ve.widgets.HTMLStringUtil.showSection = function(sectionName){
	var Util = davinci.ve.widgets.HTMLStringUtil;
	Util._crumbLevel1(sectionName);
	Util._initSection(sectionName);
	Util._hideRootShowSection();
	var detailsTD = Util._getDetailsTD();
	dojo.addClass(detailsTD,"propSectionShowing");
	return false;
}

davinci.ve.widgets.HTMLStringUtil.transitionRootToSection = function(sectionName, onEndCallback){

	function transEnd(event){
		dojo.disconnect(webkitConnection);
		dojo.disconnect(connection);
		Util._hideRootShowSection();			
		var ruleIndex = Util._findRule(Util.animShowSectionClassSelector);
		ss.deleteRule(ruleIndex);
		ss.insertRule(Util.animShowSectionClassSelector + " { margin-left:0px; }",ruleIndex);
		dojo.removeClass(rootTD, "propDetailsTransparent");
		rootDetailsContainer.style.width = "";
		rootTD.style.width = "";
		detailsTD.style.width = "";
		if(onEndCallback){
			onEndCallback();
		}
	}
	
	var Runtime = davinci.Runtime;
	var Util = davinci.ve.widgets.HTMLStringUtil;
	var ss = Util._findAnimSS();
	var rootDetailsContainer = Util._getRootDetailsContainer();
	var rootTD = Util._getRootTD();
	var detailsTD = Util._getDetailsTD();

	Util._crumbLevel1(sectionName);
	Util._initSection(sectionName);

	if(Runtime.supportsCSS3Transitions){
		// Get current width of rootTD, then force that width onto both rootTD and detailsTD
		// so that when both table cells are visible they will be as wide as
		// rootTD was before the transition starts
		var rootTDMetrics = dojo.contentBox(rootTD);
		var w = (rootTDMetrics.w)+"px";
		rootDetailsContainer.style.width = "200%";
		rootTD.style.width = w;
		detailsTD.style.width = w;
		
		// Make detailsTD visible so we can compute metrics
		dojo.removeClass(detailsTD, "dijitHidden");
		dojo.addClass(rootTD, "propDetailsTransparent");
		
		// Compute top coordinate diff between firstPropertyRowTR and thisPropertyRowTR
		var firstMetrics = dojo.marginBox(rootTD);
		var thisMetrics = dojo.marginBox(detailsTD);
		var leftDiff = thisMetrics.l - firstMetrics.l;
		var ruleIndex = Util._findRule(Util.animShowSectionClassSelector);		
		var webkitConnection = dojo.connect(rootDetailsContainer,'webkitTransitionEnd', transEnd);
		var connection = dojo.connect(rootDetailsContainer,'transitionend', transEnd);
		ss.deleteRule(ruleIndex);
		// opacity:.99 to force animation to occur even if topDiff is zero.
		ss.insertRule(Util.animShowSectionClassSelector + " { margin-left:-"+leftDiff+"px; opacity:.99; -webkit-transition: all .6s ease; -moz-transition: all .6s ease; }",ruleIndex);
			
	// Else if browser does not support transitions (e.g., FF3.x)
	}else{
		Util._hideRootShowSection();
		if(onEndCallback){
			onEndCallback();
		}
	}	

	return false;
}

davinci.ve.widgets.HTMLStringUtil.showProperty = function(propertyRowId){
	
	var hideAllButThisRow = function (){
		for(var i=0; i<rowParent.children.length; i++){
			var node=rowParent.children[i];
			if(node.nodeType==1 && dojo.hasClass(node,"cssPropertySection")){	// 1=Element. IE7 bug - children[] includes comments
				if(node==thisPropertyRowTR){
					davinci.ve.widgets.HTMLStringUtil._addRemoveClasses(node, allTRAnimClasses, []);
				}else{
					davinci.ve.widgets.HTMLStringUtil._addRemoveClasses(node, allTRAnimClasses, ["propRowHidden"]);
				}
			}
		}
	}

	var fadeInCascade = function(){
		if(thisCascadeRowTR){
			dojo.removeClass(thisCascadeRowTR,"cascadeRowHidden");
			dojo.addClass(thisCascadeRowTR,"cascadeRowTransparent");	// To set transition starting point at opacity:0
			setTimeout(function(){
				dojo.removeClass(thisCascadeRowTR,"cascadeRowTransparent");
				dojo.addClass(thisCascadeRowTR,"cascadeRowFadeIn");
			},1);
		}
	};

	function transEnd(event){
		dojo.disconnect(webkitConnection);
		dojo.disconnect(connection);
		hideAllButThisRow();			
		var ruleIndex = davinci.ve.widgets.HTMLStringUtil._findRule(Util.animShowDetailsClassSelector);
		ss.deleteRule(ruleIndex);
		ss.insertRule(Util.animShowDetailsClassSelector + " { margin-top:0px; }",ruleIndex);
		fadeInCascade();
	}
	
	var Runtime = davinci.Runtime;
	var Util = davinci.ve.widgets.HTMLStringUtil;
	var ss = Util._findAnimSS();
	var allTRAnimClasses = davinci.ve.widgets.HTMLStringUtil.showPropAnimClasses;
	
	// Find various elements
	//   thisPropertyRowTR: TR corresponding to eventElem (element that received user click)
	//   rowParent: parent element of thisPropertyRowTR (either TBODY or TABLE)
	//   firstPropertyRowTR: 1st child of rowParent that is a TR with class "cssPropertySection". Holds prop's input entry widgets.
	//   thisCascadeRowTR: TR element just after firstPropertyRowTR, with class "cssCascadeSection". Holds prop's cascade info.
	//   propertySectionTABLE: TABLE element that is ancestor of thisPropertyRowTR.
	var thisPropertyRowTR = dojo.byId(propertyRowId);
	var rowParent = thisPropertyRowTR.parentNode;
	var firstPropertyRowTR = Util._searchSiblingsByTagClass(rowParent.children[0], "TR", "cssPropertySection");
	var thisCascadeRowTR = Util._searchSiblingsByTagClass(thisPropertyRowTR.nextSibling, "TR", "cssCascadeSection");
	var propertySectionTABLE = Util._searchUpByTagClass(rowParent, "TABLE", Util.animShowDetailsClass);
	var propertyGroupDIV = Util._searchUpByTagClass(thisPropertyRowTR, "DIV", "propGroup");
	var propGroupName = dojo.attr(propertyGroupDIV, "propGroup");
	var propName = dojo.attr(thisPropertyRowTR, "propName");
	Util._crumbLevel2(propGroupName, propName);
	var detailsTD = Util._getDetailsTD();
	dojo.removeClass(detailsTD,"propSectionShowing");
	dojo.addClass(detailsTD,"propDetailsShowing");

	if(Runtime.supportsCSS3Transitions){
		
		// Compute top coordinate diff between firstPropertyRowTR and thisPropertyRowTR
		var firstMetrics = dojo.marginBox(firstPropertyRowTR);
		var thisMetrics = dojo.marginBox(thisPropertyRowTR);
		var topDiff = thisMetrics.t - firstMetrics.t;
		var ruleIndex = Util._findRule(Util.animShowDetailsClassSelector);
		
		var webkitConnection = dojo.connect(propertySectionTABLE,'webkitTransitionEnd', transEnd);
		var connection = dojo.connect(propertySectionTABLE,'transitionend', transEnd);
		ss.deleteRule(ruleIndex);
		// opacity:.99 to force animation to occur even if topDiff is zero.
		ss.insertRule(Util.animShowDetailsClassSelector + " { margin-top:-"+topDiff+"px; opacity:.99; -webkit-transition: all .6s ease; -moz-transition: all .6s ease; }",ruleIndex);
		
		// assign classes to cause fade-in/fade-out effects
		var foundThisPropertyRowTR = false;
		for(var i=0; i<rowParent.children.length; i++){
			var node=rowParent.children[i];
			if(node.nodeType==1 && dojo.hasClass(node,"cssPropertySection")){	// 1=Element. IE7 bug - children[] includes comments
				if(node==thisPropertyRowTR){
					Util._addRemoveClasses(node, allTRAnimClasses, ["propRowFadeIn"]);
					foundThisPropertyRowTR = true;
				}else if(!foundThisPropertyRowTR){
					Util._addRemoveClasses(node, allTRAnimClasses, ["propRowTransparent"]);
				}else{
					Util._addRemoveClasses(node, allTRAnimClasses, ["propRowHidden"]);
				}
			}
		}
	
	// Else if browser does not support transitions (e.g., FF3.x)
	}else{
		hideAllButThisRow();
		fadeInCascade();
	}	
}

davinci.ve.widgets.HTMLStringUtil._crumbLevel1 = function(sectionName){
	var Util = davinci.ve.widgets.HTMLStringUtil;
	var crumbsDIV = Util._getCrumbsDIV();
	var s = '';
	s += '<span class="breadcrumbText breadcrumbTextBackLink" onclick="return davinci.ve.widgets.HTMLStringUtil.showRoot()">All</span>';
	s += '<span class="breadcrumbDescend">&gt;</span>';
	s += '<span class="breadcrumbText breadcrumbTextCurrent">';
	s += sectionName;
	s += '</span>';
	crumbsDIV.innerHTML = s;
}
	
davinci.ve.widgets.HTMLStringUtil._crumbLevel2 = function(sectionName, propname){
	var Util = davinci.ve.widgets.HTMLStringUtil;
	var crumbsDIV = Util._getCrumbsDIV();
	var s = '';
	s += '<span class="breadcrumbText breadcrumbTextBackLink" onclick="return davinci.ve.widgets.HTMLStringUtil.showRoot()">All</span>';
	s += '<span class="breadcrumbDescend">&gt;</span>';
	s += '<span class="breadcrumbText breadcrumbTextBackLink" onclick="return davinci.ve.widgets.HTMLStringUtil.showSection(\''+sectionName+'\')">';
	s += sectionName+'</span>';
	s += '<span class="breadcrumbDescend">&gt;</span>';
	s += '<span class="breadcrumbText breadcrumbTextCurrent">';
	s += '\''+propname+'\'';
	s += '</span>';
	crumbsDIV.innerHTML = s;
}	

davinci.ve.widgets.HTMLStringUtil._initSection = function(propGroupName){
	var Runtime = davinci.Runtime;
	var Util = davinci.ve.widgets.HTMLStringUtil;
	var allTRAnimClasses = Util.showPropAnimClasses;
	var detailsTD = Util._getDetailsTD();
	var propGroups = dojo.query(".propGroup",detailsTD);
	var propGroupDIV;
	for(var i=0; i<propGroups.length; i++){
		var propGroup = propGroups[i];
		var name = dojo.attr(propGroup, "propGroup");
		if(name==propGroupName){
			dojo.removeClass(propGroup,"dijitHidden");
			propGroupDIV = propGroup;
		}else{
			dojo.addClass(propGroup,"dijitHidden");
		}
	}
	var pSects = dojo.query(".cssPropertySection",propGroupDIV);
	for(var i=0; i<pSects.length; i++){
		Util._addRemoveClasses(pSects[i],allTRAnimClasses,[]);
	}
	var cSects = dojo.query(".cssCascadeSection",propGroupDIV);
	for(var i=0; i<cSects.length; i++){
		dojo.addClass(cSects[i],"cascadeRowHidden");
	}
	dojo.removeClass(detailsTD,"propDetailsShowing");
	Util._currentPropSection = propGroupName;
}

davinci.ve.widgets.HTMLStringUtil._hideSectionShowRoot = function(){
	var Util = davinci.ve.widgets.HTMLStringUtil;
	var rootTD = Util._getRootTD();
	var detailsTD = Util._getDetailsTD();
	dojo.removeClass(rootTD,"dijitHidden");
	dojo.addClass(detailsTD,"dijitHidden");
}

davinci.ve.widgets.HTMLStringUtil._hideRootShowSection = function(){
	var Util = davinci.ve.widgets.HTMLStringUtil;
	var rootTD = Util._getRootTD();
	var detailsTD = Util._getDetailsTD();
	dojo.addClass(rootTD,"dijitHidden");
	dojo.removeClass(detailsTD,"dijitHidden");
}

// Sets davinci.ve.widgets.HTMLStringUtil.animSS to stylesheet object
// that holds all of the properties palette animation style rules
davinci.ve.widgets.HTMLStringUtil._findAnimSS = function(){
	var ss = davinci.ve.widgets.HTMLStringUtil.animSS;
	if(ss){
		return ss;
	}
	for(var i=0; i<document.styleSheets.length; i++){
		var ss=document.styleSheets[i];
		if(ss.href && ss.href.indexOf(davinci.ve.widgets.HTMLStringUtil.stylesheetHref)>=0){
			davinci.ve.widgets.HTMLStringUtil.animSS = ss;
			return ss;
		}
	}
	return null;
}

// Search animSS (property palette's animation stylesheet) to find the style rule
// with given the selectorText. Returns index for the rule.
davinci.ve.widgets.HTMLStringUtil._findRule = function(selectorText){
	//FIXME: when integrated, maybe this.animSS?
	var ss = davinci.ve.widgets.HTMLStringUtil._findAnimSS();
	for(var ruleIndex=0; ruleIndex<ss.cssRules.length; ruleIndex++){
		var rule=ss.cssRules[ruleIndex];
		if(rule.selectorText == selectorText){
			return ruleIndex;
		}
	}
	return null;
}

// Adds all classes in the classesToAdd array and removes any
// classes from allClasses that aren't in classesToAdd
davinci.ve.widgets.HTMLStringUtil._addRemoveClasses = function(elem, allClasses, classesToAdd){
	var classesToRemove=[];
	for(var i=0; i<allClasses.length; i++){
		var found=false;
		for(var j=0; j<classesToAdd.length; j++){
			if(allClasses[i]==classesToAdd[j]){
				found=true;
				break;
			}
		}
		if(!found){
			classesToRemove.push(allClasses[i]);
		}
	}
	for(var i=0; i<classesToRemove.length; i++){
		dojo.removeClass(elem,classesToRemove[i]);
	}
	for(var i=0; i<classesToAdd.length; i++){
		dojo.addClass(elem,classesToAdd[i]);
	}
}

// Look at refElem and ancestors for a particular tag and optionally a particular class
davinci.ve.widgets.HTMLStringUtil._searchUpByTagClass = function(refElem, tagName, className){
	while(refElem != null && refElem.nodeName != "BODY"){
		if(refElem.nodeName == tagName && (!className || dojo.hasClass(refElem, className))){
			return refElem;
		}
		refElem = refElem.parentNode;
	}
	return null;
}

// Look at refElem and nextSiblings for a particular tag and optionally a particular class
davinci.ve.widgets.HTMLStringUtil._searchSiblingsByTagClass = function(refElem, tagName, className){
	while(refElem != null){
		if(refElem.nodeName == tagName && (!className || dojo.hasClass(refElem, className))){
			return refElem;
		}
		refElem = refElem.nextSibling;
	}
	return null;
}

davinci.ve.widgets.HTMLStringUtil._getRootDetailsContainer = function(){
	var Util = davinci.ve.widgets.HTMLStringUtil;
	if(!Util._rootDetailsContainer){
		Util._rootDetailsContainer=dojo.query(Util.animShowSectionClassSelector)[0];
	}
	return Util._rootDetailsContainer;
}

davinci.ve.widgets.HTMLStringUtil._getRootTD = function(){
	var Util = davinci.ve.widgets.HTMLStringUtil;
	var rootDetailsContainer = Util._getRootDetailsContainer();
	if(!Util._rootTD){
		//FIXME: Make .propPaletteRoot into a var
		Util._rootTD=dojo.query(".propPaletteRoot", rootDetailsContainer)[0];
	}
	return Util._rootTD;
}


davinci.ve.widgets.HTMLStringUtil._getDetailsTD = function(){
	var Util = davinci.ve.widgets.HTMLStringUtil;
	var rootDetailsContainer = Util._getRootDetailsContainer();
	if(!Util._detailsTD){
		//FIXME: Make .propPaletteDetails into a var
		Util._detailsTD=dojo.query(".propPaletteDetails", rootDetailsContainer)[0];
	}
	return Util._detailsTD;
}

davinci.ve.widgets.HTMLStringUtil._getCrumbsDIV = function(){
	var Util = davinci.ve.widgets.HTMLStringUtil;
	var detailsTD = Util._getDetailsTD();
	if(!Util._crumbsDIV){
		//FIXME: Make .cssBreadcrumbSection into a var
		Util._crumbsDIV=dojo.query(".cssBreadcrumbSection", detailsTD)[0];
	}
	return Util._crumbsDIV;
}

