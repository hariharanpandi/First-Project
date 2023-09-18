export const AZURECloudConstant = Object.freeze({
    CLOUD: {
        ON_BOARDING: [
            {
                label: 'Access Type',
                fieldtype: 'dropdown',
                name: 'access_type',
                options: [
                    { label: 'Access', value: 'Access' },
                    { label: 'Access + Governance', value: 'Access + Governance' },
                ],
            },
            {
                label: 'Azure Environment',
                fieldtype: 'dropdown',
                name: 'environment',
                options: [
                    { label: 'Azure Global', value: 'Azure Global' },
                    { label: 'Azure Government', value: 'Azure Government' },
                ],
            },
        ],

        AUTHENTICATION_DETAILS: {
            SECTION_1: [
                {
                    label: 'Tenant ID',
                    name: 'tenant_id',
                    fieldtype: 'input',
                },
                {
                    label: 'Application ID',
                    name: 'key',
                    fieldtype: 'input',
                },
                {
                    label: 'Application Secret',
                    name: 'secret',
                    fieldtype: 'input',
                    displaytype: 'secret'
                }
            ],

            SECTION_2: [
               
            ],

            SECTION_3: [
                {
                    header: 'Subscriptions',
                    discription: 'This selection will reflect in the workloads view panel',
                },
            ],

            SECTION_4: [
                {
                    label: 'Subscriptions',
                    name: 'subscription_id',
                    fieldtype: 'dropdown',
                    options: [],
                },
                {
                    label: 'Subscriptions Type',
                    fieldtype: 'dropdown',
                    name: 'subscription_type',
                    options: [
                        {
                            label: "Azure CSP-Direct",
                            value: "Azure CSP-Direct",
                        },
                        {
                            label: "Pay As You Go",
                            value: "Pay As You Go",
                        },
                        {
                            label: "Enterprise",
                            value: "Enterprise",
                        },
                        {
                            label: "Azure CSP-InDirect",
                            value: "Azure CSP-InDirect",
                        },
                        {
                            label: "Azure Sponsorship",
                            value: "Azure Sponsorship",
                        },
                        {
                            label: "Microsoft Customer Agreement",
                            value: "Microsoft Customer Agreement",
                        },
                    ],
                },
            ]
        }
    },
})