import AppConstants from "../utils/constant";

const appConstant = new AppConstants();

const createProject = {
    tags: ["Project"],
    summary: 'Create project.',
    description: 'Project Creation - unique project_name & validation.',
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    type: 'object',
                    properties: {
                        project_name: {
                            type: "string",
                            example: "project-x"
                        },
                        description: {
                            type: "string",
                            example: "Cloud Management"
                        },
                    },
                },
            },
        },
    },
    responses: {
        201: {
            description: 'Created',
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        required: true,
                        properties: {
                            project_name: {
                                type: "string",
                                example: "project-x"
                            },
                            description: {
                                type: "string",
                                example: "Cloud Management"
                            },
                        },
                        example: {
                            "message": "Project has been successfully created.",
                            "data": {
                                "tenant_id": "64816eb3f201d772feeb38b0",
                                "tenant_group_id": "64816eb3f201d772feeb38b2",
                                "project_name": "project-x",
                                "description": "Cloud Management",
                                "status": "Active",
                                "created_by_user_id": "64816eb3f201d772feeb38b4",
                                "created_at": "2023-06-08T11:05:32.459Z",
                                "updated_by_user_id": "64816eb3f201d772feeb38b4",
                                "updated_at": "2023-06-08T11:05:32.459Z",
                                "_id": "6481b9ba4c9e65a9db3e978c",
                                "__v": 0
                            }
                        },
                    },
                },
            },
        },
        400: {
            description: 'Bad request',
            content: {
                "application/json": {
                    example: {
                        message: appConstant.ERROR_MESSAGES.DUPLICATE
                    }
                },
            },
        },
        404: {
            description: 'Page not found',
            content: {
                "application/json": {
                    example: {
                        message: "404 Page Not Found"
                    }
                },
            },
        },
    },
};
const updateProject = {
    tags: ["Project"],
    summary: 'Update project.',
    description: 'Project update by _id - unique project_name & validation.',
    parameters: [
        {
            name: "_id",
            in: "path",
            description: "id of the project",
            type: "string",
            example: "6481a323615e80de1e2fbdd3",
        }
    ],
    requestBody: {
        content: {
            "application/json": {
                schema: {
                    type: 'object',
                    properties: {
                        project_name: {
                            type: "string",
                            example: "project-x"
                        },
                        description: {
                            type: "string",
                            example: "Cloud Management"
                        },
                    },
                },
            },
        },
    },
    responses: {
        200: {
            description: 'Ok',
            content: {
                "application/json": {
                    schema: {
                        type: 'object',
                        required: true,
                        properties: {
                            project_name: {
                                type: "string",
                                example: "Project-x"
                            },
                            description: {
                                type: "string",
                                example: "Cloud Management"
                            },
                        },
                        example: {
                            "message": "Project has been successfully updated.",
                            "data": {
                                "_id": "6481a323615e80de1e2fbdd3",
                                "tenant_id": "64816eb3f201d772feeb38b0",
                                "tenant_group_id": "64816eb3f201d772feeb38b2",
                                "project_name": "Project-x",
                                "description": "Cloud Management",
                                "status": "Active",
                                "created_by_user_id": "64816eb3f201d772feeb38b9",
                                "created_at": "2023-06-08T09:30:40.241Z",
                                "updated_by_user_id": "64816eb3f201d772feeb38b4",
                                "updated_at": "2023-06-08T09:30:40.241Z",
                                "__v": 0
                            }
                        },
                    },
                },
            },
        },
        400: {
            description: 'Bad request',
            content: {
                "application/json": {
                    example: {
                        message: appConstant.ERROR_MESSAGES.DUPLICATE
                    }
                },
            },
        },
        404: {
            description: 'Page not found',
            content: {
                "application/json": {
                    example: {
                        message: "404 Page Not Found"
                    }
                },
            },
        },
    },
};
const deleteProject = {
    tags: ["Project"],
    summary: 'Delete project.',
    description: 'Project delete by _id.',
    parameters: [
        {
            name: "_id",
            in: "path",
            description: "id of the project",
            type: "string",
            example: "6481a323615e80de1e2fbdd3",
        }
    ],
    responses: {
        200: {
            description: 'Ok',
            content: {
                "application/json": {
                    example: {
                        message: appConstant.MESSAGES.DELETE_PROJECT
                    }
                },
            },
        },
        400: {
            description: 'Bad request',
            content: {
                "application/json": {
                    example: {
                        message: appConstant.ERROR_MESSAGES.DUPLICATE
                    }
                },
            },
        },
        404: {
            description: 'Page not found',
            content: {
                "application/json": {
                    example: {
                        message: "404 Page Not Found"
                    }
                },
            },
        },
    },
};
const projectsServiceRouters = {
    '/project/create': {
        post: createProject
    },
    '/project/update/{_id}': {
        put: updateProject
    },
    '/project/delete/{_id}':{
        delete:deleteProject
    }
};

module.exports = projectsServiceRouters;