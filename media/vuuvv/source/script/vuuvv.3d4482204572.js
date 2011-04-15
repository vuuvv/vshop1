/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
/**
 * Mixin for the box shadow CSS property.
 * This mixin is usually used by {@link qx.ui.decoration.DynamicDecorator}.
 *
 * Keep in mind that this is not supported by all browsers:
 *
 * * Firefox 3,5+
 * * IE9+
 * * Safari 3.0+
 * * Opera 10.5+
 * * Chrome 4.0+
 */
qx.Mixin.define("qx.ui.decoration.MBoxShadow",
{
  properties : {
    /** Horizontal length of the shadow. */
    shadowHorizontalLength :
    {
      nullable : true,
      check : "Integer",
      apply : "_applyBoxShadow"
    },

    /** Vertical length of the shadow. */
    shadowVerticalLength :
    {
      nullable : true,
      check : "Integer",
      apply : "_applyBoxShadow"
    },

    /** The blur radius of the shadow. */
    shadowBlurRadius :
    {
      nullable : true,
      check : "Integer",
      apply : "_applyBoxShadow"
    },

    /** The color of the shadow. */
    shadowColor :
    {
      nullable : true,
      check : "Color",
      apply : "_applyBoxShadow"
    },


    /** Property group to set the shadow length. */
    shadowLength :
    {
      group : ["shadowHorizontalLength", "shadowVerticalLength"],
      mode : "shorthand"
    }
  },


  members :
  {
    /**
     * Takes a styles map and adds the box shadow styles in place to the
     * given map. This is the needed behavior for
     * {@link qx.ui.decoration.DynamicDecorator}.
     *
     * @param styles {Map} A map to add the styles.
     */
    _styleBoxShadow : function(styles) {
      var Color = qx.theme.manager.Color.getInstance();
      var color = Color.resolve(this.getShadowColor());

      if (color != null) {
        var vLength = this.getShadowVerticalLength() || 0;
        var hLength = this.getShadowHorizontalLength() || 0;
        var blur = this.getShadowBlurRadius() || 0;
        var value = hLength + "px " + vLength + "px " + blur + "px " + color;

        styles["-moz-box-shadow"] = value;
        styles["-webkit-box-shadow"] = value;
        styles["box-shadow"] = value;
      }
    },


    // property apply
    _applyBoxShadow : function()
    {
      if (qx.core.Environment.get("qx.debug"))
      {
        if (this._isInitialized()) {
          throw new Error("This decorator is already in-use. Modification is not possible anymore!");
        }
      }
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
/**
 * Mixin responsible for setting the background color of a widget.
 * This mixin is usually used by {@link qx.ui.decoration.DynamicDecorator}.
 */
qx.Mixin.define("qx.ui.decoration.MBackgroundColor",
{
  properties :
  {
    /** Color of the background */
    backgroundColor :
    {
      check : "Color",
      nullable : true,
      apply : "_applyBackgroundColor"
    }
  },


  members :
  {
    /**
     * Tint function for the background color. This is suitable for the
     * {@link qx.ui.decoration.DynamicDecorator}.
     *
     * @param element {Element} The element which could be resized.
     * @param bgcolor {Color} The new background color.
     * @param styles {Map} A map of styles to apply.
     */
    _tintBackgroundColor : function(element, bgcolor, styles) {
      var Color = qx.theme.manager.Color.getInstance();

      if (bgcolor == null) {
        bgcolor = this.getBackgroundColor();
      }

      styles.backgroundColor = Color.resolve(bgcolor) || "";
    },


    /**
     * Resize function for the background color. This is suitable for the
     * {@link qx.ui.decoration.DynamicDecorator}.
     *
     * @param element {Element} The element which could be resized.
     * @param width {Number} The new width.
     * @param height {Number} The new height.
     * @return {Map} A map containing the desired position and dimension
     *   (width, height, top, left).
     */
    _resizeBackgroundColor : function(element, width, height) {
      var insets = this.getInsets();
      width -= insets.left + insets.right;
      height -= insets.top + insets.bottom;
      return {
        left : insets.left,
        top : insets.top,
        width : width,
        height : height
      };
    },


    // property apply
    _applyBackgroundColor : function()
    {
      if (qx.core.Environment.get("qx.debug"))
      {
        if (this._isInitialized()) {
          throw new Error("This decorator is already in-use. Modification is not possible anymore!");
        }
      }
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2009 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
/**
 * Mixin for supporting the background images on decorators.
 * This mixin is usually used by {@link qx.ui.decoration.DynamicDecorator}.
 */
qx.Mixin.define("qx.ui.decoration.MBackgroundImage",
{
  properties :
  {
    /** The URL of the background image */
    backgroundImage :
    {
      check : "String",
      nullable : true,
      apply : "_applyBackgroundImage"
    },


    /** How the background image should be repeated */
    backgroundRepeat :
    {
      check : ["repeat", "repeat-x", "repeat-y", "no-repeat", "scale"],
      init : "repeat",
      apply : "_applyBackgroundImage"
    },


    /**
     * Either a string or a number, which defines the horizontal position
     * of the background image.
     *
     * If the value is an integer it is interpreted as a pixel value, otherwise
     * the value is taken to be a CSS value. For CSS, the values are "center",
     * "left" and "right".
     */
    backgroundPositionX :
    {
      nullable : true,
      apply : "_applyBackgroundImage"
    },


    /**
     * Either a string or a number, which defines the vertical position
     * of the background image.
     *
     * If the value is an integer it is interpreted as a pixel value, otherwise
     * the value is taken to be a CSS value. For CSS, the values are "top",
     * "middle" and "bottom".
     */
    backgroundPositionY :
    {
      nullable : true,
      apply : "_applyBackgroundImage"
    },


    /**
     * Property group to define the background position
     */
    backgroundPosition :
    {
      group : ["backgroundPositionY", "backgroundPositionX"]
    }
  },


  members :
  {
    /**
     * Mapping for the dynamic decorator.
     */
    _generateMarkup : this._generateBackgroundMarkup,


    /**
     * Responsible for generating the markup for the background.
     * This method just uses the settings in the properties to generate
     * the markup.
     *
     * @param styles {Map} CSS styles as map
     * @param content {String?null} The content of the created div as HTML
     * @return {String} The generated HTML fragment
     */
    _generateBackgroundMarkup: function(styles, content)
    {
      var markup = "";

      var image = this.getBackgroundImage();
      var repeat = this.getBackgroundRepeat();

      var top = this.getBackgroundPositionY();
      if (top == null) {
        top = 0;
      }

      var left = this.getBackgroundPositionX();
      if (left == null) {
        left = 0;
      }

      styles.backgroundPosition = left + " " + top;

      // Support for images
      if (image)
      {
        var resolved = qx.util.AliasManager.getInstance().resolve(image);
        markup = qx.bom.element.Decoration.create(resolved, repeat, styles);
      }
      else
      {
        if ((qx.core.Environment.get("engine.name") == "mshtml"))
        {
          /*
           * Internet Explorer as of version 6 for quirks and standards mode,
           * or version 7 in quirks mode adds an empty string to the "div"
           * node. This behavior causes rendering problems, because the node
           * would then have a minimum size determined by the font size.
           * To be able to set the "div" node height to a certain (small)
           * value independent of the minimum font size, an "overflow:hidden"
           * style is added.
           * */
          if (parseFloat(qx.core.Environment.get("engine.version")) < 7 ||
            qx.core.Environment.get("browser.quirksmode"))
          {
            // Add additionally style
            styles.overflow = "hidden";
          }
        }

        if (!content) {
          content = "";
        }

        markup = '<div style="' + qx.bom.element.Style.compile(styles) + '">' + content + '</div>';
      }

      return markup;
    },


    // property apply
    _applyBackgroundImage : function()
    {
      if (qx.core.Environment.get("qx.debug"))
      {
        if (this._isInitialized()) {
          throw new Error("This decorator is already in-use. Modification is not possible anymore!");
        }
      }
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
/**
 * A basic decorator featuring simple borders based on CSS styles.
 * This mixin is usually used by {@link qx.ui.decoration.DynamicDecorator}.
 */
qx.Mixin.define("qx.ui.decoration.MSingleBorder",
{
  properties :
  {
    /*
    ---------------------------------------------------------------------------
      PROPERTY: WIDTH
    ---------------------------------------------------------------------------
    */

    /** top width of border */
    widthTop :
    {
      check : "Number",
      init : 0,
      apply : "_applyWidth"
    },

    /** right width of border */
    widthRight :
    {
      check : "Number",
      init : 0,
      apply : "_applyWidth"
    },

    /** bottom width of border */
    widthBottom :
    {
      check : "Number",
      init : 0,
      apply : "_applyWidth"
    },

    /** left width of border */
    widthLeft :
    {
      check : "Number",
      init : 0,
      apply : "_applyWidth"
    },


    /*
    ---------------------------------------------------------------------------
      PROPERTY: STYLE
    ---------------------------------------------------------------------------
    */

    /** top style of border */
    styleTop :
    {
      nullable : true,
      check : [ "solid", "dotted", "dashed", "double"],
      init : "solid",
      apply : "_applyStyle"
    },

    /** right style of border */
    styleRight :
    {
      nullable : true,
      check : [ "solid", "dotted", "dashed", "double"],
      init : "solid",
      apply : "_applyStyle"
    },

    /** bottom style of border */
    styleBottom :
    {
      nullable : true,
      check : [ "solid", "dotted", "dashed", "double"],
      init : "solid",
      apply : "_applyStyle"
    },

    /** left style of border */
    styleLeft :
    {
      nullable : true,
      check : [ "solid", "dotted", "dashed", "double"],
      init : "solid",
      apply : "_applyStyle"
    },


    /*
    ---------------------------------------------------------------------------
      PROPERTY: COLOR
    ---------------------------------------------------------------------------
    */

    /** top color of border */
    colorTop :
    {
      nullable : true,
      check : "Color",
      apply : "_applyStyle"
    },

    /** right color of border */
    colorRight :
    {
      nullable : true,
      check : "Color",
      apply : "_applyStyle"
    },

    /** bottom color of border */
    colorBottom :
    {
      nullable : true,
      check : "Color",
      apply : "_applyStyle"
    },

    /** left color of border */
    colorLeft :
    {
      nullable : true,
      check : "Color",
      apply : "_applyStyle"
    },

    /*
    ---------------------------------------------------------------------------
      PROPERTY GROUP: EDGE
    ---------------------------------------------------------------------------
    */

    /** Property group to configure the left border */
    left : {
      group : [ "widthLeft", "styleLeft", "colorLeft" ]
    },

    /** Property group to configure the right border */
    right : {
      group : [ "widthRight", "styleRight", "colorRight" ]
    },

    /** Property group to configure the top border */
    top : {
      group : [ "widthTop", "styleTop", "colorTop" ]
    },

    /** Property group to configure the bottom border */
    bottom : {
      group : [ "widthBottom", "styleBottom", "colorBottom" ]
    },


    /*
    ---------------------------------------------------------------------------
      PROPERTY GROUP: TYPE
    ---------------------------------------------------------------------------
    */

    /** Property group to set the border width of all sides */
    width :
    {
      group : [ "widthTop", "widthRight", "widthBottom", "widthLeft" ],
      mode : "shorthand"
    },

    /** Property group to set the border style of all sides */
    style :
    {
      group : [ "styleTop", "styleRight", "styleBottom", "styleLeft" ],
      mode : "shorthand"
    },

    /** Property group to set the border color of all sides */
    color :
    {
      group : [ "colorTop", "colorRight", "colorBottom", "colorLeft" ],
      mode : "shorthand"
    }
  },


  members :
  {
    /**
     * Takes a styles map and adds the border styles styles in place
     * to the given map. This is the needed behavior for
     * {@link qx.ui.decoration.DynamicDecorator}.
     *
     * @param styles {Map} A map to add the styles.
     */
    _styleBorder : function(styles) {
      var Color = qx.theme.manager.Color.getInstance();

      // Add borders
      var width = this.getWidthTop();
      if (width > 0) {
        styles["border-top"] = width + "px " + this.getStyleTop() + " " + (Color.resolve(this.getColorTop()) || "");
      }

      var width = this.getWidthRight();
      if (width > 0) {
        styles["border-right"] = width + "px " + this.getStyleRight() + " " + (Color.resolve(this.getColorRight()) || "");
      }

      var width = this.getWidthBottom();
      if (width > 0) {
        styles["border-bottom"] = width + "px " + this.getStyleBottom() + " " + (Color.resolve(this.getColorBottom()) || "");
      }

      var width = this.getWidthLeft();
      if (width > 0) {
        styles["border-left"] = width + "px " + this.getStyleLeft() + " " + (Color.resolve(this.getColorLeft()) || "");
      }

      // Check if valid
      if (qx.core.Environment.get("qx.debug"))
      {
        if (styles.length === 0) {
          throw new Error("Invalid Single decorator (zero border width). Use qx.ui.decorator.Background instead!");
        }
      }

      // Add basic styles
      styles.position = "absolute";
      styles.top = 0;
      styles.left = 0;
    },


    /**
     * Resize function for the decorator. This is suitable for the
     * {@link qx.ui.decoration.DynamicDecorator}.
     *
     * @param element {Element} The element which could be resized.
     * @param width {Number} The new width.
     * @param height {Number} The new height.
     * @return {Map} A map containing the desired position and dimension.
     *   (width, height, top, left).
     */
    _resizeBorder : function(element, width, height) {
      var insets = this.getInsets();
      width -= insets.left + insets.right;
      height -= insets.top + insets.bottom;

      // Fix to keep applied size above zero
      // Makes issues in IE7 when applying value like '-4px'
      if (width < 0) {
        width = 0;
      }

      if (height < 0) {
        height = 0;
      }

      return {
        left : insets.left - this.getWidthLeft(),
        top : insets.top - this.getWidthTop(),
        width : width,
        height : height
      };
    },



    /**
     * Implementation of the interface for the single border.
     *
     * @return {Map} A map containing the default insets.
     *   (top, right, bottom, left)
     */
    _getDefaultInsetsForBorder : function()
    {
      return {
        top : this.getWidthTop(),
        right : this.getWidthRight(),
        bottom : this.getWidthBottom(),
        left : this.getWidthLeft()
      };
    },


    /*
    ---------------------------------------------------------------------------
      PROPERTY APPLY ROUTINES
    ---------------------------------------------------------------------------
    */

    // property apply
    _applyWidth : function()
    {
      this._applyStyle();

      this._resetInsets();
    },


    // property apply
    _applyStyle : function()
    {
      if (qx.core.Environment.get("qx.debug"))
      {
        if (this._markup) {
          throw new Error("This decorator is already in-use. Modification is not possible anymore!");
        }
      }
    }
  }
});
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
     * Sebastian Werner (wpbasti)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * A basic decorator featuring background colors and simple borders based on
 * CSS styles.
 */
qx.Class.define("qx.ui.decoration.Single",
{
  extend : qx.ui.decoration.Abstract,
  include : [
    qx.ui.decoration.MBackgroundImage,
    qx.ui.decoration.MBackgroundColor,
    qx.ui.decoration.MSingleBorder
  ],


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param width {Integer} Width of the border
   * @param style {String} Any supported border style
   * @param color {Color} The border color
   */
  construct : function(width, style, color)
  {
    this.base(arguments);

    // Initialize properties
    if (width != null) {
      this.setWidth(width);
    }

    if (style != null) {
      this.setStyle(style);
    }

    if (color != null) {
      this.setColor(color);
    }
  },



  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    _markup : null,


    /*
    ---------------------------------------------------------------------------
      INTERFACE IMPLEMENTATION
    ---------------------------------------------------------------------------
    */

    // interface implementation
    getMarkup : function(element)
    {
      if (this._markup) {
        return this._markup;
      }

      var styles = {};

      // get the single border styles
      this._styleBorder(styles, element);

      var html = this._generateBackgroundMarkup(styles);

      return this._markup = html;
    },


    // interface implementation
    resize : function(element, width, height) {
      // get the width and height of the mixins
      var pos = this._resizeBorder(element, width, height);

      element.style.width = pos.width + "px";
      element.style.height = pos.height + "px";

      element.style.left = parseInt(element.style.left) + pos.left + "px";
      element.style.top = parseInt(element.style.top) + pos.top + "px";
    },


    // interface implementation
    tint : function(element, bgcolor) {
      this._tintBackgroundColor(element, bgcolor, element.style);
    },


    // overridden
    _isInitialized: function() {
      return !!this._markup;
    },


    // overridden
    _getDefaultInsets : function() {
      return this._getDefaultInsetsForBorder();
    }
  },



  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function() {
    this._markup = null;
  }
});
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
     * Sebastian Werner (wpbasti)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * A very simple decorator featuring background images and colors. No
 * border is supported.
 */
qx.Class.define("qx.ui.decoration.Background",
{
  extend : qx.ui.decoration.Abstract,
  include : [
    qx.ui.decoration.MBackgroundImage,
    qx.ui.decoration.MBackgroundColor
  ],



  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param backgroundColor {Color} Initialize with background color
   */
  construct : function(backgroundColor)
  {
    this.base(arguments);

    if (backgroundColor != null) {
      this.setBackgroundColor(backgroundColor);
    }
  },


  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __markup : null,

    // overridden
    _getDefaultInsets : function()
    {
      return {
        top : 0,
        right : 0,
        bottom : 0,
        left : 0
      };
    },


    // overridden
    _isInitialized: function() {
      return !!this.__markup;
    },

    /*
    ---------------------------------------------------------------------------
      INTERFACE IMPLEMENTATION
    ---------------------------------------------------------------------------
    */

    // interface implementation
    getMarkup : function(element)
    {
      if (this.__markup) {
        return this.__markup;
      }

      var styles = {
        position: "absolute",
        top: 0,
        left: 0
      };
      var html = this._generateBackgroundMarkup(styles);

      // Store
      return this.__markup = html;
    },


    // interface implementation
    resize : function(element, width, height)
    {
      var insets = this.getInsets();
      element.style.width = (width - insets.left - insets.right) + "px";
      element.style.height = (height - insets.top - insets.bottom) + "px";

      element.style.left = -insets.left + "px";
      element.style.top = -insets.top + "px";
    },


    // interface implementation
    tint : function(element, bgcolor) {
      this._tintBackgroundColor(element, bgcolor, element.style);
    }
  },



  /*
   *****************************************************************************
      DESTRUCTOR
   *****************************************************************************
   */

   destruct : function() {
     this.__markup = null;
   }
});
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
     * Sebastian Werner (wpbasti)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * A simple decorator featuring background images and colors and a simple
 * uniform border based on CSS styles.
 */
qx.Class.define("qx.ui.decoration.Uniform",
{
  extend : qx.ui.decoration.Single,


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param width {Integer} Width of the border
   * @param style {String} Any supported border style
   * @param color {Color} The border color
   */
  construct : function(width, style, color)
  {
    this.base(arguments);

    // Initialize properties
    if (width != null) {
      this.setWidth(width);
    }

    if (style != null) {
      this.setStyle(style);
    }

    if (color != null) {
      this.setColor(color);
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
/**
 * Border implementation with two CSS borders. Both borders can be styled
 * independent of each other.
 * This mixin is usually used by {@link qx.ui.decoration.DynamicDecorator}.
 */
qx.Mixin.define("qx.ui.decoration.MDoubleBorder",
{
  include : [qx.ui.decoration.MSingleBorder, qx.ui.decoration.MBackgroundImage],

  construct : function() {
    // override the methods of single border and background image
    this._getDefaultInsetsForBorder = this.__getDefaultInsetsForDoubleBorder;
    this._resizeBorder = this.__resizeDoubleBorder;
    this._styleBorder = this.__styleDoubleBorder;
    this._generateMarkup = this.__generateMarkupDoubleBorder;
  },


  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /*
    ---------------------------------------------------------------------------
      PROPERTY: INNER WIDTH
    ---------------------------------------------------------------------------
    */

    /** top width of border */
    innerWidthTop :
    {
      check : "Number",
      init : 0
    },

    /** right width of border */
    innerWidthRight :
    {
      check : "Number",
      init : 0
    },

    /** bottom width of border */
    innerWidthBottom :
    {
      check : "Number",
      init : 0
    },

    /** left width of border */
    innerWidthLeft :
    {
      check : "Number",
      init : 0
    },

    /** Property group to set the inner border width of all sides */
    innerWidth :
    {
      group : [ "innerWidthTop", "innerWidthRight", "innerWidthBottom", "innerWidthLeft" ],
      mode : "shorthand"
    },




    /*
    ---------------------------------------------------------------------------
      PROPERTY: INNER COLOR
    ---------------------------------------------------------------------------
    */

    /** top inner color of border */
    innerColorTop :
    {
      nullable : true,
      check : "Color"
    },

    /** right inner color of border */
    innerColorRight :
    {
      nullable : true,
      check : "Color"
    },

    /** bottom inner color of border */
    innerColorBottom :
    {
      nullable : true,
      check : "Color"
    },

    /** left inner color of border */
    innerColorLeft :
    {
      nullable : true,
      check : "Color"
    },

    /**
     * Property group for the inner color properties.
     */
    innerColor :
    {
      group : [ "innerColorTop", "innerColorRight", "innerColorBottom", "innerColorLeft" ],
      mode : "shorthand"
    }
  },


  members :
  {
    __ownMarkup : null,

    /**
     * Takes a styles map and adds the inner border styles styles in place
     * to the given map. This is the needed behavior for
     * {@link qx.ui.decoration.DynamicDecorator}.
     *
     * @param styles {Map} A map to add the styles.
     */
    __styleDoubleBorder : function(styles)
    {
      var Color = qx.theme.manager.Color.getInstance();

      // Inner styles
      // Inner image must be relative to be compatible with qooxdoo 0.8.x
      // See http://bugzilla.qooxdoo.org/show_bug.cgi?id=3450 for details
      styles.position = "relative";

      // Add inner borders
      var width = this.getInnerWidthTop();
      if (width > 0) {
        styles["border-top"] = width + "px " + this.getStyleTop() + " " + Color.resolve(this.getInnerColorTop());
      }

      var width = this.getInnerWidthRight();
      if (width > 0) {
        styles["border-right"] = width + "px " + this.getStyleRight() + " " + Color.resolve(this.getInnerColorRight());
      }

      var width = this.getInnerWidthBottom();
      if (width > 0) {
        styles["border-bottom"] = width + "px " + this.getStyleBottom() + " " + Color.resolve(this.getInnerColorBottom());
      }

      var width = this.getInnerWidthLeft();
      if (width > 0) {
        styles["border-left"] = width + "px " + this.getStyleLeft() + " " + Color.resolve(this.getInnerColorLeft());
      }

      if (qx.core.Environment.get("qx.debug"))
      {
        if (!styles["border-top"] && !styles["border-right"] &&
          !styles["border-bottom"] && !styles["border-left"]) {
          throw new Error("Invalid Double decorator (zero inner border width). Use qx.ui.decoration.Single instead!");
        }
      }
    },


    /**
     * Special generator for the markup which creates the containing div and
     * the sourrounding div as well.
     *
     * @param styles {Map} The styles for the inner
     * @return {String} The generated decorator HTML.
     */
    __generateMarkupDoubleBorder : function(styles) {
      var innerHtml = this._generateBackgroundMarkup(styles);
      var Color = qx.theme.manager.Color.getInstance();

      // get rid of the old borders
      styles["border-top"] = '';
      styles["border-right"] = '';
      styles["border-bottom"] = '';
      styles["border-left"] = '';

      // Generate outer HTML
      styles["line-height"] = 0;

      // Do not set the line-height on IE6, IE7, IE8 in Quirks Mode and IE8 in IE7 Standard Mode
      // See http://bugzilla.qooxdoo.org/show_bug.cgi?id=3450 for details
      if (
        (qx.core.Environment.get("engine.name") == "mshtml" &&
         parseFloat(qx.core.Environment.get("engine.version")) < 8) ||
        (qx.core.Environment.get("engine.name") == "mshtml" &&
         qx.core.Environment.get("browser.documentmode") < 8)
      ) {
        styles["line-height"] = '';
      }

      var width = this.getWidthTop();
      if (width > 0) {
        styles["border-top"] = width + "px " + this.getStyleTop() + " " + Color.resolve(this.getColorTop());
      }

      var width = this.getWidthRight();
      if (width > 0) {
        styles["border-right"] = width + "px " + this.getStyleRight() + " " + Color.resolve(this.getColorRight());
      }

      var width = this.getWidthBottom();
      if (width > 0) {
        styles["border-bottom"] = width + "px " + this.getStyleBottom() + " " + Color.resolve(this.getColorBottom());
      }

      var width = this.getWidthLeft();
      if (width > 0) {
        styles["border-left"] = width + "px " + this.getStyleLeft() + " " + Color.resolve(this.getColorLeft());
      }

      if (qx.core.Environment.get("qx.debug"))
      {
        if (styles["border-top"] == '' && styles["border-right"] == '' &&
          styles["border-bottom"] == '' && styles["border-left"] == '') {
          throw new Error("Invalid Double decorator (zero outer border width). Use qx.ui.decoration.Single instead!");
        }
      }

      // final default styles
      styles["position"] = "absolute";
      styles["top"] = 0;
      styles["left"] = 0;

      // Store
      return this.__ownMarkup = this._generateBackgroundMarkup(styles, innerHtml);
    },




    /**
     * Resize function for the decorator. This is suitable for the
     * {@link qx.ui.decoration.DynamicDecorator}.
     *
     * @param element {Element} The element which could be resized.
     * @param width {Number} The new width.
     * @param height {Number} The new height.
     * @return {Map} A map containing the desired position and dimension and a
     *   emelent to resize.
     *   (width, height, top, left, elementToApplyDimensions).
     */
    __resizeDoubleBorder : function(element, width, height)
    {
      var insets = this.getInsets();
      width -= insets.left + insets.right;
      height -= insets.top + insets.bottom;

      var left =
        insets.left -
        this.getWidthLeft() -
        this.getInnerWidthLeft();
      var top =
        insets.top -
        this.getWidthTop() -
        this.getInnerWidthTop();

      return {
        left: left,
        top: top,
        width: width,
        height: height,
        elementToApplyDimensions : element.firstChild
      };
    },


   /**
    * Implementation of the interface for the double border.
    *
    * @return {Map} A map containing the default insets.
    *   (top, right, bottom, left)
    */
    __getDefaultInsetsForDoubleBorder : function()
    {
      return {
        top : this.getWidthTop() + this.getInnerWidthTop(),
        right : this.getWidthRight() + this.getInnerWidthRight(),
        bottom : this.getWidthBottom() + this.getInnerWidthBottom(),
        left : this.getWidthLeft() + this.getInnerWidthLeft()
      };
    }
  }
});
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
     * Sebastian Werner (wpbasti)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * Beveled is a variant of a rounded decorator which is quite optimal
 * regarding performance and still delivers a good set of features:
 *
 * * One pixel rounded border
 * * Inner glow color with optional transparency
 * * Repeated or scaled background image
 */
qx.Class.define("qx.ui.decoration.Beveled",
{
  extend : qx.ui.decoration.Abstract,
  include : [qx.ui.decoration.MBackgroundImage, qx.ui.decoration.MBackgroundColor],


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param outerColor {Color} The outer border color
   * @param innerColor {Color} The inner border color
   * @param innerOpacity {Float} Opacity of inner border
   */
  construct : function(outerColor, innerColor, innerOpacity)
  {
    this.base(arguments);

    // Initialize properties
    if (outerColor != null) {
      this.setOuterColor(outerColor);
    }

    if (innerColor != null) {
      this.setInnerColor(innerColor);
    }

    if (innerOpacity != null) {
      this.setInnerOpacity(innerOpacity);
    }
  },




  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /**
     * The color of the inner frame.
     */
    innerColor :
    {
      check : "Color",
      nullable : true,
      apply : "_applyStyle"
    },

    /**
     * The opacity of the inner frame. As this inner frame
     * is rendered above the background image this may be
     * intersting to configure as semi-transparent e.g. <code>0.4</code>.
     */
    innerOpacity :
    {
      check : "Number",
      init : 1,
      apply : "_applyStyle"
    },

    /**
     * Color of the outer frame. The corners are automatically
     * rendered with a slight opacity to fade into the background
     */
    outerColor :
    {
      check : "Color",
      nullable : true,
      apply : "_applyStyle"
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __markup : null,

    // overridden
    _getDefaultInsets : function()
    {
      return {
        top : 2,
        right : 2,
        bottom : 2,
        left : 2
      };
    },


    // overridden
    _isInitialized: function() {
      return !!this.__markup;
    },


    /*
    ---------------------------------------------------------------------------
      PROPERTY APPLY ROUTINES
    ---------------------------------------------------------------------------
    */

    // property apply
    _applyStyle : function()
    {
      if (qx.core.Environment.get("qx.debug"))
      {
        if (this.__markup) {
          throw new Error("This decorator is already in-use. Modification is not possible anymore!");
        }
      }
    },





    /*
    ---------------------------------------------------------------------------
      INTERFACE IMPLEMENTATION
    ---------------------------------------------------------------------------
    */

    // interface implementation
    getMarkup : function()
    {
      if (this.__markup) {
        return this.__markup;
      }

      var Color = qx.theme.manager.Color.getInstance();
      var html = [];

      // Prepare border styles
      var outerStyle = "1px solid " + Color.resolve(this.getOuterColor()) + ";";
      var innerStyle = "1px solid " + Color.resolve(this.getInnerColor()) + ";";

      // Outer frame
      html.push('<div style="overflow:hidden;font-size:0;line-height:0;">');

      // Background frame
      html.push('<div style="');
      html.push('border:', outerStyle);
      html.push(qx.bom.element.Opacity.compile(0.35));
      html.push('"></div>');

      // Horizontal frame
      html.push('<div style="position:absolute;top:1px;left:0px;');
      html.push('border-left:', outerStyle);
      html.push('border-right:', outerStyle);
      html.push(qx.bom.element.Opacity.compile(1));
      html.push('"></div>');

      // Vertical frame
      html.push('<div style="');
      html.push('position:absolute;top:0px;left:1px;');
      html.push('border-top:', outerStyle);
      html.push('border-bottom:', outerStyle);
      html.push(qx.bom.element.Opacity.compile(1));
      html.push('"></div>');

      // Inner background frame
      var backgroundStyle = { position: "absolute", top: "1px", left: "1px", opacity: 1 };
      html.push(this._generateBackgroundMarkup(backgroundStyle));

      // Inner overlay frame
      html.push('<div style="position:absolute;top:1px;left:1px;');
      html.push('border:', innerStyle);
      html.push(qx.bom.element.Opacity.compile(this.getInnerOpacity()));
      html.push('"></div>');

      // Outer frame
      html.push('</div>');

      // Store
      return this.__markup = html.join("");
    },


    // interface implementation
    resize : function(element, width, height)
    {
      // Fix to keep applied size above zero
      // Makes issues in IE7 when applying value like '-4px'
      if (width < 4) {
        width = 4;
      }

      if (height < 4) {
        height = 4;
      }

      // Fix box model
      if (qx.core.Environment.get("css.boxmodel") == "content")
      {
        var outerWidth = width - 2;
        var outerHeight = height - 2;
        var frameWidth = outerWidth;
        var frameHeight = outerHeight;
        var innerWidth = width - 4;
        var innerHeight = height - 4;
      }
      else
      {
        var outerWidth = width;
        var outerHeight = height;
        var frameWidth = width - 2;
        var frameHeight = height - 2;
        var innerWidth = frameWidth;
        var innerHeight = frameHeight;
      }

      var pixel = "px";

      var backgroundFrame = element.childNodes[0].style;
      backgroundFrame.width = outerWidth + pixel;
      backgroundFrame.height = outerHeight + pixel;

      var horizontalFrame = element.childNodes[1].style;
      horizontalFrame.width = outerWidth + pixel;
      horizontalFrame.height = frameHeight + pixel;

      var verticalFrame = element.childNodes[2].style;
      verticalFrame.width = frameWidth + pixel;
      verticalFrame.height = outerHeight + pixel;

      var innerBackground = element.childNodes[3].style;
      innerBackground.width = frameWidth + pixel;
      innerBackground.height = frameHeight + pixel;

      var innerOverlay = element.childNodes[4].style;
      innerOverlay.width = innerWidth + pixel;
      innerOverlay.height = innerHeight + pixel;
    },


    // interface implementation
    tint : function(element, bgcolor) {
      this._tintBackgroundColor(element, bgcolor, element.childNodes[3].style);
    }
  },



  /*
   *****************************************************************************
      DESTRUCTOR
   *****************************************************************************
   */

   destruct : function() {
     this.__markup = null;
   }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
/**
 * Mixin for the linear background gradient CSS property.
 * This mixin is usually used by {@link qx.ui.decoration.DynamicDecorator}.
 *
 * Keep in mind that this is not supported by all browsers:
 *
 * * Safari 4.0+
 * * Chrome 4.0+
 * * Firefox 3.6+
 * * Opera 11.1+
 */
qx.Mixin.define("qx.ui.decoration.MLinearBackgroundGradient",
{
  properties :
  {
    /** Start start color of the background */
    startColor :
    {
      check : "Color",
      nullable : true,
      apply : "_applyLinearBackgroundGradient"
    },

    /** End end color of the background */
    endColor :
    {
      check : "Color",
      nullable : true,
      apply : "_applyLinearBackgroundGradient"
    },

    /** The orientation of the gradient. */
    orientation :
    {
      check : ["horizontal", "vertical"],
      init : "vertical",
      apply : "_applyLinearBackgroundGradient"
    },

    /** Position in percent where to start the color. */
    startColorPosition :
    {
      check : "Number",
      init : 0,
      apply : "_applyLinearBackgroundGradient"
    },

    /** Position in percent where to start the color. */
    endColorPosition :
    {
      check : "Number",
      init : 100,
      apply : "_applyLinearBackgroundGradient"
    },

    /** Defines if the given positions are in % or px.*/
    colorPositionUnit :
    {
      check : ["px", "%"],
      init : "%",
      apply : "_applyLinearBackgroundGradient"
    },


    /** Property group to set the start color inluding its start position. */
    gradientStart :
    {
      group : ["startColor", "startColorPosition"],
      mode : "shorthand"
    },

    /** Property group to set the end color inluding its end position. */
    gradientEnd :
    {
      group : ["endColor", "endColorPosition"],
      mode : "shorthand"
    }
  },


  members :
  {
    /**
     * Takes a styles map and adds the linear background styles in place to the
     * given map. This is the needed behavior for
     * {@link qx.ui.decoration.DynamicDecorator}.
     *
     * @param styles {Map} A map to add the styles.
     */
    _styleLinearBackgroundGradient : function(styles) {
      var Color = qx.theme.manager.Color.getInstance();
      var unit = this.getColorPositionUnit();

      if (qx.core.Environment.get("engine.name") == "webkit") {
        // webkit uses px values if non are given
        unit = unit === "px" ? "" : unit;

        if (this.getOrientation() == "horizontal") {
          var startPos = this.getStartColorPosition() + unit +" 0" + unit;
          var endPos = this.getEndColorPosition() + unit + " 0" + unit;
        } else {
          var startPos = "0" + unit + " " + this.getStartColorPosition() + unit;
          var endPos = "0" + unit +" " + this.getEndColorPosition() + unit;
        }

        var color =
          "from(" + Color.resolve(this.getStartColor()) +
          "),to(" + Color.resolve(this.getEndColor()) + ")";

        var value = "-webkit-gradient(linear," + startPos + "," + endPos + "," + color + ")";
        styles["background"] = value;

      } else {
        var deg = this.getOrientation() == "horizontal" ? 0 : 270;
        var start = Color.resolve(this.getStartColor()) + " " + this.getStartColorPosition() + unit;
        var end = Color.resolve(this.getEndColor()) + " " + this.getEndColorPosition() + unit;

        var prefix = "";
        if (qx.core.Environment.get("engine.name") == "gecko") {
          prefix = "-moz-";
        } else if (qx.core.Environment.get("engine.name") == "opera") {
          prefix = "-o-";
        }
        styles["background"] =
          prefix + "linear-gradient(" + deg + "deg, " + start + "," + end + ")";
      }
    },


    /**
     * Resize function for the background color. This is suitable for the
     * {@link qx.ui.decoration.DynamicDecorator}.
     *
     * @param element {Element} The element which could be resized.
     * @param width {Number} The new width.
     * @param height {Number} The new height.
     * @return {Map} A map containing the desired position and dimension
     *   (width, height, top, left).
     */
    _resizeLinearBackgroundGradient : function(element, width, height) {
      var insets = this.getInsets();
      width -= insets.left + insets.right;
      height -= insets.top + insets.bottom;
      return {
        left : insets.left,
        top : insets.top,
        width : width,
        height : height
      };
    },


    // property apply
    _applyLinearBackgroundGradient : function()
    {
      if (qx.core.Environment.get("qx.debug"))
      {
        if (this._isInitialized()) {
          throw new Error("This decorator is already in-use. Modification is not possible anymore!");
        }
      }
    }
  }
});
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
     * Sebastian Werner (wpbasti)
     * Fabian Jakobs (fjakobs)

************************************************************************ */

/**
 * A very complex decoration using two, partly combined and clipped images
 * to render a graphically impressive borders with gradients.
 *
 * The decoration supports all forms of vertical gradients. The gradients must
 * be stretchable to support different heights.
 *
 * The edges could use different styles of rounded borders. Even different
 * edge sizes are supported. The sizes are automatically detected by
 * the build system using the image meta data.
 *
 * The decoration uses clipped images to reduce the number of external
 * resources to load.
 */
qx.Class.define("qx.ui.decoration.Grid",
{
  extend: qx.core.Object,
  implement : [qx.ui.decoration.IDecorator],


  /*
  *****************************************************************************
     CONSTRUCTOR
  *****************************************************************************
  */

  /**
   * @param baseImage {String} Base image to use
   * @param insets {Integer|Array} Insets for the grid
   */
  construct : function(baseImage, insets)
  {
    this.base(arguments);

    if (qx.ui.decoration.css3.BorderImage.IS_SUPPORTED)
    {
      this.__impl = new qx.ui.decoration.css3.BorderImage();
      if (baseImage) {
        this.__setBorderImage(baseImage);
      }
    }
    else
    {
      this.__impl = new qx.ui.decoration.GridDiv(baseImage);
    }

    if (insets != null) {
      this.__impl.setInsets(insets);
    }
  },





  /*
  *****************************************************************************
     PROPERTIES
  *****************************************************************************
  */

  properties :
  {
    /**
     * Base image URL. There must be an image with this name and the sliced
     * and the nine sliced images. The sliced images must be named according to
     * the following scheme:
     *
     * ${baseImageWithoutExtension}-${imageName}.${baseImageExtension}
     *
     * These image names are used:
     *
     * * tl (top-left edge)
     * * t (top side)
     * * tr (top-right edge)

     * * bl (bottom-left edge)
     * * b (bottom side)
     * * br (bottom-right edge)
     *
     * * l (left side)
     * * c (center image)
     * * r (right side)
     */
    baseImage :
    {
      check : "String",
      nullable : true,
      apply : "_applyBaseImage"
    },


    /** Width of the left inset (keep this margin to the outer box) */
    insetLeft :
    {
      check : "Number",
      nullable: true,
      apply : "_applyInsets"
    },

    /** Width of the right inset (keep this margin to the outer box) */
    insetRight :
    {
      check : "Number",
      nullable: true,
      apply : "_applyInsets"
    },

    /** Width of the bottom inset (keep this margin to the outer box) */
    insetBottom :
    {
      check : "Number",
      nullable: true,
      apply : "_applyInsets"
    },

    /** Width of the top inset (keep this margin to the outer box) */
    insetTop :
    {
      check : "Number",
      nullable: true,
      apply : "_applyInsets"
    },

    /** Property group for insets */
    insets :
    {
      group : [ "insetTop", "insetRight", "insetBottom", "insetLeft" ],
      mode  : "shorthand"
    }
  },




  /*
  *****************************************************************************
     MEMBERS
  *****************************************************************************
  */

  members :
  {
    __impl : null,


    // interface implementation
    getMarkup : function() {
      return this.__impl.getMarkup();
    },


    // interface implementation
    resize : function(element, width, height) {
      this.__impl.resize(element, width, height);
    },


    // interface implementation
    tint : function(element, bgcolor) {
      // do nothing
    },


    // interface implementation
    getInsets : function() {
      return this.__impl.getInsets();
    },


    // property apply
    _applyInsets : function(value, old, name)
    {
      var setter = "set" + qx.lang.String.firstUp(name);
      this.__impl[setter](value);
    },


    // property apply
    _applyBaseImage : function(value, old)
    {
      if (this.__impl instanceof qx.ui.decoration.GridDiv) {
        this.__impl.setBaseImage(value);
      } else {
        this.__setBorderImage(value);
      }
    },


    /**
     * Configures the border image decorator
     *
     * @param baseImage {String} URL of the base image
     */
    __setBorderImage : function(baseImage)
    {
      this.__impl.setBorderImage(baseImage);

      var base = qx.util.AliasManager.getInstance().resolve(baseImage);
      var split = /(.*)(\.[a-z]+)$/.exec(base);
      var prefix = split[1];
      var ext = split[2];

      var ResourceManager = qx.util.ResourceManager.getInstance();

      var topSlice = ResourceManager.getImageHeight(prefix + "-t" + ext);
      var leftSlice = ResourceManager.getImageWidth(prefix + "-l" + ext);

      if (qx.core.Environment.get("qx.debug"))
      {
        var assertMessageTop = "The value of the property 'topSlice' is null! " +
          "Please verify the image '" + prefix + "-t" + ext + "' is present.";

        var assertMessageLeft = "The value of the property 'leftSlice' is null! " +
          "Please verify the image '" + prefix + "-l" + ext + "' is present.";

        qx.core.Assert.assertNotNull(topSlice, assertMessageTop);
        qx.core.Assert.assertNotNull(leftSlice, assertMessageLeft);
      }

      this.__impl.setSlice([topSlice, leftSlice]);
    }
  },



  /*
  *****************************************************************************
     DESTRUCTOR
  *****************************************************************************
  */

  destruct : function() {
    this.__impl = null;
  }

});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2010 1&1 Internet AG, Germany, http://www.1und1.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
     * Martin Wittemann (martinwittemann)

************************************************************************ */
/**
 * Mixin for the border radius CSS property.
 * This mixin is usually used by {@link qx.ui.decoration.DynamicDecorator}.
 *
 * Keep in mind that this is not supported by all browsers:
 *
 * * Firefox 3,5+
 * * IE9+
 * * Safari 3.0+
 * * Opera 10.5+
 * * Chrome 4.0+
 */
qx.Mixin.define("qx.ui.decoration.MBorderRadius",
{
  properties : {
    /** top left corner radius */
    radiusTopLeft :
    {
      nullable : true,
      check : "Integer",
      apply : "_applyBorderRadius"
    },

    /** top right corner radius */
    radiusTopRight :
    {
      nullable : true,
      check : "Integer",
      apply : "_applyBorderRadius"
    },

    /** bottom left corner radius */
    radiusBottomLeft :
    {
      nullable : true,
      check : "Integer",
      apply : "_applyBorderRadius"
    },

    /** bottom right corner radius */
    radiusBottomRight :
    {
      nullable : true,
      check : "Integer",
      apply : "_applyBorderRadius"
    },

    /** Property group to set the corner radius of all sides */
    radius :
    {
      group : [ "radiusTopLeft", "radiusTopRight", "radiusBottomRight", "radiusBottomLeft" ],
      mode : "shorthand"
    }
  },


  members :
  {
    /**
     * Takes a styles map and adds the broder radius styles in place to the
     * given map. This is the needed behavior for
     * {@link qx.ui.decoration.DynamicDecorator}.
     *
     * @param styles {Map} A map to add the styles.
     */
    _styleBorderRadius : function(styles)
    {
      // Fixing the background bleed in Webkits
      // http://tumble.sneak.co.nz/post/928998513/fixing-the-background-bleed
      styles["-webkit-background-clip"] = "padding-box";

      // radius handling
      var radius = this.getRadiusTopLeft();
      if (radius > 0) {
        styles["-moz-border-radius-topleft"] = radius + "px";
        styles["-webkit-border-top-left-radius"] = radius + "px";
        styles["border-top-left-radius"] = radius + "px";
      }

      radius = this.getRadiusTopRight();
      if (radius > 0) {
        styles["-moz-border-radius-topright"] = radius + "px";
        styles["-webkit-border-top-right-radius"] = radius + "px";
        styles["border-top-right-radius"] = radius + "px";
      }

      radius = this.getRadiusBottomLeft();
      if (radius > 0) {
        styles["-moz-border-radius-bottomleft"] = radius + "px";
        styles["-webkit-border-bottom-left-radius"] = radius + "px";
        styles["border-bottom-left-radius"] = radius + "px";
      }

      radius = this.getRadiusBottomRight();
      if (radius > 0) {
        styles["-moz-border-radius-bottomright"] = radius + "px";
        styles["-webkit-border-bottom-right-radius"] = radius + "px";
        styles["border-bottom-right-radius"] = radius + "px";
      }
    },

    // property apply
    _applyBorderRadius : function()
    {
      if (qx.core.Environment.get("qx.debug"))
      {
        if (this._isInitialized()) {
          throw new Error("This decorator is already in-use. Modification is not possible anymore!");
        }
      }
    }
  }
});
/* ************************************************************************

   qooxdoo - the new era of web development

   http://qooxdoo.org

   Copyright:
     2004-2008 1&1 Internet AG, Germany, http://www.1und1.de
     2006 STZ-IDA, Germany, http://www.stz-ida.de

   License:
     LGPL: http://www.gnu.org/licenses/lgpl.html
     EPL: http://www.eclipse.org/org/documents/epl-v10.php
     See the LICENSE file in the project's top-level directory for details.

   Authors:
   * Fabian Jakobs (fjakobs)
   * Sebastian Werner (wpbasti)
   * Andreas Ecker (ecker)
   * Alexander Back (aback)
   * Martin Wittemann (martinwittemann)

************************************************************************* */

/* ************************************************************************

#asset(qx/decoration/Modern/*)

************************************************************************ */

/**
 * The modern decoration theme.
 */
qx.Theme.define("qx.theme.modern.Decoration",
{
  aliases : {
    decoration : "qx/decoration/Modern"
  },

  decorations :
  {
    /*
    ---------------------------------------------------------------------------
      CORE
    ---------------------------------------------------------------------------
    */

    "main" :
    {
      decorator: qx.ui.decoration.Uniform,

      style :
      {
        width : 1,
        color : "border-main"
      }
    },

    "selected" :
    {
      decorator : qx.ui.decoration.Background,

      style :
      {
        backgroundImage  : "decoration/selection.png",
        backgroundRepeat : "scale"
      }
    },

    "selected-css" :
    {
      decorator : [
        qx.ui.decoration.MLinearBackgroundGradient
      ],

      style :
      {
        startColorPosition : 0,
        endColorPosition : 100,
        startColor : "selected-start",
        endColor : "selected-end"
      }
    },

    "selected-dragover" :
    {
      decorator : qx.ui.decoration.Single,

      style :
      {
        backgroundImage  : "decoration/selection.png",
        backgroundRepeat : "scale",
        bottom: [2, "solid", "border-dragover"]
      }
    },

    "dragover" :
    {
      decorator : qx.ui.decoration.Single,

      style :
      {
        bottom: [2, "solid", "border-dragover"]
      }
    },

    "pane" :
    {
      decorator : qx.ui.decoration.Grid,

      style :
      {
        baseImage : "decoration/pane/pane.png",
        insets    : [0, 2, 3, 0]
      }
    },

    "pane-css" : {
      decorator : [
        qx.ui.decoration.MSingleBorder,
        qx.ui.decoration.MBorderRadius,
        qx.ui.decoration.MBoxShadow,
        qx.ui.decoration.MLinearBackgroundGradient
      ],
      style : {
        width: 1,
        color: "tabview-background",
        radius : 3,
        shadowColor : "shadow",
        shadowBlurRadius : 2,
        shadowLength : 0,
        gradientStart : ["pane-start", 0],
        gradientEnd : ["pane-end", 100]
      }
    },

    "group" :
    {
      decorator : qx.ui.decoration.Grid,

      style : {
        baseImage : "decoration/groupbox/groupbox.png"
      }
    },

    "group-css" :
    {
      decorator : [
        qx.ui.decoration.MBackgroundColor,
        qx.ui.decoration.MBorderRadius,
        qx.ui.decoration.MSingleBorder
      ],

      style : {
        backgroundColor : "group-background",
        radius : 4,
        color : "group-border",
        width: 1
      }
    },

    "border-invalid" :
    {
      decorator : qx.ui.decoration.Beveled,

      style :
      {
        outerColor : "invalid",
        innerColor : "border-inner-input",
        innerOpacity : 0.5,
        backgroundImage : "decoration/form/input.png",
        backgroundRepeat : "repeat-x",
        backgroundColor : "background-light"
      }
    },


    "keyboard-focus" :
    {
      decorator : qx.ui.decoration.Single,

      style :
      {
        width : 1,
        color : "keyboard-focus",
        style : "dotted"
      }
    },

    /*
    ---------------------------------------------------------------------------
      CSS RADIO BUTTON
    ---------------------------------------------------------------------------
    */
    "radiobutton" : {
      decorator : [
        qx.ui.decoration.MDoubleBorder,
        qx.ui.decoration.MBackgroundColor,
        qx.ui.decoration.MBorderRadius,
        qx.ui.decoration.MBoxShadow
      ],
      style : {
        backgroundColor : "radiobutton-background",
        radius : 5,
        width: 1,
        innerWidth : 2,
        color : "checkbox-border",
        innerColor : "radiobutton-background",
        shadowLength : 0,
        shadowBlurRadius : 0,
        shadowColor : "checkbox-focus",
        insetLeft: 5 // used for the shadow (3 border + 2 extra for the shadow)
      }
    },

    "radiobutton-checked" : {
      include : "radiobutton",
      style : {
        backgroundColor : "radiobutton-checked"
      }
    },

    "radiobutton-checked-focused" : {
      include  : "radiobutton-checked",
      style : {
        shadowBlurRadius : 4
      }
    },

    "radiobutton-checked-hovered" : {
      include : "radiobutton-checked",
      style : {
        innerColor : "checkbox-hovered"
      }
    },

    "radiobutton-focused" : {
      include : "radiobutton",
      style : {
        shadowBlurRadius : 4
      }
    },

    "radiobutton-hovered" : {
      include : "radiobutton",
      style : {
        backgroundColor : "checkbox-hovered",
        innerColor : "checkbox-hovered"
      }
    },

    "radiobutton-disabled" : {
      include : "radiobutton",
      style : {
        innerColor : "radiobutton-disabled",
        backgroundColor : "radiobutton-disabled",
        color : "checkbox-disabled-border"
      }
    },

    "radiobutton-checked-disabled" : {
      include : "radiobutton-disabled",
      style : {
        backgroundColor : "radiobutton-checked-disabled"
      }
    },

    "radiobutton-invalid" : {
      include : "radiobutton",
      style : {
        color : "invalid"
      }
    },

    "radiobutton-checked-invalid" : {
      include : "radiobutton-checked",
      style : {
        color : "invalid"
      }
    },

    "radiobutton-checked-focused-invalid" : {
      include  : "radiobutton-checked-focused",
      style : {
        color : "invalid",
        shadowColor : "invalid"
      }
    },

    "radiobutton-checked-hovered-invalid" : {
      include : "radiobutton-checked-hovered",
      style : {
        color : "invalid",
        innerColor : "radiobutton-hovered-invalid"
      }
    },

    "radiobutton-focused-invalid" : {
      include : "radiobutton-focused",
      style : {
        color : "invalid",
        shadowColor : "invalid"
      }
    },

    "radiobutton-hovered-invalid" : {
      include : "radiobutton-hovered",
      style : {
        color : "invalid",
        innerColor : "radiobutton-hovered-invalid",
        backgroundColor : "radiobutton-hovered-invalid"
      }
    },


    /*
    ---------------------------------------------------------------------------
      SEPARATOR
    ---------------------------------------------------------------------------
    */

    "separator-horizontal" :
    {
      decorator: qx.ui.decoration.Single,

      style :
      {
        widthLeft : 1,
        colorLeft : "border-separator"
      }
    },

    "separator-vertical" :
    {
      decorator: qx.ui.decoration.Single,

      style :
      {
        widthTop : 1,
        colorTop : "border-separator"
      }
    },



    /*
    ---------------------------------------------------------------------------
      TOOLTIP
    ---------------------------------------------------------------------------
    */

    "tooltip-error" :
    {
      decorator : qx.ui.decoration.Grid,

      style : {
        baseImage : "decoration/form/tooltip-error.png",
        insets    : [ 2, 5, 5, 2 ]
      }
    },

    "tooltip-error-css" :
    {
      decorator : [
        qx.ui.decoration.MBackgroundColor,
        qx.ui.decoration.MBorderRadius,
        qx.ui.decoration.MBoxShadow
      ],

      style : {
        backgroundColor : "tooltip-error",
        radius : 4,
        shadowColor : "shadow",
        shadowBlurRadius : 2,
        shadowLength : 1
      }
    },


    "tooltip-error-arrow" :
    {
      decorator: qx.ui.decoration.Background,

      style: {
        backgroundImage: "decoration/form/tooltip-error-arrow.png",
        backgroundPositionY: "center",
        backgroundRepeat: "no-repeat",
        insets: [0, 0, 0, 10]
      }
    },


    /*
    ---------------------------------------------------------------------------
      SHADOWS
    ---------------------------------------------------------------------------
    */

    "shadow-window" :
    {
      decorator : qx.ui.decoration.Grid,

      style : {
        baseImage : "decoration/shadow/shadow.png",
        insets    : [ 4, 8, 8, 4 ]
      }
    },

    "shadow-window-css" :
    {
      decorator : [
        qx.ui.decoration.MBoxShadow,
        qx.ui.decoration.MBackgroundColor
      ],

      style : {
        shadowColor : "shadow",
        shadowBlurRadius : 2,
        shadowLength : 1
      }
    },

    "shadow-popup" :
    {
      decorator : qx.ui.decoration.Grid,

      style : {
        baseImage : "decoration/shadow/shadow-small.png",
        insets    : [ 0, 3, 3, 0 ]
      }
    },

    "popup-css" :
    {
      decorator: [
        qx.ui.decoration.MSingleBorder,
        qx.ui.decoration.MBoxShadow,
        qx.ui.decoration.MBackgroundColor
      ],

      style :
      {
        width : 1,
        color : "border-main",
        shadowColor : "shadow",
        shadowBlurRadius : 3,
        shadowLength : 1
      }
    },



    /*
    ---------------------------------------------------------------------------
      SCROLLBAR
    ---------------------------------------------------------------------------
    */

    "scrollbar-horizontal" :
    {
      decorator : qx.ui.decoration.Background,

      style :
      {
        backgroundImage : "decoration/scrollbar/scrollbar-bg-horizontal.png",
        backgroundRepeat : "repeat-x"
      }
    },

    "scrollbar-vertical" :
    {
      decorator : qx.ui.decoration.Background,

      style :
      {
        backgroundImage : "decoration/scrollbar/scrollbar-bg-vertical.png",
        backgroundRepeat : "repeat-y"
      }
    },

    "scrollbar-slider-horizontal" :
    {
      decorator : qx.ui.decoration.Beveled,

      style : {
        backgroundImage : "decoration/scrollbar/scrollbar-button-bg-horizontal.png",
        backgroundRepeat : "scale",
        outerColor : "border-main",
        innerColor : "border-inner-scrollbar",
        innerOpacity : 0.5
      }
    },

    "scrollbar-slider-horizontal-disabled" :
    {
      decorator : qx.ui.decoration.Beveled,

      style : {
        backgroundImage : "decoration/scrollbar/scrollbar-button-bg-horizontal.png",
        backgroundRepeat : "scale",
        outerColor : "border-disabled",
        innerColor : "border-inner-scrollbar",
        innerOpacity : 0.3
      }
    },

    "scrollbar-slider-vertical" :
    {
      decorator : qx.ui.decoration.Beveled,

      style : {
        backgroundImage : "decoration/scrollbar/scrollbar-button-bg-vertical.png",
        backgroundRepeat : "scale",
        outerColor : "border-main",
        innerColor : "border-inner-scrollbar",
        innerOpacity : 0.5
      }
    },

    "scrollbar-slider-vertical-disabled" :
    {
      decorator : qx.ui.decoration.Beveled,

      style : {
        backgroundImage : "decoration/scrollbar/scrollbar-button-bg-vertical.png",
        backgroundRepeat : "scale",
        outerColor : "border-disabled",
        innerColor : "border-inner-scrollbar",
        innerOpacity : 0.3
      }
    },

    // PLAIN CSS SCROLLBAR
    "scrollbar-horizontal-css" : {
      decorator : [qx.ui.decoration.MLinearBackgroundGradient],
      style : {
        gradientStart : ["scrollbar-start", 0],
        gradientEnd : ["scrollbar-end", 100]
      }
    },

    "scrollbar-vertical-css" : {
      include : "scrollbar-horizontal-css",
      style : {
        orientation : "horizontal"
      }
    },

    "scrollbar-slider-horizontal-css" :
    {
      decorator : [
        qx.ui.decoration.MSingleBorder,
        qx.ui.decoration.MLinearBackgroundGradient
      ],

      style : {
        gradientStart : ["scrollbar-slider-start", 0],
        gradientEnd : ["scrollbar-slider-end", 100],

        color : "border-main",
        width: 1
      }
    },

    "scrollbar-slider-vertical-css" :
    {
      include : "scrollbar-slider-horizontal-css",
      style : {
        orientation : "horizontal"
      }
    },

    "scrollbar-slider-horizontal-disabled-css" :
    {
      include : "scrollbar-slider-horizontal-css",
      style : {
        color : "button-border-disabeld"
      }
    },

    "scrollbar-slider-vertical-disabled-css" :
    {
      include : "scrollbar-slider-vertical-css",
      style : {
        color : "button-border-disabeld"
      }
    },



    /*
    ---------------------------------------------------------------------------
      PLAIN CSS BUTTON
    ---------------------------------------------------------------------------
    */
    "button-css" :
    {
      decorator : [
        qx.ui.decoration.MSingleBorder,
        qx.ui.decoration.MLinearBackgroundGradient,
        qx.ui.decoration.MBorderRadius
      ],

      style :
      {
        radius: 3,
        color: "border-button",
        width: 1,
        startColor: "button-start",
        endColor: "button-end",
        startColorPosition: 35,
        endColorPosition: 100
      }
    },

    "button-disabled-css" :
    {
      include : "button-css",
      style : {
        color : "button-border-disabeld",
        startColor: "button-disabled-start",
        endColor: "button-disabled-end"
      }
    },

    "button-hovered-css" :
    {
      include : "button-css",
      style : {
        startColor : "button-hovered-start",
        endColor : "button-hovered-end"
      }
    },

    "button-checked-css" :
    {
      include : "button-css",
      style : {
        endColor: "button-start",
        startColor: "button-end"
      }
    },

    "button-pressed-css" :
    {
      include : "button-css",
      style : {
        endColor : "button-hovered-start",
        startColor : "button-hovered-end"
      }
    },

    "button-focused-css" : {
      decorator : [
        qx.ui.decoration.MDoubleBorder,
        qx.ui.decoration.MLinearBackgroundGradient,
        qx.ui.decoration.MBorderRadius
      ],

      style :
      {
        radius: 3,
        color: "border-button",
        width: 1,
        innerColor: "button-focused",
        innerWidth: 2,
        startColor: "button-start",
        endColor: "button-end",
        startColorPosition: 30,
        endColorPosition: 100
      }
    },

    "button-checked-focused-css" : {
      include : "button-focused-css",
      style : {
        endColor: "button-start",
        startColor: "button-end"
      }
    },

    // invalid
    "button-invalid-css" : {
      include : "button-css",
      style : {
        color: "border-invalid"
      }
    },

    "button-disabled-invalid-css" :
    {
      include : "button-disabled-css",
      style : {
        color : "border-invalid"
      }
    },

    "button-hovered-invalid-css" :
    {
      include : "button-hovered-css",
      style : {
        color : "border-invalid"
      }
    },

    "button-checked-invalid-css" :
    {
      include : "button-checked-css",
      style : {
        color : "border-invalid"
      }
    },

    "button-pressed-invalid-css" :
    {
      include : "button-pressed-css",
      style : {
        color : "border-invalid"
      }
    },

    "button-focused-invalid-css" : {
      include : "button-focused-css",
      style : {
        color : "border-invalid"
      }
    },

    "button-checked-focused-invalid-css" : {
      include : "button-checked-focused-css",
      style : {
        color : "border-invalid"
      }
    },



    /*
    ---------------------------------------------------------------------------
      BUTTON
    ---------------------------------------------------------------------------
    */

    "button" :
    {
      decorator : qx.ui.decoration.Grid,

      style :
      {
        baseImage : "decoration/form/button.png",
        insets    : 2
      }
    },

    "button-disabled" :
    {
      decorator : qx.ui.decoration.Grid,

      style :
      {
        baseImage : "decoration/form/button-disabled.png",
        insets    : 2
      }
    },

    "button-focused" :
    {
      decorator : qx.ui.decoration.Grid,

      style :
      {
        baseImage : "decoration/form/button-focused.png",
        insets    : 2
      }
    },

    "button-hovered" :
    {
      decorator : qx.ui.decoration.Grid,

      style :
      {
        baseImage : "decoration/form/button-hovered.png",
        insets    : 2
      }
    },

    "button-pressed" :
    {
      decorator : qx.ui.decoration.Grid,

      style :
      {
        baseImage : "decoration/form/button-pressed.png",
        insets    : 2
      }
    },

    "button-checked" :
    {
      decorator : qx.ui.decoration.Grid,

      style :
      {
        baseImage : "decoration/form/button-checked.png",
        insets    : 2
      }
    },

    "button-checked-focused" :
    {
      decorator : qx.ui.decoration.Grid,

      style :
      {
        baseImage : "decoration/form/button-checked-focused.png",
        insets    : 2
      }
    },

    "button-invalid-shadow" :
    {
      decorator : qx.ui.decoration.Single,

      style :
      {
        color : "invalid",
        width : 1
      }
    },



    /*
    ---------------------------------------------------------------------------
      CHECKBOX
    ---------------------------------------------------------------------------
    */

    "checkbox-invalid-shadow" :
    {
      decorator : qx.ui.decoration.Beveled,

      style :
      {
        outerColor : "invalid",
        innerColor : "border-focused-invalid",
        insets: [0]
      }
    },

    /*
    ---------------------------------------------------------------------------
      PLAIN CSS CHECK BOX
    ---------------------------------------------------------------------------
    */
    "checkbox" : {
      decorator : [
        qx.ui.decoration.MDoubleBorder,
        qx.ui.decoration.MLinearBackgroundGradient,
        qx.ui.decoration.MBoxShadow
      ],

      style : {
        width: 1,
        color: "checkbox-border",
        innerWidth : 1,
        innerColor : "checkbox-inner",

        gradientStart : ["checkbox-start", 0],
        gradientEnd : ["checkbox-end", 100],

        shadowLength : 0,
        shadowBlurRadius : 0,
        shadowColor : "checkbox-focus",

        insetLeft: 4 // (2 for the broder and two for the glow effect)
      }
    },

    "checkbox-hovered" : {
      include : "checkbox",
      style : {
        innerColor : "checkbox-hovered-inner",
        // use the same color to get a single colored background
        gradientStart : ["checkbox-hovered", 0],
        gradientEnd : ["checkbox-hovered", 100]
      }
    },

    "checkbox-focused" : {
      include : "checkbox",
      style : {
        shadowBlurRadius : 4
      }
    },

    "checkbox-disabled" : {
      include : "checkbox",
      style : {
        color : "checkbox-disabled-border",
        innerColor : "checkbox-disabled-inner",
        gradientStart : ["checkbox-disabled-start", 0],
        gradientEnd : ["checkbox-disabled-end", 100]
      }
    },

    "checkbox-invalid" : {
      include : "checkbox",
      style : {
        color : "invalid"
      }
    },

    "checkbox-hovered-invalid" : {
      include : "checkbox-hovered",
      style : {
        color : "invalid",
        innerColor : "checkbox-hovered-inner-invalid",
        gradientStart : ["checkbox-hovered-invalid", 0],
        gradientEnd : ["checkbox-hovered-invalid", 100]
      }
    },

    "checkbox-focused-invalid" : {
      include : "checkbox-focused",
      style : {
        color : "invalid",
        shadowColor : "invalid"
      }
    },



    /*
    ---------------------------------------------------------------------------
      PLAIN CSS TEXT FIELD
    ---------------------------------------------------------------------------
    */

    "input-css" :
    {
      decorator : [
        qx.ui.decoration.MDoubleBorder,
        qx.ui.decoration.MLinearBackgroundGradient,
        qx.ui.decoration.MBackgroundColor
      ],

      style :
      {
        color : "border-input",
        innerColor : "border-inner-input",
        innerWidth: 1,
        width : 1,
        backgroundColor : "background-light",
        startColor : "input-start",
        endColor : "input-end",
        startColorPosition : 0,
        endColorPosition : 12,
        colorPositionUnit : "px"
      }
    },

    "border-invalid-css" : {
      include : "input-css",
      style : {
        color : "border-invalid"
      }
    },

    "input-focused-css" : {
      include : "input-css",
      style : {
        startColor : "input-focused-start",
        innerColor : "input-focused-end",
        endColorPosition : 4
      }
    },

    "input-focused-invalid-css" : {
      include : "input-focused-css",
      style : {
        innerColor : "input-focused-inner-invalid",
        color : "border-invalid"
      }
    },

    "input-disabled-css" : {
      include : "input-css",
      style : {
        color: "input-border-disabled"
      }
    },



    /*
    ---------------------------------------------------------------------------
      TEXT FIELD
    ---------------------------------------------------------------------------
    */

    "input" :
    {
      decorator : qx.ui.decoration.Beveled,

      style :
      {
        outerColor : "border-input",
        innerColor : "border-inner-input",
        innerOpacity : 0.5,
        backgroundImage : "decoration/form/input.png",
        backgroundRepeat : "repeat-x",
        backgroundColor : "background-light"
      }
    },

    "input-focused" :
    {
      decorator : qx.ui.decoration.Beveled,

      style :
      {
        outerColor : "border-input",
        innerColor : "border-focused",
        backgroundImage : "decoration/form/input-focused.png",
        backgroundRepeat : "repeat-x",
        backgroundColor : "background-light"
      }
    },

    "input-focused-invalid" :
    {
      decorator : qx.ui.decoration.Beveled,

      style :
      {
        outerColor : "invalid",
        innerColor : "border-focused-invalid",
        backgroundImage : "decoration/form/input-focused.png",
        backgroundRepeat : "repeat-x",
        backgroundColor : "background-light",
        insets: [2]
      }
    },


    "input-disabled" :
    {
      decorator : qx.ui.decoration.Beveled,

      style :
      {
        outerColor : "border-disabled",
        innerColor : "border-inner-input",
        innerOpacity : 0.5,
        backgroundImage : "decoration/form/input.png",
        backgroundRepeat : "repeat-x",
        backgroundColor : "background-light"
      }
    },





    /*
    ---------------------------------------------------------------------------
      TOOLBAR
    ---------------------------------------------------------------------------
    */

    "toolbar" :
    {
      decorator : qx.ui.decoration.Background,

      style :
      {
        backgroundImage : "decoration/toolbar/toolbar-gradient.png",
        backgroundRepeat : "scale"
      }
    },

    "toolbar-css" :
    {
      decorator : [qx.ui.decoration.MLinearBackgroundGradient],
      style : {
        startColorPosition : 40,
        endColorPosition : 60,
        startColor : "toolbar-start",
        endColor : "toolbar-end"
      }
    },

    "toolbar-button-hovered" :
    {
      decorator : qx.ui.decoration.Beveled,

      style :
      {
        outerColor : "broder-toolbar-button-outer",
        innerColor : "broder-toolbar-broder-inner",
        backgroundImage : "decoration/form/button-c.png",
        backgroundRepeat : "scale"
      }
    },

    "toolbar-button-checked" :
    {
      decorator : qx.ui.decoration.Beveled,

      style :
      {
        outerColor : "broder-toolbar-button-outer",
        innerColor : "broder-toolbar-broder-inner",
        backgroundImage : "decoration/form/button-checked-c.png",
        backgroundRepeat : "scale"
      }
    },

    "toolbar-button-hovered-css" :
    {
      decorator : [
        qx.ui.decoration.MDoubleBorder,
        qx.ui.decoration.MLinearBackgroundGradient,
        qx.ui.decoration.MBorderRadius
      ],

      style :
      {
        color : "broder-toolbar-button-outer",
        width: 1,
        innerWidth: 1,
        innerColor : "broder-toolbar-broder-inner",
        radius : 2,
        gradientStart : ["button-start", 30],
        gradientEnd : ["button-end", 100]
      }
    },

    "toolbar-button-checked-css" :
    {
      include : "toolbar-button-hovered-css",

      style :
      {
        gradientStart : ["button-end", 30],
        gradientEnd : ["button-start", 100]
      }
    },

    "toolbar-separator" :
    {
      decorator : qx.ui.decoration.Single,

      style :
      {
        widthLeft : 1,
        widthRight : 1,

        colorLeft : "border-toolbar-separator-left",
        colorRight : "border-toolbar-separator-right",

        styleLeft : "solid",
        styleRight : "solid"
      }
    },

    "toolbar-part" :
    {
      decorator : qx.ui.decoration.Background,

      style :
      {
        backgroundImage  : "decoration/toolbar/toolbar-part.gif",
        backgroundRepeat : "repeat-y"
      }
    },




    /*
    ---------------------------------------------------------------------------
      TABVIEW
    ---------------------------------------------------------------------------
    */

    "tabview-pane" :
    {
      decorator : qx.ui.decoration.Grid,

      style :
      {
        baseImage : "decoration/tabview/tabview-pane.png",
        insets : [ 4, 6, 7, 4 ]
      }
    },

    "tabview-pane-css" :
    {
      decorator : [
        qx.ui.decoration.MBorderRadius,
        qx.ui.decoration.MLinearBackgroundGradient,
        qx.ui.decoration.MSingleBorder
      ],

      style : {
        width: 1,
        color: "window-border",
        radius : 3,
        gradientStart : ["tabview-start", 90],
        gradientEnd : ["tabview-end", 100]
      }
    },

    "tabview-page-button-top-active" :
    {
      decorator : qx.ui.decoration.Grid,

      style : {
        baseImage : "decoration/tabview/tab-button-top-active.png"
      }
    },

    "tabview-page-button-top-inactive" :
    {
      decorator : qx.ui.decoration.Grid,

      style : {
        baseImage : "decoration/tabview/tab-button-top-inactive.png"
      }
    },

    "tabview-page-button-bottom-active" :
    {
      decorator : qx.ui.decoration.Grid,

      style : {
        baseImage : "decoration/tabview/tab-button-bottom-active.png"
      }
    },

    "tabview-page-button-bottom-inactive" :
    {
      decorator : qx.ui.decoration.Grid,

      style : {
        baseImage : "decoration/tabview/tab-button-bottom-inactive.png"
      }
    },

    "tabview-page-button-left-active" :
    {
      decorator : qx.ui.decoration.Grid,

      style : {
        baseImage : "decoration/tabview/tab-button-left-active.png"
      }
    },

    "tabview-page-button-left-inactive" :
    {
      decorator : qx.ui.decoration.Grid,

      style : {
        baseImage : "decoration/tabview/tab-button-left-inactive.png"
      }
    },

    "tabview-page-button-right-active" :
    {
      decorator : qx.ui.decoration.Grid,

      style : {
        baseImage : "decoration/tabview/tab-button-right-active.png"
      }
    },

    "tabview-page-button-right-inactive" :
    {
      decorator : qx.ui.decoration.Grid,

      style : {
        baseImage : "decoration/tabview/tab-button-right-inactive.png"
      }
    },


    // CSS TABVIEW BUTTONS
    "tabview-page-button-top-active-css" :
    {
      decorator : [
        qx.ui.decoration.MBorderRadius,
        qx.ui.decoration.MSingleBorder,
        qx.ui.decoration.MBackgroundColor,
        qx.ui.decoration.MBoxShadow
      ],

      style : {
        radius : [3, 3, 0, 0],
        width: [1, 1, 0, 1],
        color: "tabview-background",
        backgroundColor : "tabview-start",
        shadowLength: 1,
        shadowColor: "shadow",
        shadowBlurRadius: 2
      }
    },

    "tabview-page-button-top-inactive-css" :
    {
      decorator : [
        qx.ui.decoration.MBorderRadius,
        qx.ui.decoration.MSingleBorder,
        qx.ui.decoration.MLinearBackgroundGradient
      ],

      style : {
        radius : [3, 3, 0, 0],
        color: "tabview-inactive",
        colorBottom : "tabview-background",
        width: 1,
        gradientStart : ["tabview-inactive-start", 0],
        gradientEnd : ["tabview-inactive-end", 100]
      }
    },

    "tabview-page-button-bottom-active-css" :
    {
      include : "tabview-page-button-top-active-css",

      style : {
        radius : [0, 0, 3, 3],
        width: [0, 1, 1, 1],
        backgroundColor : "tabview-inactive-start"
      }
    },

    "tabview-page-button-bottom-inactive-css" :
    {
      include : "tabview-page-button-top-inactive-css",

      style : {
        radius : [0, 0, 3, 3],
        width: [0, 1, 1, 1],
        colorBottom : "tabview-inactive",
        colorTop : "tabview-background"
      }
    },

    "tabview-page-button-left-active-css" :
    {
      include : "tabview-page-button-top-active-css",

      style : {
        radius : [3, 0, 0, 3],
        width: [1, 0, 1, 1],
        shadowLength: 0,
        shadowBlurRadius: 0
      }
    },

    "tabview-page-button-left-inactive-css" :
    {
      include : "tabview-page-button-top-inactive-css",

      style : {
        radius : [3, 0, 0, 3],
        width: [1, 0, 1, 1],
        colorBottom : "tabview-inactive",
        colorRight : "tabview-background"
      }
    },

    "tabview-page-button-right-active-css" :
    {
      include : "tabview-page-button-top-active-css",

      style : {
        radius : [0, 3, 3, 0],
        width: [1, 1, 1, 0],
        shadowLength: 0,
        shadowBlurRadius: 0
      }
    },

    "tabview-page-button-right-inactive-css" :
    {
      include : "tabview-page-button-top-inactive-css",

      style : {
        radius : [0, 3, 3, 0],
        width: [1, 1, 1, 0],
        colorBottom : "tabview-inactive",
        colorLeft : "tabview-background"
      }
    },





    /*
    ---------------------------------------------------------------------------
      SPLITPANE
    ---------------------------------------------------------------------------
    */

    "splitpane" :
    {
      decorator : qx.ui.decoration.Uniform,

      style :
      {
        backgroundColor : "background-pane",

        width : 3,
        color : "background-splitpane",
        style : "solid"
      }
    },





    /*
    ---------------------------------------------------------------------------
      WINDOW
    ---------------------------------------------------------------------------
    */

    "window" :
    {
      decorator: qx.ui.decoration.Single,

      style :
      {
        backgroundColor : "background-pane",

        width : 1,
        color : "border-main",
        widthTop : 0
      }
    },

    "window-captionbar-active" :
    {
      decorator : qx.ui.decoration.Grid,

      style : {
        baseImage : "decoration/window/captionbar-active.png"
      }
    },

    "window-captionbar-inactive" :
    {
      decorator : qx.ui.decoration.Grid,

      style : {
        baseImage : "decoration/window/captionbar-inactive.png"
      }
    },

    "window-statusbar" :
    {
      decorator : qx.ui.decoration.Grid,

      style : {
        baseImage : "decoration/window/statusbar.png"
      }
    },


    // CSS WINDOW
    "window-css" : {
      decorator : [
        qx.ui.decoration.MBorderRadius,
        qx.ui.decoration.MBoxShadow,
        qx.ui.decoration.MSingleBorder
      ],
      style : {
        radius : [5, 5, 0, 0],
        shadowBlurRadius : 4,
        shadowLength : 2,
        shadowColor : "shadow"
      }
    },

    "window-incl-statusbar-css" : {
       include : "window-css",
       style : {
         radius : [5, 5, 5, 5]
       }
    },

    "window-captionbar-active-css" : {
      decorator : [
        qx.ui.decoration.MSingleBorder,
        qx.ui.decoration.MBorderRadius,
        qx.ui.decoration.MLinearBackgroundGradient
      ],
      style : {
        width : 1,
        color : "window-border",
        colorBottom : "window-border-caption",
        radius : [5, 5, 0, 0],
        gradientStart : ["window-caption-active-start", 30],
        gradientEnd : ["window-caption-active-end", 70]
      }
    },

    "window-captionbar-inactive-css" : {
      include : "window-captionbar-active-css",
      style : {
        gradientStart : ["window-caption-inactive-start", 30],
        gradientEnd : ["window-caption-inactive-end", 70]
      }
    },

    "window-statusbar-css" :
    {
      decorator : [
        qx.ui.decoration.MBackgroundColor,
        qx.ui.decoration.MSingleBorder,
        qx.ui.decoration.MBorderRadius
      ],

      style : {
        backgroundColor : "window-statusbar-background",
        width: [0, 1, 1, 1],
        color: "window-border",
        radius : [0, 0, 5, 5]
      }
    },

    "window-pane-css" :
    {
      decorator: [
        qx.ui.decoration.MSingleBorder,
        qx.ui.decoration.MBackgroundColor
      ],

      style :
      {
        backgroundColor : "background-pane",
        width : 1,
        color : "window-border",
        widthTop : 0
      }
    },



    /*
    ---------------------------------------------------------------------------
      TABLE
    ---------------------------------------------------------------------------
    */

    "table" :
    {
      decorator : qx.ui.decoration.Single,

      style :
      {
        width : 1,
        color : "border-main",
        style : "solid"
      }
    },

    "table-statusbar" :
    {
      decorator : qx.ui.decoration.Single,

      style :
      {
        widthTop : 1,
        colorTop : "border-main",
        style    : "solid"
      }
    },

    "table-scroller-header" :
    {
      decorator : qx.ui.decoration.Single,

      style :
      {
        backgroundImage  : "decoration/table/header-cell.png",
        backgroundRepeat : "scale",

        widthBottom : 1,
        colorBottom : "border-main",
        style       : "solid"
      }
    },

    "table-scroller-header-css" :
    {
      decorator : [
        qx.ui.decoration.MSingleBorder,
        qx.ui.decoration.MLinearBackgroundGradient
      ],

      style :
      {
        gradientStart : ["table-header-start", 10],
        gradientEnd : ["table-header-end", 90],

        widthBottom : 1,
        colorBottom : "border-main"
      }
    },

    "table-header-cell" :
    {
      decorator :  qx.ui.decoration.Single,

      style :
      {
        widthRight : 1,
        colorRight : "border-separator",
        styleRight : "solid"
      }
    },


    "table-header-cell-hovered" :
    {
      decorator :  qx.ui.decoration.Single,

      style :
      {
        widthRight : 1,
        colorRight : "border-separator",
        styleRight : "solid",

        widthBottom : 1,
        colorBottom : "table-header-hovered",
        styleBottom : "solid"
      }
    },

    "table-scroller-focus-indicator" :
    {
      decorator : qx.ui.decoration.Single,

      style :
      {
        width : 2,
        color : "table-focus-indicator",
        style : "solid"
      }
    },





    /*
    ---------------------------------------------------------------------------
      PROGRESSIVE
    ---------------------------------------------------------------------------
    */

    "progressive-table-header" :
    {
       decorator : qx.ui.decoration.Single,

       style :
       {
         width       : 1,
         color       : "border-main",
         style       : "solid"
       }
    },

    "progressive-table-header-cell" :
    {
      decorator :  qx.ui.decoration.Single,

      style :
      {
        backgroundImage  : "decoration/table/header-cell.png",
        backgroundRepeat : "scale",

        widthRight : 1,
        colorRight : "progressive-table-header-border-right",
        style      : "solid"
      }
    },

    "progressive-table-header-cell-css" :
    {
      decorator :  [
        qx.ui.decoration.MSingleBorder,
        qx.ui.decoration.MLinearBackgroundGradient
      ],

      style :
      {
        gradientStart : ["table-header-start", 10],
        gradientEnd : ["table-header-end", 90],

        widthRight : 1,
        colorRight : "progressive-table-header-border-right"
      }
    },


    /*
    ---------------------------------------------------------------------------
      MENU
    ---------------------------------------------------------------------------
    */

    "menu" :
    {
      decorator : qx.ui.decoration.Single,

      style :
      {
        backgroundImage  : "decoration/menu/background.png",
        backgroundRepeat : "scale",

        width : 1,
        color : "border-main",
        style : "solid"
      }
    },

    "menu-css" : {
      decorator : [
        qx.ui.decoration.MLinearBackgroundGradient,
        qx.ui.decoration.MBoxShadow,
        qx.ui.decoration.MSingleBorder
      ],
      style : {
        gradientStart : ["menu-start", 0],
        gradientEnd : ["menu-end", 100],
        shadowColor : "shadow",
        shadowBlurRadius : 2,
        shadowLength : 1,
        width : 1,
        color : "border-main"
      }
    },

    "menu-separator" :
    {
      decorator :  qx.ui.decoration.Single,

      style :
      {
        widthTop    : 1,
        colorTop    : "menu-separator-top",

        widthBottom : 1,
        colorBottom : "menu-separator-bottom"
      }
    },


    /*
    ---------------------------------------------------------------------------
      MENU BAR
    ---------------------------------------------------------------------------
    */

    "menubar" :
    {
      decorator : qx.ui.decoration.Single,

      style :
      {
        backgroundImage  : "decoration/menu/bar-background.png",
        backgroundRepeat : "scale",

        width : 1,
        color : "border-separator",
        style : "solid"
      }
    },

    "menubar-css" :
    {
      decorator : [
        qx.ui.decoration.MSingleBorder,
        qx.ui.decoration.MLinearBackgroundGradient
      ],

      style :
      {
        gradientStart : ["menubar-start", 0],
        gradientEnd : ["menu-end", 100],

        width : 1,
        color : "border-separator"
      }
    },

    /*
    ---------------------------------------------------------------------------
      APPLICATION
    ---------------------------------------------------------------------------
    */

    "app-header":
    {
      decorator : qx.ui.decoration.Background,

      style :
      {
        backgroundImage : "decoration/app-header.png",
        backgroundRepeat : "scale"
      }

    },

    /*
    ---------------------------------------------------------------------------
      PROGRESSBAR
    ---------------------------------------------------------------------------
    */

    "progressbar" :
    {
      decorator: qx.ui.decoration.Single,

      style:
      {
        width: 1,
        color: "border-input"
      }
    },

    /*
    ---------------------------------------------------------------------------
      VIRTUAL WIDGETS
    ---------------------------------------------------------------------------
    */

    "group-item" :
    {
      decorator : qx.ui.decoration.Background,

      style :
      {
        backgroundImage  : "decoration/group-item.png",
        backgroundRepeat : "scale"
      }
    },

    "group-item-css" :
    {
      decorator : [
        qx.ui.decoration.MLinearBackgroundGradient
      ],

      style :
      {
        startColorPosition : 0,
        endColorPosition : 100,
        startColor : "groupitem-start",
        endColor : "groupitem-end"
      }
    }
  }
});
