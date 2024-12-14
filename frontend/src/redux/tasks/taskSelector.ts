import { createSelector } from "reselect";
import { RootState } from "../store";
import { Tasktype } from "./taskTypes";

export const selectTaskReducer = (state: RootState) => state.task;

export const selectTask = (id: number) => createSelector(
    [selectTaskReducer],
    (tasks) => tasks.tasks.find((task) => task.id === id) as Tasktype
)

export const selectTaskslist = createSelector(
    [selectTaskReducer],
    (task) => task.tasks
)


export const selectTotalSize = createSelector(
    [selectTaskReducer],
    (task) => task.totalSize
)

export const selecttasks = createSelector(
    [selectTaskReducer],
    (task) => task
)

export const selectTaskError = createSelector(
    [selectTaskReducer],
    (task)=>task.taskError
)