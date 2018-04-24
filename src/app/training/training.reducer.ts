import { Action, createFeatureSelector, createSelector } from '@ngrx/store';
import {TrainingActions, SET_AVAILABLE_TRAININGS, SET_FINISHED_TRAININGS, START_TRAINING, STOP_TRAINING} from './training.actions';
import { Exercise } from './exercise.model';
import * as fromRoot from '../app.reducer';

  export interface TrainingState {
    availableExercises: Exercise[];
    finishedExercises: Exercise[];
    activeTraining: Exercise;
  }

  // Global State after lazy loading
  export interface State extends fromRoot.State {
    training: TrainingState;
  }

const initialState: TrainingState = {
  availableExercises: [],
  finishedExercises: [],
  activeTraining: null
};

export function trainingReducer(state = initialState, action: TrainingActions) {
  switch (action.type) {
    case SET_AVAILABLE_TRAININGS:
      return {
        // state used to pull out all members and only override the available Exercises
        // on the contrary the result would be a state with only availableExercises
        ...state,
        availableExercises: action.payload
      };

    case SET_FINISHED_TRAININGS:
    return {
      ...state,
      finishedExercises: action.payload
    };

    case START_TRAINING:
    return {
      ...state,
      activeTraining: action.payload
    };

    case STOP_TRAINING:
    return {
      ...state,
      activeTraining: null
    };

    default: {
      return state;
    }
  }
}



export const getTrainigState = createFeatureSelector<TrainingState>('training');

export const getAvailableExercises = createSelector(getTrainigState, (state: TrainingState) => state.availableExercises);
export const getfinishedExercises = createSelector(getTrainigState, (state: TrainingState) => state.finishedExercises);
export const getactiveTraining = createSelector(getTrainigState, (state: TrainingState) => state.activeTraining);
