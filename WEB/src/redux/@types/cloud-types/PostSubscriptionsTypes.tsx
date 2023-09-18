export interface Subscriptions {
    data: {
        provider: string;
        tenant_id: string;
        key: string;
        secret: string,
        project_id: string;
        project_name: string;
    };

    queryparams: string;

}