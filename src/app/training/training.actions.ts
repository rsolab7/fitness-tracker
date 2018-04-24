import { Action } from '@ngrx/store';
import { Exercise } from './exercise.model';

export const SET_AVAILABLE_TRAININGS = '[Training] Set Available Trainings';
export const SET_FINISHED_TRAININGS = '[Training] Set Set Finished Trainings';
export const START_TRAINING = '[Training] Start Training';
export const STOP_TRAINING= '[Training] Stop Training';


export class SetAvailableTrainings implements Action {
  readonly type = SET_AVAILABLE_TRAININGS;
  constructor(public payload: Exercise[]) {}
}

export class SetFinishedTrainings implements Action {
  readonly type = SET_FINISHED_TRAININGS;
  constructor(public payload: Exercise[]) {}
}


export class StarTraining implements Action {
  readonly type = START_TRAINING;
  constructor(public payload: Exercise[]) {}
}

export class StopTraining implements Action {
  readonly type = STOP_TRAINING;
  constructor(public payload: Exercise[]) {}
}



export type TrainingActions = SetAvailableTrainings | SetFinishedTrainings | StarTraining | StopTraining;
