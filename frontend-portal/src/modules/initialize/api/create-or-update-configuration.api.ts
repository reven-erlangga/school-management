import { api } from '../../../utils/api.util';

export interface Configuration {
    id?: string;
    group: string;
    key: string;
    value: any;
}

export const createOrUpdateConfigurationApi = (group: string, dto: Record<string, any>) => {
    return api.post<Configuration[]>(`/settings/${group}`, dto);
};
