import { CreateTodoResponse, EmptyResponse, TodoDto } from "./models.js";
import { Todo, ITodo } from "./scheme.js";
import { Result } from "../../common/dtos/result.js";
import { HttpStatus } from "../../common/constants/http-status.js";

export const createTodo = async (dto: TodoDto, currentUser: string): Promise<Result<CreateTodoResponse>> => {
  const { title, description, isCompleted } = dto;

  const todo = new Todo<ITodo>({
    title,
    description,
    isCompleted,
    isDeleted: false,
    createdAt: new Date(Date.now()),
    createdBy: currentUser,
  });

  await todo.save();
  const data = { id: todo._id.toString() } as CreateTodoResponse;
  return new Result<CreateTodoResponse>().setStatus(HttpStatus.Created).setData(data);
};

export const getAllTodos = async (currentUser: string): Promise<Result<ITodo[]>> => {
  const todos = await Todo.find({ createdBy: currentUser, isDeleted: false });
  return new Result<ITodo[]>().setStatus(HttpStatus.Ok).setData(todos);
};

export const getTodoById = async (currentUser: string, id: string): Promise<Result<ITodo | null>> => {
  const todo = await Todo.findOne({ _id: id, createdBy: currentUser, isDeleted: false });

  if (!todo) {
    return new Result<ITodo | null>().setStatus(HttpStatus.NotFound).setData(null);
  }
  return new Result<ITodo>().setStatus(HttpStatus.Ok).setData(todo);
};

export const updateTodo = async (
  currentUser: string,
  id: string,
  dto: TodoDto,
): Promise<Result<EmptyResponse | null>> => {
  const { title, description, isCompleted } = dto;
  const todo = await Todo.findOneAndUpdate(
    { _id: id, createdBy: currentUser, isDeleted: false },
    { title, description, isCompleted, updatedBy: currentUser, updatedAt: new Date(Date.now()) },
    { new: true },
  );

  if (!todo) {
    return new Result<EmptyResponse | null>().setStatus(HttpStatus.NotFound).setData(null);
  }
  return new Result<EmptyResponse | null>().setStatus(HttpStatus.NoContent).setData(null);
};

export const deleteTodo = async (currentUser: string, id: string): Promise<Result<EmptyResponse | null>> => {
  const todo = await Todo.findOneAndUpdate(
    { _id: id, createdBy: currentUser, isDeleted: false },
    { isDeleted: true, updatedBy: currentUser, updatedAt: new Date(Date.now()) },
    { new: true },
  );

  if (!todo) {
    return new Result<EmptyResponse | null>().setStatus(HttpStatus.NotFound).setData(null);
  }
  return new Result<EmptyResponse | null>().setStatus(HttpStatus.NoContent).setData(null);
};

export const toggleTodo = async (currentUser: string, id: string): Promise<Result<EmptyResponse | null>> => {
  const todo = await Todo.findOne({ _id: id, createdBy: currentUser, isDeleted: false });

  if (!todo) {
    return new Result<EmptyResponse | null>().setStatus(HttpStatus.NotFound).setData(null);
  }

  todo.isCompleted = !todo.isCompleted;
  todo.updatedBy = currentUser;
  todo.updatedAt = new Date(Date.now());
  await todo.save();

  return new Result<EmptyResponse | null>().setStatus(HttpStatus.NoContent).setData(null);
};
