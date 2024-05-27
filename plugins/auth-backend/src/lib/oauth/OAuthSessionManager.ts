/*
 * Copyright 2024 The Backstage Authors
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

import { JsonObject } from '@backstage/types';
import { Knex } from 'knex';
import { v4 as uuid } from 'uuid';

type Session = {};

type SessionDbRow = { sid: string; user: string; session: JsonObject };

export interface OAuthSessionManager {
  getSession(userRef: string): Promise<Session | undefined>;

  deleteSession(userRef: string): Promise<void>;

  updateSession(userRef: string, session: Session): Promise<void>;
}

export default class DefaultOAuthSessionManager implements OAuthSessionManager {
  private tableName = 'oauth_sessions';
  private readonly queryBuilder;

  constructor(private readonly client: Knex) {
    this.queryBuilder = this.client<SessionDbRow>(this.tableName);
  }

  public async getSession(userRef: string): Promise<Session | undefined> {
    const items = await this.queryBuilder.where({ user: userRef }).select();

    if (!items.length) {
      return undefined;
    }
    return items[0].session;
  }

  public async deleteSession(userRef: Session): Promise<void> {
    await this.queryBuilder.delete('user', userRef);
  }

  public async updateSession(userRef: string, session: Session): Promise<void> {
    await this.client.transaction(async tx => {
      const currentSession = await this.getSession(userRef);
      if (!currentSession) {
        await tx(this.tableName).insert({
          sid: uuid(),
          session,
          user: userRef,
        });
      } else {
        await tx(this.tableName)
          .update({
            session,
          })
          .where({ user: userRef });
      }
    });
  }
}
