import { api } from "@utils/api.util";

export const triggerSeederApi = () => {
    return api.post<any>('/seeder/run');
};
