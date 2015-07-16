;(function (define) {
'use strict';

define(['backbone',
        'underscore',
        'gettext',
        'js/views/fields',
        'teams/js/models/team',
        'text!teams/templates/edit-team.underscore'],
       function (Backbone, _, gettext, FieldViews, TeamModel, edit_team_template) {
           return Backbone.View.extend({

               maxTeamNameLength: 255,

               initialize: function(options) {
                   this.courseId = options.teamParams.courseId;
                   this.teamsUrl = options.teamParams.teamsUrl;
                   this.topicId = options.teamParams.topicId;
                   this.topicName = options.teamParams.topicName;
                   this.languages = options.teamParams.languages;
                   this.countries = options.teamParams.countries;

                   this.eventAggregator = options.eventAggregator;
                   _.bindAll(this, "cancelTeam", "createTeam");
                   this.eventAggregator.bind("cancelTeam", this.cancelTeam);
                   this.eventAggregator.bind("createTeam", this.createTeam);

                   this.teamNameField = new FieldViews.TextFieldView({
                       model: new TeamModel(),
                       title: gettext("Team Name (Required) *"),
                       valueAttribute: 'name',
                       bindEvents: false,
                       helpMessage: gettext("The name that will identify your team")
                   });

                   this.teamDescriptionField = new FieldViews.TextareaFieldView({
                       model: new TeamModel(),
                       title: gettext("Team Description (Required) *"),
                       valueAttribute: 'description',
                       editable: 'always',
                       showMessages: false,
                       bindEvents: false,
                       descriptionMessage: gettext("A short description of the team to help other students understand the goals or directives the team is pursuing")
                   });

                   this.optionalDescriptionField = new FieldViews.ReadonlyFieldView({
                       model: new TeamModel(),
                       title: gettext("Optional Characteristics"),
                       valueAttribute: 'optional_description',
                       helpMessage: gettext("You can help students find your team by specifying your team's characteristics. The more limitations you add, the fewer students may be interested in joining your group, so choose carefully!")
                   });

                   this.teamLanguageField = new FieldViews.DropdownFieldView({
                       model: new TeamModel(),
                       title: gettext("Language"),
                       valueAttribute: 'language',
                       required: false,
                       showMessages: false,
                       bindEvents: false,
                       titleIconName: 'fa-comment-o',
                       options: this.languages,
                       helpMessage: gettext("The primary language of the team")
                   });

                   this.teamCountryField = new FieldViews.DropdownFieldView({
                       model: new TeamModel(),
                       title: gettext('Country'),
                       valueAttribute: 'country',
                       required: false,
                       showMessages: false,
                       bindEvents: false,
                       titleIconName: 'fa-globe',
                       options: this.countries,
                       helpMessage: gettext("The primary country of the team")
                   });
               },

               render: function() {
                   this.$el.html(_.template(edit_team_template)({topicName: gettext(this.topicName)}));
                   this.set(this.teamNameField, '.team-required-fields');
                   this.set(this.teamDescriptionField, '.team-required-fields');
                   this.set(this.optionalDescriptionField, '.team-optional-fields');
                   this.set(this.teamLanguageField, '.team-optional-fields');
                   this.set(this.teamCountryField, '.team-optional-fields');
                   return this;
               },

               set: function(view, selector) {
                   this.$el.find(selector).append(view.$el);
                   view.render();
               },

               createTeam: function () {
                   var teamName = this.teamNameField.fieldValue();
                   var teamDescription = this.teamDescriptionField.fieldValue();
                   var teamLanguage = this.teamLanguageField.fieldValue();
                   var teamCountry = this.teamCountryField.fieldValue();

                   var validation = this.validateTeamData(teamName, teamDescription);
                   if (validation.status === false) {
                       this.showMessage(validation.message);
                       return;
                   }

                   var data = {
                       course_id: this.courseId,
                       topic_id: this.topicId,
                       name: teamName,
                       description: teamDescription,
                       language: _.isNull(teamLanguage) ? '' : teamLanguage,
                       country: _.isNull(teamCountry) ? '' : teamCountry
                   };

                   // Send AJAX request to Teams API
                   var view = this;
                   $.ajax({
                       type: 'POST',
                       url: this.teamsUrl,
                       data: data
                   }).done(function () {
                       Backbone.history.loadUrl(Backbone.history.fragment);
                   }).fail(function (jqXHR) {
                       view.showMessage(gettext('An error occurred. Please try again.'));
                   });
               },

               validateTeamData: function (teamName, teamDescription) {
                   var status = true,
                       message = gettext("We couldn't create your team because something needs to be fixed below.");

                   this.teamNameField.unhighlightField();
                   this.teamDescriptionField.unhighlightField();

                   if (_.isEmpty(teamName.trim()) ) {
                       status = false;
                       this.teamNameField.highlightFieldOnError();
                   } else if (teamName.length > this.maxTeamNameLength) {
                       status = false;
                       message = gettext("Invalid field value. Ensure this value has at most 255 characters");
                       this.teamNameField.highlightFieldOnError();
                   }

                   if (_.isEmpty(teamDescription.trim()) ) {
                       status = false;
                       this.teamDescriptionField.highlightFieldOnError();
                   }

                   return {
                       status: status,
                       message: message
                   };
               },

               showMessage: function (message) {
                   this.$('.wrapper-msg').show();
                   this.$('.msg-content .copy p').text(message);
               },

               cancelTeam: function () {
                   Backbone.history.loadUrl(Backbone.history.fragment);
               }
           });
       });
}).call(this, define || RequireJS.define);
