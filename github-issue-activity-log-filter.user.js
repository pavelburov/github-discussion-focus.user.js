// ==UserScript==
// @name github issue activity log filter
// @namespace pavelburov
// @version 1.0.0
// @match https://github.com/*/issues/*
// @match https://github.com/*/pull/*
// @description Allows to configure what to hide/show in github issue activity log and focus on things you really needed.
// @source TODO
// @author Pavel Burov <burovpavel@gmail.com>
// @require http://ajax.googleapis.com/ajax/libs/jquery/1.7.2/jquery.min.js
// @require https://openuserjs.org/src/libs/sizzle/GM_config.js
// @grant GM_getValue
// @grant GM_setValue
// @grant GM_registerMenuCommand
// ==/UserScript==

/*

Allows to configure what to hide/show in github issue activity log and focus on things you really needed.
Use tampermonkey menu to configure (refresh page F5 after configuration changes)

Supported types:
# assignment
discussion-item-assigned
discussion-item-unassigned

# labels
discussion-item-labeled
discussion-item-unlabeled

# project
discussion-item-added_to_project
discussion-item-removed_from_project
discussion-item-moved_columns_in_project

# commits
discussion-commits

# milestone
discussion-item-milestoned
discussion-item-demilestoned

# review
discussion-item-review_requested
discussion-item-review_request_removed

# comment
discussion-item-comment_deleted

# other
discussion-item-renamed

*/

const discussionItemTypes = [
  'discussion-item-assigned',
  'discussion-item-unassigned',
  'discussion-item-labeled',
  'discussion-item-unlabeled',
  'discussion-item-added_to_project',
  'discussion-item-removed_from_project',
  'discussion-item-moved_columns_in_project',
  'discussion-commits',
  'discussion-item-milestoned',
  'discussion-item-demilestoned',
  'discussion-item-review_requested',
  'discussion-item-review_request_removed',
  'discussion-item-comment_deleted',
  'discussion-item-renamed',
];

const createConfigItem = function(name) {
  var label = name.replace('discussion-item-', '');

  return {
    'label': label,
    'type': 'checkbox',
    'default': true
  }
};

var configFields = {};

discussionItemTypes.forEach(function(element) {
  configFields[element] = createConfigItem(element);
});

GM_config.init({
  'id': 'githubActivityLogConfig',
  'fields': configFields
});


function openConfiguration() {
  GM_config.open();
}

GM_registerMenuCommand("Configure", openConfiguration);

var applyConfig = function(type) {
  var configValue = GM_config.get(type);
  var discussionItems = $('.discussion-item.' + type);

  if (configValue) {
    discussionItems.show();
  } else {
    discussionItems.hide();
  }
};

(function() {
  'use strict';

  discussionItemTypes.forEach(function(element) {
    applyConfig(element);
  });

})();