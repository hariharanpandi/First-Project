export interface VerifyConnection {
    data: {
        provider: string;
        apikey: string;
        apisecret: string;
        project_id: string;
        project_name: string;
    };

    queryparams: string;

}