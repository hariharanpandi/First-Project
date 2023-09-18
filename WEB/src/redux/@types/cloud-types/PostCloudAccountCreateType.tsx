export interface CloudAccountCreate {
    data: {
        _id: string,
        _cls: string,
        apikey: string, //** AWS */
        apisecret: string, //** AWS */
        owner: string,
        account_name: string,
        account_type: string, //** AWS */
        access_type: string, 
        environment: string,
        authentication_protocol: string, //** AWS */
        bucket_name: string, //** AWS */
        cost_report_format_fields: string, //** AWS */
        opted_regions: string[], //** AWS */
        key: string, //** AZURE */
        secret: string,  //** AZURE */
        subscription_id: string,  //** AZURE */
        tenant_id: string,  //** AZURE */
        application_id: string,  //** AZURE */
        subscription_type: string,  //** AZURE */

    };

    queryparams: string;

}