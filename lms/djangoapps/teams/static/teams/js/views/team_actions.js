;(function (define) {
    'use strict';
    define([
        'gettext',
        'backbone',
        'text!teams/templates/team-actions.underscore'
    ], function (gettext, Backbone, team_actions_template) {
        return Backbone.View.extend({
            events: {
                'click a.browse-teams': 'browseTeams',
                'click a.search-team-descriptions': 'searchTeamDescriptions',
                'click a.create-team': 'showCreateTeamForm'
            },

            initialize: function (options) {
                this.template = _.template(team_actions_template);
                this.teamParams = options.teamParams;
            },

            render: function () {
                var message = interpolate_text(
                    gettext("Try {browse_all_teams} or {search_team_descriptions}. If you still can't find a team to join, {create_new_team}."),
                    {
                        'browse_all_teams': '<a class="browse-teams" href="">' + gettext("browsing all teams") + '</a>',
                        'search_team_descriptions': '<a class="search-team-descriptions" href="">' + gettext("searching team descriptions") + '</a>',
                        'create_new_team': '<a class="create-team" href="">' + gettext("create a new team in this topic") + '</a>'
                    }
                );
                this.$el.html(this.template({message: message}));
                return this;
            },

            browseTeams: function (event) {
                event.preventDefault();
                Backbone.history.navigate('browse', {trigger: true});
            },

            searchTeamDescriptions: function (event) {
                event.preventDefault();
                // TODO! Will navigate to correct place once required functionality is available
                Backbone.history.navigate('browse', {trigger: true});
            },

            showCreateTeamForm: function (event) {
                event.preventDefault();
                Backbone.history.navigate('topics/' + this.teamParams.topicId + '/create-team', {trigger: true});
            }
        });
    });
}).call(this, define || RequireJS.define);
