// ==UserScript==
// @name github discussion focus
// @namespace pavelburov
// @version 2.0.0
// @match https://github.com/*/issues/*
// @match https://github.com/*/pull/*
// @description Allows to configure what to show/hide in github issue activity log and focus on things you really needed.
// @source https://github.com/pavelburov/github-discussion-focus.user.js/raw/master/github-discussion-focus.user.js
// @author Pavel Burov <burovpavel@gmail.com>
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// ==/UserScript==

/*

Allows to configure what to show/hide in github issue activity log and focus on things you really needed.
Use tampermonkey menu to configure (refresh page F5 after configuration changes)

*/

/*

Definition object structure:
* id - unique id and github icon name
* label - text to show on configuration UI

*/
const discussionItemsDefinitions = [
  { id: 'person', label: 'assigned, unassigned' },
  { id: 'tag', label: 'labeled, unlabeled' },
  { id: 'project', label: 'added_to_project, removed_from_project, moved_columns_in_project' },
  { id: 'milestone', label: 'milestoned, demilestoned' },
  { id: 'eye', label: 'review_requested, review_request_removed' },
  { id: 'pencil', label: 'renamed' },
  { id: 'bookmark', label: 'referenced' },
  // 'discussion-commits',
  // 'discussion-item-comment_deleted',
];

const createConfigItem = function(label) {
  return {
    'label': label,
    'type': 'checkbox',
    'default': true
  }
};

var configFields = {};

discussionItemsDefinitions.forEach(function(element) {
  configFields[element.id] = createConfigItem(element.label);
});

GM_config.init({
  'id': 'githubDiscussionFocusConfig',
  'fields': configFields
});


function openConfiguration() {
  GM_config.open();
}

GM_registerMenuCommand("Configure", openConfiguration);

var applyConfig = function(obj) {
  var configValue = GM_config.get(obj.id);
  var svgSelector = "svg.octicon-" + obj.id;

  var discussionItems = $(svgSelector).closest(".TimelineItem-badge").closest(".TimelineItem");

  if (configValue) {
    discussionItems.show();
  } else {
    discussionItems.hide();
  }
};

(function() {
  'use strict';

  discussionItemsDefinitions.forEach(function(element) {
    applyConfig(element);
  });

})();
