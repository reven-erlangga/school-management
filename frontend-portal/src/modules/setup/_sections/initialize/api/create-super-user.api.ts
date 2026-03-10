import { api } from "@utils/api.util";
import type { SuperuserFormData } from '../stores/superuser-form.store';

export const createSuperUserApi = (data: SuperuserFormData) => {
    return api.post('/users/super-admin', data);
};
