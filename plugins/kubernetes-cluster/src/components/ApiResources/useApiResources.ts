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
import useAsync from 'react-use/esm/useAsync';

import { useApi } from '@backstage/core-plugin-api';
import { kubernetesApiRef } from '@backstage/plugin-kubernetes-react';
import type { IAPIGroupList } from '@kubernetes-models/apimachinery/apis/meta/v1';

/**
 * Arguments for useApiResources
 *
 * @public
 */
export interface ApiResourcesOptions {
  clusterName: string;
}

/**
 * Retrieves the logs for the given pod
 *
 * @public
 */
export const useApiResources = ({ clusterName }: ApiResourcesOptions) => {
  const kubernetesApi = useApi(kubernetesApiRef);
  return useAsync(async () => {
    return await kubernetesApi
      .proxy({
        clusterName,
        path: '/apis',
      })
      .then(r => {
        return r.json() as Promise<IAPIGroupList>;
      });
  }, [clusterName]);
};
