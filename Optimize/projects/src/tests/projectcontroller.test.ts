import ProjectController from "../controllers/projectcontroller";
import * as httpMocks from 'node-mocks-http';
import { Request, Response } from 'express';
import ProjectService from '../services/projectservice';
import { ProjectUser, findByProjectUserMapFields } from "../models/projectusermapping";

const projectController = new ProjectController();
const projectService = new ProjectService();

let req: Request, res: Response;

beforeEach(() => {
    req = httpMocks.createRequest();
    res = httpMocks.createResponse();
    req.body = [{
        _id: '6491c5b3b2dd95036eef2cc0',
        tenant_id: '6479b5b872507759920f5278',
        tenant_group_id: '64757591723975c93a236fdf',
        first_name: 'mugundhan',
        last_name: 'gc',
        email: 'mohanBuss@aaludra.com',
        user_type: 'N',
        login_type: 'Sso',
        last_pwd_changed_at: '2023-06-20T04:42:47.251Z',
        status: 'Active',
        created_by_user_id: '6479b5b972507759920f527a',
        created_at: '2023-06-20T04:42:47.251Z',
        __v: 0
    }];
});

afterEach(() => {
    jest.clearAllMocks()
})

describe('Project controller', () => {
    it('tenant wise get Users list', async () => {
        const actualValue: Record<any, any>[] = [{ 'name': 'John' }, { 'name': 'Mike' }];
        projectService.checkUserRoleMap = jest.fn().mockResolvedValue(actualValue);
        await projectController.checkUserRoleMap(req, res);
        expect(res.statusCode).toBe(200);
    }, 100000);

    it('Throw 404 error when response failed', async () => {
        req.body = {};
        await projectController.checkUserRoleMap(req, res);
        expect(res.statusCode).toBe(404);
    }, 100000);

    // Mock the findOne method of ProjectUser
    const findOneMock = jest.spyOn(ProjectUser, 'findOne');
    findOneMock.mockResolvedValue({
        users_mapping: [
            { user_id: 'User1', role_id: 'Role1' },
            { user_id: 'User2', role_id: 'Role2' },
        ],
    });
    it('should return project users', async () => {
        const req: Request = httpMocks.createRequest();
        const res: Response = httpMocks.createResponse();
        // Set the necessary request parameters
        req.params = { project_id: '6488227e078ea5446ecf65aa' };
        // Call the controller method
        await projectController.getProjectUser(req, res);

        // Assert the response status and data
        expect(res.statusCode).toBe(200);
          expect((res as httpMocks.MockResponse<Response>)._getData()).toEqual([
            { user_id: 'User1', role_id: 'Role1' },
            { user_id: 'User2', role_id: 'Role2' },
          ]);
    });
    // Restore the original implementation of findOne after the test
    afterAll(() => {
        findOneMock.mockRestore();
    });

});

describe('Project service', () => {
    it('Get users list for tenant wise ', async () => {
        const data = [
            {
                _id: '649043ece27192f6f5c97aa2',
                tenant_id: '6479b5b872507759920f5278',
                tenant_group_id: '64757591723975c93a236fdf',
                first_name: 'mugundhan',
                last_name: 'gc',
                email: 'ha@aaludra.com',
                user_type: 'N',
                login_type: 'Sso',
                last_pwd_changed_at: '2023-06-19T11:53:01.257Z',
                status: 'Active',
                created_by_user_id: '6479b5b972507759920f527a',
                created_at: '2023-06-19T11:53:01.257Z',
                __v: 0
            }
        ];
        const expectedRoleMap: any = [true];
        jest.mock('../models/projectusermapping', () => ({
            findByProjectUserMapFields: jest.fn().mockImplementation((query: any) => {
                const user = data.find((item) => item._id === query['users_mapping.user_id']);
                return !!user; // Return true if user exists, false otherwise
            })
        }));
        // Replace the original implementation with the mocked version
        const ProjectService = require('../services/projectservice').default;
        const projectService = new ProjectService();
        const result = await projectService.checkUserRoleMap(data);
        expect(result).toEqual(expectedRoleMap);
    }, 100000);

});