import { api } from "@utils/api.util";

export const uploadConfigurationFileApi = (group: string, file: File, type: 'logo' | 'favicon') => {
    const formData = new FormData();
    formData.append('file', file);
    
    return api.post(`/settings/${group}/upload/${type}`, formData);
};
