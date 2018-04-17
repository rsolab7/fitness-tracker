import { Exercise } from './exercise.model';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';

@Injectable()
export class TrainingService {
  exerciseChanges = new Subject<Exercise>();
  exercisesChanges = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercise: Exercise[] = [];
  private runningExercise: Exercise;
  // private finishedExercises: Exercise[] = [];

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
    // Access a single document in a collection and update it.
    // this.db.doc('availableExercises/' + selectedId).update({lastSelected: new Date()});
    this.runningExercise = this.availableExercise.find(ex =>
      ex.id === selectedId);
    this.exerciseChanges.next({ ...this.runningExercise });
    }

  completeExercise() {
    // push a NEW object of runningEx to the array
    this.addDataToDatabase({ ...this.runningExercise, date: new Date(), state: 'completed' });
    this.runningExercise = null;
    // tell exerciseChange there is no running ex.
    this.exerciseChanges.next(null);
  }


  cancelExercise(progress: number) {
    // push a NEW object of runningEx to the array
    this.addDataToDatabase({ ...this.runningExercise,
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

    fetchAllExercises() {
      // slice is used to get a new copy of array
      this.db.collection('finishedExercises')
      .valueChanges()
      .subscribe((exercises: Exercise[]) => {
        // replace finishEx array with db array
        // this.finishedExercises = exercises;
        // Pass the data of fetchEx to all subscribers
        this.finishedExercisesChanged.next(exercises);
      });
    }

    // Add finished ex to the firebase db
    private addDataToDatabase(exercise: Exercise) {
      this.db.collection('finishedExercises').add(exercise);
    }
}
