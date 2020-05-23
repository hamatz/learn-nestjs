import { Controller, Get, Body, Post, Param, Delete, Patch, Query, UsePipes, ValidationPipe, ParseIntPipe, UseGuards, Logger } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { Task } from './task.entity';
import { CreateTaskDto } from './dto/create-task.dto';
import { TaskStatusValidationPipe } from './pipes/task-status-validation.pipe';
import { TaskStatus } from './task-status.enum';
import { GetTasksFilterDto } from './dto/get-tasks-filter.dto';
import { AuthGuard } from '@nestjs/passport';
import { User } from 'src/auth/user.entity';
import { GetUser } from 'src/auth/get-user.decorator';


@Controller('tasks')
@UseGuards(AuthGuard())
export class TasksController {
    private logger =  new Logger('TasksControler');

    constructor(private taskService: TasksService) {

    }

    @Get()
    getTasks(@Query(ValidationPipe) filterDto: GetTasksFilterDto,
            @GetUser() user: User,
    ) : Promise<Task[]> {
        this.logger.verbose(`User "${user.username}" retrieving all tasks. Filters: ${JSON.stringify(filterDto)}`);
        return this.taskService.getTasks(filterDto, user);
    }

    @Get('/:id')
    getTaskById(@Param('id', ParseIntPipe) id: number,
                @GetUser() user: User,
    ) : Promise<Task> {
        return this.taskService.getTaskById(id, user);
    }

    @Post()
    @UsePipes(ValidationPipe)
    createTask(
        @Body() createTaskDto: CreateTaskDto,
        @GetUser() user: User,
        ) : Promise<Task> {
            this.logger.verbose(`User "${user.username}" creating a new task. Data: ${JSON.stringify(createTaskDto)}`);
        return this.taskService.createTask(createTaskDto, user);
    }

    @Delete('/:id')
    deleteTaskById(@Param('id', ParseIntPipe) id: number,
                   @GetUser() user: User,
    ) : Promise<void> {
        return this.taskService.deleteTaskById(id, user);
    }

    @Patch('/:id')
    async changeTaskStatus(@Param('id', ParseIntPipe) id: number,
                 @Body('status', TaskStatusValidationPipe) newStatus: TaskStatus,
                 @GetUser() user: User) : Promise<Task> {
        return await this.taskService.changeTaskStatus(id, newStatus, user);
    }

}
