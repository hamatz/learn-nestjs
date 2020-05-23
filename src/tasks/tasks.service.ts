import { Injectable, NotFoundException } from '@nestjs/common';
import { TaskRepository } from './task.repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { User } from 'src/auth/user.entity';


@Injectable()
export class TasksService {
    constructor(
        @InjectRepository(TaskRepository)
        private taskRepository: TaskRepository,
    ){

    }
    async getTasks(filterDto: GetTasksFilterDto, user: User) : Promise<Task[]> {
        return await this.taskRepository.getTasks(filterDto, user);

    }

    async getTaskById(id: number, user: User) : Promise<Task> {
        const found = await this.taskRepository.findOne({ where: { id, userId: user.id }});

        if (!found) {
            throw new NotFoundException(`Task wih ID "${id}" not found`);
        }
        return found;
    }

    async changeTaskStatus(id: number, newStatus: TaskStatus, user: User) : Promise<Task> {
        const target = await this.getTaskById(id, user);
        target.status = newStatus;
        target.save();

        return target;
    }

    async createTask(createTaskDto : CreateTaskDto, user: User) : Promise<Task> {

        return this.taskRepository.createTask(createTaskDto, user);

    }

    async deleteTaskById(id: number, user: User) : Promise<void> {
        const result = await this.taskRepository.delete(
            { id, userId: user.id }
        );

        if(result.affected === 0){
            throw new NotFoundException(`Task wih ID "${id}" not found`);
        }
    }

}
