import { Exercise } from './exercise.model';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable()
export class TrainingService {
  exerciseChanges = new Subject<Exercise>();
  exercisesChanges = new Subject<Exercise[]>();
  private availableExercise: Exercise[] = [];
  private runningExercise: Exercise;
  private exercises: Exercise[] = [
    { id: 'touch-toes', name: 'Touch Toes', duration: 180, calories: 15, date: new Date(), state: 'completed' },
    { id: 'side-lunges', name: 'Side Lunges', duration: 120, calories: 18, date: new Date(), state: 'completed' },
  ];

  constructor(private db: AngularFirestore) {}

  fetchAvailableExercise() {
    this.db
    .collection('availableExercises')
    .snapshotChanges()
    .map(docArray => {
      return  docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          name: doc.payload.doc.data().name,
          duration: doc.payload.doc.data().duration,
          calories: doc.payload.doc.data().calories
        };
      });
    })
    .subscribe((exercises: Exercise[]) => {
      this.availableExercise = exercises;
      this.exercisesChanges.next([...this.availableExercise]);
    });
  }

  startExercises(selectedId: string) {
    this.runningExercise = this.availableExercise.find(ex =>
      ex.id === selectedId);
    this.exerciseChanges.next({ ...this.runningExercise });
    }

  completeExercise() {
    // push a NEW object of runningEx to the array
    this.exercises.push({ ...this.runningExercise, date: new Date(), state: 'completed' });
    this.runningExercise = null;
    // tell exerciseChange there is no running ex.
    this.exerciseChanges.next(null);
  }


  cancelExercise(progress: number) {
    // push a NEW object of runningEx to the array
    this.exercises.push({ ...this.runningExercise,
      duration: this.runningExercise.duration * (progress / 100),
      calories: this.runningExercise.calories * (progress / 100),
      date: new Date(),
      state: 'cancelled'});
    this.runningExercise = null;
    // tell exerciseChange there is no running ex.
    this.exerciseChanges.next(null);

  }

    getRunningExercise() {
      return {...this.runningExercise};
    }

    getAllExercises() {
      // slice is used to get a new copy of array
      return this.exercises.slice();
    }


}
