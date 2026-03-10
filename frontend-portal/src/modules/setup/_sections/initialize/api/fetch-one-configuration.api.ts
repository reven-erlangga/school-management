import { api } from "@utils/api.util";

export const fetchOneConfigurationApi = (group: string) => {
    return api.get<Record<string, any>>(`/settings/${group}`);
};
