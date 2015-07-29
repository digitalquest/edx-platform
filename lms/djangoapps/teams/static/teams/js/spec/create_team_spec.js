define([
    'jquery',
    'backbone',
    'common/js/spec_helpers/ajax_helpers',
    'teams/js/views/create_team'
], function ($, Backbone, AjaxHelpers, CreateTeamView) {
    'use strict';

    describe('CreateTeam', function () {
        var createTeamView,
            expectContent = function (selector, text) {
                expect(createTeamView.$(selector).text().trim()).toBe(text);
            },
            verifyDropdownData = function (selector, expectedItems) {
                var options = createTeamView.$(selector)[0].options;
                var renderedItems = $.map(options, function( elem ) {
                    return [[elem.value, elem.text]];
                });
                for (var i = 0; i < expectedItems.length; i++) {
                    expect(renderedItems).toContain(expectedItems[i]);
                }
            };

        beforeEach(function () {
            setFixtures('<div class="teams-content"></div>');
            createTeamView = new CreateTeamView({
                el: $('.teams-content'),
                teamParams: {
                    topicName: 'Awesomeness',
                    languages: [['a', 'aaa'], ['b', 'bbb']],
                    countries: [['c', 'ccc'], ['d', 'ddd']]
                }
            }).render();
        });

        it('can render itself correctly', function () {
            expectContent('.page-header-main .breadcrumbs a', "Awesomeness");
            expectContent('.page-header-main .page-title', "Create a New Team");
            var pageDescriptionText = "Create a new team if you can't find existing teams to join, " +
                "or if you would like to learn with friends you know.";
            expectContent('.page-header-main .page-description', pageDescriptionText);
            expectContent('.u-field-name .u-field-title', "Team Name (Required) *");
            expectContent(
                '.u-field-name .u-field-message-help', "A name that identifies your team (maximum 255 characters)."
            );
            expectContent('.u-field-description .u-field-title', "Team Description (Required) *");
            var descriptionFieldMessage = "A short description of the team to help other learners understand " +
                "the goals or direction of the team (maximum 300 characters).";
            expectContent('.u-field-description-message', descriptionFieldMessage);
            expectContent('.u-field-optional_description .u-field-title', "Optional Characteristics");
            var optionalDescriptionMessage = "Help other learners decide whether to join your team by specifying " +
                "some characteristics for your team. Choose carefully, because fewer people might be interested in " +
                "joining your team if it seems too restrictive. You cannot change these characteristics after you " +
                "create the team.";
            expectContent('.u-field-optional_description .u-field-message-help', optionalDescriptionMessage);
            expectContent('.u-field-language .u-field-title', "Language");
            expectContent(
                '.u-field-language .u-field-message-help',
                "The language that team members primarily use to communicate with each other."
            );
            expectContent('.u-field-country .u-field-title', "Country");
            expectContent(
                '.u-field-country .u-field-message-help', "The country that team members primarily identify with."
            );

            verifyDropdownData('.u-field-language select', [['a', 'aaa'], ['b', 'bbb']]);
            verifyDropdownData('.u-field-country select', [['c', 'ccc'], ['d', 'ddd']]);

            expect(createTeamView.$('.create-team.form-actions .action-primary').length).toBe(1);
            expect(createTeamView.$('.create-team.form-actions .action-cancel').length).toBe(1);
        });
    });
});
