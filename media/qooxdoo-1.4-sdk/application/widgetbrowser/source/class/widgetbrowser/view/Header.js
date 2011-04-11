/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Jonathan Weiß (jonathan_rass)
     * Tristan Koch (tristankoch)

************************************************************************ */

/**
 * The Application's header
 */

qx.Class.define("widgetbrowser.view.Header",
{
  extend : qx.ui.container.Composite,

  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  construct : function()
  {
    this.base(arguments);

    this.setLayout(new qx.ui.layout.HBox);
    this.setAppearance("app-header");

    var title = new qx.ui.basic.Label("Widget Browser");
    var version = new qx.ui.basic.Label("qooxdoo " + qx.core.Environment.get("qx.version"));
    version.setFont("default");
    version.setAppearance("app-header-label");

    // Build select-box
    var select = new qx.ui.form.SelectBox("Theme");
    ["Modern", "Simple", "Classic"].forEach(function(name) {
      var item = new qx.ui.form.ListItem(name + " Theme");
      item.setUserData("value", "qx.theme." + name);
      select.add(item);
    });
    select.setFont("default");

    // Find current theme from URL search param
    var currentThemeItem = select.getSelectables().filter(function(item) {
      if (window.location.search) {
        return window.location.search.match(item.getUserData("value"));
      }
    })[0];

    // Set current theme
    if (currentThemeItem) {
      select.setSelection([currentThemeItem]);
    }

    select.setTextColor("black");

    select.addListener("changeSelection", function(evt) {
      var selected = evt.getData()[0];
      var url = "index.html?qx.theme=" + selected.getUserData("value");
      window.location = url;
    });

    // Finally assemble header
    this.add(title);
    this.add(new qx.ui.core.Spacer, {flex : 1});
    this.add(select);
    this.add(new qx.ui.core.Spacer, {width: "2%"});
    this.add(version);

  }
});