;(function (define) {
'use strict';

define(['backbone',
        'underscore',
        'gettext',
        'js/components/header/models/header',
        'js/components/header/views/header',
        'teams/js/views/edit_team'],
       function (Backbone, _, gettext, HeaderModel, HeaderView, TeamEditView) {
           return Backbone.View.extend({
               initialize: function(options) {

                   this.headerView = new HeaderView({
                       model: new HeaderModel({
                           description: gettext("Create a new team if you can't find existing teams to join, or if you would like to learn with friends you know."),
                           title: gettext("Create a New Team"),
                           breadcrumbs: [
                               {
                                   title: options.teamParams.topicName,
                                   url: Backbone.history.location.href.replace(/\/create_new_team\/?/,  '')
                               }
                           ]
                       })
                   });

                   this.editView = new TeamEditView({
                       className: 'create-new-team',
                       teamParams: options.teamParams
                   });
               },

               render: function() {
                   this.$el.html('');
                   this.$el.append(this.headerView.$el);
                   this.headerView.render();
                   this.$el.append(this.editView.$el);
                   this.editView.render();
                   return this;
               }
           });
       });
}).call(this, define || RequireJS.define);
