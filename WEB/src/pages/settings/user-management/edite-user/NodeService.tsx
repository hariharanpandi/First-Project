export const NodeService = {
    getTreeTableNodesData() {
        return [
            {
                key: '0',
                data: {
                    name: 'E-learning',
                    size: '100kb',
                    type: 'Folder'
                },
                // children: [            //LMS
                //     {
                //         key: '0-0',
                //         data: {
                //             name: 'LMS',
                //             size: '25kb',
                //             type: 'Folder'
                //         },
                //         children: [
                //             {
                //                 key: '0-0-0',
                //                 data: {
                //                     name: 'Dev',
                //                     size: '10kb',
                //                     type: 'Application'
                //                 }
                //             },
                //             {
                //                 key: '0-0-1',
                //                 data: {
                //                     name: 'QA',
                //                     size: '10kb',
                //                     type: 'Application'
                //                 }
                //             },
                //             {
                //                 key: '0-0-2',
                //                 data: {
                //                     name: 'Production',
                //                     size: '10kb',
                //                     type: 'Application'
                //                 }
                //             }
                //         ]
                //     },
                //     {                                ///KMS
                //         key: '0-1',
                //         data: {
                //             name: 'KMS',
                //             size: '25kb',
                //             type: 'Application'
                //         },
                //         children: [
                //             {
                //                 key: '0-1-0',
                //                 data: {
                //                     name: 'Dev',
                //                     size: '10kb',
                //                     type: 'Application'
                //                 }
                //             },
                //             {
                //                 key: '0-1-1',
                //                 data: {
                //                     name: 'QA',
                //                     size: '10kb',
                //                     type: 'Application'
                //                 }
                //             },
                //             {
                //                 key: '0-1-2',
                //                 data: {
                //                     name: 'Production',
                //                     size: '10kb',
                //                     type: 'Application'
                //                 }
                //             }
                //         ]
                //     }
                // ]
            },
            //////////////////222222222222222222222222
            {
                key: '1',
                data: {
                    name: 'Cloud',
                    size: '20kb',
                    type: 'Folder'
                },
                // children: [
                //     {
                //         key: '1-0',
                //         data: {
                //             name: 'CODEN-X',
                //             size: '10kb',
                //             type: 'Zip'
                //         },
                //         children:[
                //             {
                //                 key:"1-0-0",
                //                 data:{
                //                     name:"Dev",
                //                     size:"10k",
                //                     type:'zip'
                //                 }
                //             },
                //             {
                //                 key:"1-0-1",
                //                 data:{
                //                     name:"QA",
                //                     size:"10k",
                //                     type:'zip'
                //                 }
                //             },
                //             {
                //                 key:"1-0-2",
                //                 data:{
                //                     name:"Production",
                //                     size:"10k",
                //                     type:'zip'
                //                 }
                //             }
                //         ]
                //     },
                //     {
                //         key: '1-1',
                //         data: {
                //             name: 'IOPEX',
                //             size: '10kb',
                //             type: 'Zip'
                //         },
                //         children:[
                //             {
                //                 key:"1-1-0",
                //                 data:{
                //                     name:"Dev",
                //                     size:"10k",
                //                     type:'zip'
                //                 }
                //             },
                //             {
                //                 key:"1-1-1",
                //                 data:{
                //                     name:"QA",
                //                     size:"10k",
                //                     type:'zip'
                //                 }
                //             },
                //             {
                //                 key:"1-1-1",
                //                 data:{
                //                     name:"Production",
                //                     size:"10k",
                //                     type:'zip'
                //                 }
                //             }
                //         ]
                //     }
                // ]
            },
          
        ];
    },

    getTreeTableNodes() {
        return Promise.resolve(this.getTreeTableNodesData());
    },

};
