;(function (define) {
'use strict';

define(['backbone',
        'underscore',
        'gettext',
        'text!teams/templates/create-team-actions.underscore'],
       function (Backbone, _, gettext, create_team_actions_template) {
           return Backbone.View.extend({

               events: {
                   "click .action-cancel": "cancelTeam",
                   "click .action-create": "createTeam"
               },

               initialize: function(options) {
                   this.eventAggregator = options.eventAggregator;
               },

               render: function() {
                   this.$el.html(_.template(create_team_actions_template));
                   return this;
               },

               cancelTeam: function () {
                   this.eventAggregator.trigger("cancelTeam");
               },

               createTeam: function () {
                   this.eventAggregator.trigger("createTeam");
               }
           });
       });
}).call(this, define || RequireJS.define);
