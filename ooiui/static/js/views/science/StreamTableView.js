"use strict";
/*
 * ooiui/static/js/views/science/StreamTableView.js
 * View definitions to build a table view of streams
 *
 * Dependencies
 * Partials:
 * - ooiui/static/js/partials/StreamTable.html
 * - ooiui/static/js/partials/StreamTableItem.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 * Usage
 */

var StreamTableView = Backbone.View.extend({
    columns: [
        {
            name : 'plot',
            label : ' '
        },
        {
            name : 'download',
            label : 'Download Data'
        },
        {
            name : 'reference_designator',
            label : 'Reference Designator'
        },
        {
            name : 'stream_name',
            label : 'Stream Identifier'
        },
        {
            name : 'display_name',
            label : 'Stream Description'
        },
        {
            name : 'start',
            label : 'Start Time'
        },
        {
            name : 'end',
            label : 'End Time'
        }
    ],
    tagName: 'tbody',
    initialize: function() {
        _.bindAll(this, "render");
        this.listenTo(this.collection, 'reset', this.render);
        this.collection.on("add", this.addOne, this);
    },
    events: {
        'click th': 'sortBy'
    },
    sortBy: function(event) {
        event.stopPropagation();
        var eTarget = event.target;
        if ( !(eTarget.id.indexOf('plot') > -1 || eTarget.id.indexOf('download') > -1) ) {
            ooi.trigger('StreamTableHeader:sort', eTarget.id.split('-')[1]);
        }
    },
    template: JST['ooiui/static/js/partials/StreamTable.html'],
    render: function() {
        var self = this;
        this.$el.html(this.template({collection: this.collection, columns: this.columns}));
        this.$el.find('th').append('<i class="fa fa-sort-desc"></i>');
        this.$el.find('th#th-plot > i').remove();
        this.$el.find('th#th-download > i').remove();
        this.collection.each(function(model) {
            var streamTableItemView = new StreamTableItemView({
                columns: self.columns,
                model: model
            });
            self.$el.append(streamTableItemView.el);
        });
    }
});

/*
model : StreamModel
*/
var StreamTableItemView = Backbone.View.extend({
    tagName: 'tr',
    attributes: function() {
        "use strict";
        return {
            'valign': 'middle',
            'class': 'stream-row'
        }
    },
    events: {
        'click .download' : 'onDownload',
        'click .plot' : 'onRowClick'
    },
    initialize: function(options) {
        if(options && options.columns) {
            this.columns = options.columns;
        }
        this.listenTo(this.model, 'change', this.render);
        this.render();
    },
    onDownload: function(event) {
        event.stopPropagation();
        event.preventDefault();
        var option = $(event.currentTarget).attr("download-type");
        ooi.trigger('StreamTableItemView:onClick', {model: this.model, selection: option});
    },
    focus: function() {
        console.log("Trying to focus");
        this.$el.addClass('highlight').siblings().removeClass('highlight');
    },
    template: JST['ooiui/static/js/partials/StreamTableItem.html'],
    render: function() {
        var attributes = this.model.toJSON();
        this.$el.html(this.template({attributes: this.attributes, model: this.model, columns: this.columns}));
    },
    onRowClick: function(event) {
        event.stopPropagation();
        ooi.trigger('StreamTableItemView:onRowClick', this);
    },
});
