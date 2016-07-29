"use strict";
/*
 * ooiui/static/js/views/aa/StatusAlertTableView.js
 */

 var StatusAlertTableView = Backbone.View.extend({
  bindings: {
  },
  events: {
  },
  initialize: function() {
    _.bindAll(this, "render");
    this.initialRender();
  },
  initialRender:function(){
    this.$el.html('<i class="fa fa-spinner fa-spin" style="margin-top:50px;margin-left:50%;font-size:90px;color:#337ab7;"> </i>');
  },
  template: JST['ooiui/static/js/partials/StatusAlert.html'],
  deselectAll:function(){

    this.filter.searchBox().val("");
    this.filter.search();

    this.pageableGrid.clearSelectedModels();

    this.pageableGrid.collection.each(function (model, i) {
      model.trigger("backgrid:select", model, false);
    });

  },
  render:function(options){
    var self = this;

    this.$el.html(this.template());

    var PageableModels = Backbone.PageableCollection.extend({
      model: StatusAlertModel,
      state: {
        pageSize: 20
      },
      mode: "client" // page entirely on the client side
    });

    var pageableCollection = new PageableModels(),
        longName;
    self.collection.each(function(model,i){
        longName = model.get('longName');
        if (_.isUndefined(model.get('longName')) || _.isNull(model.get('longName'))) {
            if (_.isUndefined(model.get('name')) || _.isNull(model.get('name')) || model.get('name') === "") {
                longName = model.get('reference_designator');
            } else {
                longName = model.get('name');
            }
        }
      if (_.isUndefined(model.get('instrumentClass')) || _.isNull(model.get('instrumentClass'))) {
        model.set('instrumentClass', 'undefined')
      }
      if (_.isUndefined(model.get('owner')) || _.isNull(model.get('owner'))) {
        model.set('owner', 'undefined')
      }
      model.set('longName', longName);

      try {
        if(!_.isUndefined(model)){
          pageableCollection.add(model)
        }
      }
      catch(ex) {
        console.log(ex);
        console.log(model);
        console.log(i);
      }
    });


    var ClickableRow = Backgrid.Row.extend({
      events: {
        "click": "onClick",
      },
      onClick: function (ev) {
        if ($(ev.target.parentElement).hasClass('selected')){
          this.model.trigger("backgrid:select", this.model,false);
          ooi.trigger('statusTable:rowDeselected',this.model);
        }else{
          this.model.trigger("backgrid:select", this.model,true);
          ooi.trigger('statusTable:rowSelected',this.model);
        }
      }
    });

    var HtmlCell = Backgrid.HtmlCell = Backgrid.Cell.extend({
      className: "html-cell",
      initialize: function () {
        Backgrid.Cell.prototype.initialize.apply(this, arguments);
      },
      render: function () {
        this.$el.empty();
        var rawValue = this.model.get(this.column.get("name"));
        var formattedValue = this.formatter.fromRaw(rawValue, this.model);
        this.$el.append(formattedValue);
        this.delegateEvents();
        return this;
      }
    });

    var columns = [
      {
        name: "Quick View",
        cell: "select-row",
        editable: false,
        headerCell: "select-all"
      },
      {
        name: "longName",
        label: "Name",
        cell: "string",
        editable: false,
      },
      {
        name: "asset_type",
        label: "Asset Type",
        cell: "string",
        editable: false,
      },
      {
        name: "count",
        label: "Message Count",
        cell: "integer",
        editable: false,
      },
      {
        name: "event_type",
        editable: false,
        label: "Event Type",
        cell: HtmlCell,
        formatter: _.extend({}, Backgrid.Cell.prototype, {
          fromRaw: function (rawValue, model) {
            //console.log(rawValue);
            //place holder right now for triggered events
            if(rawValue == "alert"){
              //return "Active";
              return "<i id='event_type_def' style='font-size:20px;padding-right: 0px;color:orange;' class='fa fa-circle'> Alert</i>";
            }
            else if(rawValue == "alarm"){
              //return "Disabled";
              return "<i id='event_type_def' style='font-size:20px;padding-right: 0px;color:red;' class='fa fa-circle'> Alarm</i>";
            }
            else if(rawValue == "inactive"){
              //return "Disabled";
              return "<i id='event_type_def' style='font-size:20px;padding-right: 0px;color:steelblue;' class='fa fa-circle'> Healthy</i>";
            }
            else if(rawValue == "unknown"){
              //return "Disabled";
              return "<i id='event_type_def' style='font-size:20px;padding-right: 0px;color:gray;' class='fa fa-circle'> Unknown</i>";
            }
          }
        })
      }
      ];

    // Initialize a new Grid instance
    /*
    var grid = new Backgrid.Grid({
      row: FocusableRow,
      columns: columns,
      collection: self.collection
    });
    */

    // Set up a grid to use the pageable collection
    self.pageableGrid = new Backgrid.Grid({
      row: ClickableRow,
      columns: columns,
      collection: pageableCollection
    });

    // Initialize the paginator
    var paginator = new Backgrid.Extension.Paginator({
      collection: pageableCollection
    });

    var nameClientFilter = Backgrid.Extension.ClientSideFilter.extend({
      makeMatcher: function(query){
        var q = query;
        return function (model) {
            try {
                var toFilter = (_.uniq(model.get('longName').toLowerCase().split(' '))).join(' ');
                var keys = _.uniq(query.toLowerCase().split(' '));
                var valid = true;

                if (query.length > 1){
                  _.each(keys,function(key){
                    if (valid){
                      var idx = toFilter.indexOf(key);
                      if (idx == -1){
                        valid = false;
                      }
                    }
                  });
                }
                //console.log(toFilter,keys,valid)
                return valid;
            } catch(e) {
                //console.log(e);
                return false;
            }
        };
      }
    });

    self.filter = new nameClientFilter({
      collection: pageableCollection,
      placeholder: "Search...",
      fields: ['longName'],
      wait: 150
    });

    // Render the filter
    this.$el.find("#sampleTable").before(self.filter.render().el);

    // Add some space to the filter and move it to the right
    $(self.filter.el).css({float: "right", margin: "20px", "margin-top": "5px"});

    // Render the paginator
    this.$el.find("#sampleTable").before(paginator.render().el);

    // Render the grid and attach the root to your HTML document
    this.$el.find("#sampleTable").append(self.pageableGrid.render().el);

    this.$el.find('#sampleTable > table > thead > tr > th.select-all-header-cell').css('visibility','hidden');

    }
});

