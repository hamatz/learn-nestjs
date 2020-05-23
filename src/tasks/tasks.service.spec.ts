import { Test } from '@nestjs/testing';
import { TasksService } from './tasks.service';
import { TaskRepository } from './task.repository';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { TaskStatus } from './task-status.enum';
import { NotFoundException } from '@nestjs/common';

const mockUser = { id: 7, username: 'Test user'};
const newStatus = TaskStatus.DONE;

const mockTasksRepository = () => ({
    getTasks: jest.fn(),
    findOne: jest.fn(),
    createTask: jest.fn(),
    delete: jest.fn(),
});

describe('TasksService', () => {
    let tasksService;
    let taskRepository;

    beforeEach(async () => {
        const module = await Test.createTestingModule({
            providers: [
                TasksService,
                { provide: TaskRepository, useFactory: mockTasksRepository },
            ],
        }).compile();

        tasksService = await module.get<TasksService>(TasksService);
        taskRepository = await module.get<TaskRepository>(TaskRepository);
    });

    describe('getTasks', () => {
        it('gets all tasks from the repository', async () => {
            taskRepository.getTasks.mockResolvedValue('someValue');
            expect(taskRepository.getTasks).not.toHaveBeenCalled();
            const filters: GetTasksFilterDto = { status: TaskStatus.IN_PROGRESS, search: 'Some search query'};
            const result = await tasksService.getTasks(filters,  mockUser);
            expect(taskRepository.getTasks).toHaveBeenCalled();
            expect(result).toEqual('someValue');
        });
    });

    describe('getTaskById', () => {
        it('calls taskRepository.findOne() and successfuly retive and return the task', async () => {
            const mockTask = { title: 'Test task', description: 'Test desc'};
            taskRepository.findOne.mockResolvedValue(mockTask);

            const result = await tasksService.getTaskById(1, mockUser);
            expect(result).toEqual(mockTask);

            expect(taskRepository.findOne).toHaveBeenCalledWith({
                where: { 
                    id: 1,
                    userId: mockUser.id,
                }
            });
        });

        it('throws an errer as task is not found', () => {
            taskRepository.findOne.mockResolvedValue(null);
            expect(tasksService.getTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('createTask',  () => {
        it('calls taskRepository.createTask() successfuly return the task ', async () => {
            expect(taskRepository.createTask).not.toHaveBeenCalled();
            const createTaskDto = { title: 'Test task', description: 'Test desc'};
            taskRepository.createTask.mockResolvedValue(createTaskDto, mockUser);
            const result = await tasksService.createTask(createTaskDto, mockUser);
            expect(taskRepository.createTask).toHaveBeenCalledWith(createTaskDto, mockUser);
            expect(result).toEqual(createTaskDto);
        })
    });

    describe('deleteTaskById', () => {
        it('calls taskRepository.delete() successfuly delete the task', async () => {
            expect(taskRepository.delete).not.toHaveBeenCalled();
            taskRepository.delete.mockResolvedValue({ affected: 1 });
            await tasksService.deleteTaskById(8, mockUser);
            expect(taskRepository.delete).toHaveBeenCalledWith({id: 8, userId: mockUser.id});
        });

        it('calls taskRepository.delete() with wrong id and get an error', () => {
            taskRepository.delete.mockResolvedValue({ affected: 0 });
            expect(tasksService.deleteTaskById(1, mockUser)).rejects.toThrow(NotFoundException);
        });
    });

    describe('changeTaskStatus', () => {
        it('calls taskService.changeTaskStatus() and successfuly return the updated task', async () => {
            const save = jest.fn().mockResolvedValue(true);
            tasksService.getTaskById = jest.fn().mockResolvedValue({
                status: newStatus,
                save,
            });
            expect(tasksService.getTaskById).not.toHaveBeenCalled();
            expect(save).not.toHaveBeenCalled();
            const result = await tasksService.changeTaskStatus(8, newStatus, mockUser);
            expect(tasksService.getTaskById).toHaveBeenCalled();
            expect(save).toHaveBeenCalled();
            expect(result.status).toEqual(newStatus);
        });

    });
});
