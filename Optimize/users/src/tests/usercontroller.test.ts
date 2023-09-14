import { Request, Response } from 'express';
import UserController from '../controllers/usercontroller';
import UserService from '../services/userservice';
import AuthGuard from '../middleware/authguard';
import AppConstants from '../utils/constant';

const userController = new UserController();
const userService = new UserService();
const authGuard = new AuthGuard();
const appConstants = new AppConstants();

let req: Request;
let res: Response;

beforeEach(() => {
  req = {} as Request;
  res = {
    status: jest.fn().mockReturnThis(), // Mocking the status function
    send: jest.fn(),
  } as unknown as Response;
});

afterEach(() => {
  jest.clearAllMocks();
});
;

describe('getAllProjectUsers', () => {
  test('should send project users when request is valid', async () => {
    const tokenData = { userId: 'user123' };
    jest.spyOn(authGuard, 'getDataByToken').mockResolvedValue(tokenData);

    // Mock userService.getAllProjectUsers to return users list
    const usersList = [ { user_id: 'User1', role_id: 'Role1' },  { user_id: 'User2', role_id: 'Role1' }];
    // jest.spyOn(userService, 'getAllProjectUsers').mockResolvedValue(usersList);

    // Call the method to test
    await userController.getAllProjectUsers(req, res);

    // Assertions
    expect(authGuard.getDataByToken).toHaveBeenCalledWith(req);
    expect(userService.getAllProjectUsers).toHaveBeenCalledWith(req, tokenData);
    expect(res.statusCode).toHaveBeenCalledWith(200);
    expect(res.send).toHaveBeenCalledWith(usersList);
  });

  // test('should send error message when an error occurs', async () => {
  //   // Mock authGuard.getDataByToken to throw an error
  //   const errorMessage = 'Error retrieving token data';
  //   jest.spyOn(authGuard, 'getDataByToken').mockRejectedValue(new Error(errorMessage));

  //   // Call the method to test
  //   await userController.getAllProjectUsers(req, res);

  //   // Assertions
  //   expect(authGuard.getDataByToken).toHaveBeenCalledWith(req);
  //   expect(res.statusCode).toHaveBeenCalledWith(400);
  //   expect(res.send).toHaveBeenCalledWith(errorMessage);
  // });
});
