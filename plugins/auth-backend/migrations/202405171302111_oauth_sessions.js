/*
 * Copyright 2023 The Backstage Authors
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *     http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

/**
 * @param {import('knex').Knex} knex
 */
exports.up = async function up(knex) {
  await knex.schema.createTable('oauth_sessions', table => {
    table.comment('OAuth session data');
    table.string('sid').primary().notNullable().comment('ID of the session');
    table.string('user').notNullable().comment('User Ref');
    table
      .jsonb('session')
      .notNullable()
      .comment('Session data, JSON serialized');
    table.index('sid', 'oauth_sessions_sid_idx');
  });
};

/**
 * @param {import('knex').Knex} knex
 */
exports.down = async function down(knex) {
  await knex.schema.alterTable('oauth_sessions', table => {
    table.dropIndex([], 'oauth_sessions_sid_idx');
  });
  await knex.schema.dropTable('oauth_sessions');
};
