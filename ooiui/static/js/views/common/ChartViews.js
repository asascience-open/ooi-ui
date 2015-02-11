"use strict";
/*
 * ooiui/static/js/views/common/ChartViews.js
 * View definitions for charts
 *
 * Dependencies
 * Partials
 * - ooiui/static/js/partials/Chart.html
 * Libs
 * - ooiui/static/lib/underscore/underscore.js
 * - ooiui/static/lib/backbone/backbone.js
 * - ooiui/static/js/ooi.js
 *
 * Usage
 */


var ChartViews = Backbone.View.extend({
  el: '.content',
  events: {
    'click button#add': 'addChart',
    'keypress #title': 'createOnEnter'
  },

  initialize: function(options){
    _.bindAll(this, 'render', 'addChart', 'appendChart', 'filterAll');

    this.$title_input = this.$el.find('#title');
    this.$type_input = this.$el.find('#type');

  
    this.collection = new Charts();
    //when one is added do the append chart function
    this.collection.bind('add', this.appendChart);

    this.listenTo(this.collection, 'filter', this.filterAll);
    if(options && options.title && options.type) {
      this.render();
      this.$title_input.val(options.title);
      this.$type_input.val(options.type);
      this.addChart();
      return;
    }

    this.render();
  },

  render: function(){

    // fill type select with types from collection
    _(this.collection.types).each(function(type){
      var text = type.replace(/([A-Z]+)*([A-Z][a-z])/g,"$1 $2");//readable name
      $('#type', this.$el).append(this.templates.type_template({
        value: type,
        text: text
      }));
    }, this);

    // do the same with the filters
    _(['AllChart'].concat(this.collection.types)).each(function(type){
      var text = type.replace(/([A-Z]+)*([A-Z][a-z])/g,"$1 $2");
      $('.filters ul', this.$el).append(this.templates.filter_template({
        link: type + 's',
        text: text + 's'
      }));
    }, this);

    // bold 'All Charts' filter link
    this.$('.filters li a[href="#/AllCharts"]').addClass('selected');


    // render charts
    /*
    _(this.collection.models).each(function(chart){
      this.appendChart(chart);
    }, this);
    */


  },
  templates: { 
    type_template: JST['ooiui/static/js/partials/ChartTypeTemplate.html'],
    filter_template: JST['ooiui/static/js/partials/ChartFilterTemplate.html']
  },
  addChart: function(){
    var chart = new Chart({
      title: this.$title_input.val().trim() || null, // use default if empty
      type: this.$type_input.val()
    });        

    //add the loading class    
    var instrument = $('#plotInstrument').text()
    var stream = $('#plotStream').text()
    var field = $('#plotFieldStream').text()

    console.log(instrument,stream)

    chart.url = chart.url+"instrument="+instrument+"&stream="+stream + "&field=" + field
    chart.fetch()
    this.collection.add(chart);

    //this.appendChart(chart);

    this.$title_input.val(''); //reset input
  },

  createOnEnter: function(e) {
    if (e.which == 13) this.addChart();
  },

  appendChart: function(chart){
    var chartView = new ChartView({model: chart });
    var chart_elem = chartView.render().el;
    this.$el.find('#chartContainer').addClass("loader")    
    this.$el.find('#chartContainer').append(chart_elem);

    chart_elem.scrollIntoView(false); // scroll to chart, align to bottom
    $(chart_elem).effect("highlight", {}, 1500); // nifty yellow highlight fx
  },

  filterAll: function(filter){
    // bold out selected filter link
    this.$('.filters li a')
      .removeClass('selected')
      .filter('[href="#/' + ( app.filter || '' ) + 's"]')
      .addClass('selected');

    // trigger visibility for each model
    _(this.collection.models).each(function(chart){
      chart.trigger('visible');
    }, this);
  }
  
});

