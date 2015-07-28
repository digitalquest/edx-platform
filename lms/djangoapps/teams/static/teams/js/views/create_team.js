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

                   this.headerModel = new HeaderModel({
                       description: gettext("Create a new team if you can't find existing teams to join, or if you would like to learn with friends you know."),
                       title: gettext("Create a New Team"),
                       breadcrumbs: [{title: options.teamParams.topicName, url: options.teamParams.href}]
                   });

                   this.headerView = new HeaderView({
                       model: this.headerModel,

                       // As per my understanding we don't need this(`events`) but for
                       // whatever reason click on breadcrumb link is not working without this
                       events: {
                           'click nav.breadcrumbs a.nav-item': function () {
                               Backbone.history.navigate('', {trigger: true});
                           }
                       }
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
               }
           });
       });
}).call(this, define || RequireJS.define);
