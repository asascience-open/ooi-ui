"use strict";
/*
* ooiui/static/js/views/common/PlatformStatusView.js
*
* Dependencies
* Libs
* - ooiui/static/lib/underscore/underscore.js
* - ooiui/static/lib/backbone/backbone.js
* - ooiui/static/js/ooi.js
* Models
* - ooiui/static/js/models/common/PlatformStatusModel.js
*
* Usage
*/

/*
 * The OrgSidebarView should be bound to a
 * <div id="sidebar-wrapper" class="navbar-default">. This View will render
 * nav-style links for each organization in the collection passed in as an
 * option.
 */
var PlatformStatusView = Backbone.View.extend({
  // The el will be a <ul> tag
  tagName: 'ul',
  // <ul class="nav sidebar-nav navbar-collapse">
  className: 'nav sidebar-nav navbar-collapse',
  events: {
    'click a' : 'onClick'
  },
  /*
   * When one of the links are clicked we trigger this method which gets the
   * data-id attribute in the tag and publishes a new event org:click with the
   * model_id as the parameter.
   */
  onClick: function(event) {
    //prevent double request
    event.preventDefault();
    // Get the model id from the tag attribute data-id
    var model_id = $(event.target).attr('data-id');
    // Publish a new method org:click with the model_id
    this.render();
    this.selectPlatform(model_id);
  },
  /*
   * During initialization of this view we fetch the collection and render when
   * it's complete.
   */
  initialize: function(options) {
    _.bindAll(this, "render");
    var self = this;
    this.collection.fetch({
      success: function(collection, response, options) {
        console.log('success');
        // If the fetch was successful, then we render
        self.render();
        var refdes = ooi.models.platformStatusModel.get('reference_designator');
        if(refdes && refdes != '' && refdes != null) {
          self.selectPlatform(refdes)
        }
      }
    });
  },
  selectPlatform: function(refdes) {
    this.$el.find("[data-id='" + refdes + "']").parent().toggleClass('selected');
    //ooi.trigger('org:click', refdes);
  },
  template: JST['ooiui/static/js/partials/PlatformStatus.html'],
  render: function() {
    this.$el.html(this.template({collection: this.collection}));
  }
});
