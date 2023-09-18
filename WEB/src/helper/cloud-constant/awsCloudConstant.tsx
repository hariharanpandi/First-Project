export const AWSCloudConstant = Object.freeze({
    CLOUD: {
        ON_BOARDING: [
            {
                label: 'Account Type',
                fieldtype: 'dropdown',
                name: 'account_type',
                options: [
                    {
                        label: 'Master Account',
                        value: 'Master Account'
                    },
                    {
                        label: 'Linked Account',
                        value: 'Linked Account'
                    },
                ],
            },
            {
                label: 'Access Type',
                fieldtype: 'dropdown',
                name: 'access_type',
                options: [
                    {
                        label: 'Access',
                        value: 'Access'
                    },
                    {
                        label: 'Access + Governance',
                        value: 'Access + Governance'
                    },
                ],
            },
            {
                label: 'AWS environment',
                fieldtype: 'dropdown',
                name: 'environment',
                options: [
                    {
                        label: 'AWS Standard',
                        value: 'AWS Standard'
                    },
                    {
                        label: 'AWS Gov Cloud',
                        value: 'AWS Gov Cloud'
                    }
                ],
            },
            {
                label: 'Authentication protocol',
                fieldtype: 'dropdown',
                name: 'authentication_protocol',
                options: [
                    {
                        label: 'Access Key',
                        value: 'Access Key'
                    },
                    {
                        label: 'Assume Role',
                        value: 'Assume Role'
                    },
                ],
            },
        ],

        AUTHENTICATION_DETAILS: {
            SECTION_1: [
                {
                    label: 'Access key',
                    name: 'apikey',
                    fieldtype: 'input',

                },
                {
                    label: 'Secret key',
                    name: 'apisecret',
                    fieldtype: 'input',
                    displaytype: 'secret'
                }
            ],

            SECTION_2: [
                {
                    label: 'Bucket Name',
                    name: 'bucket_name',
                    fieldtype: 'input',
                },
            ],

            SECTION_3: [
                {
                    header: 'Cost Report Format',
                    discription: 'This selection will reflect in the workloads view panel',
                },
            ],

            SECTION_4: [
                {
                    label: 'Cost Report Format',
                    name: 'cost_report_format_fields',
                    fieldtype: 'dropdown',
                    options: [
                        {
                            label: 'Standard',
                            value: 'Standard',
                        },
                        {
                            label: 'Amazon Athena',
                            value: 'Amazon Athena',
                        },
                    ],
                },
            ]
        }
    },
})