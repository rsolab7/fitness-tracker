import { Exercise } from './exercise.model';
import { Subject } from 'rxjs/Subject';
import { AngularFirestore } from 'angularfire2/firestore';
import { Injectable } from '@angular/core';
import {Store} from '@ngrx/store';
// tslint:disable-next-line:import-blacklist
import { Subscription} from 'rxjs';
import { UIService } from '../shared/ui-service';
import * as UI from '../shared/ui.actions';
import * as fromRoot from '../app.reducer';
import * as fromTraining from './training.reducer';
import * as Training from './training.actions';


@Injectable()
export class TrainingService {
  exerciseChanges = new Subject<Exercise>();
  exercisesChanges = new Subject<Exercise[]>();
  finishedExercisesChanged = new Subject<Exercise[]>();
  private availableExercise: Exercise[] = [];
  private runningExercise: Exercise;
  private exercisesRetrieved: Exercise;
  private finishedExercises: Exercise[] = [];
  private fbSubscriptions: Subscription[] = [];


  constructor(private db: AngularFirestore, private uiService: UIService, private store: Store<fromRoot.State>)  { }

  fetchAvailableExercise() {
    this.store.dispatch(new UI.StartLoading());
    // this.uiService.loadingStateChanged.next(true);
    this.fbSubscriptions.push(this.db
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
      // this.availableExercise = exercises;
      // this.exercisesChanges.next([...this.availableExercise]);
      this.store.dispatch(new Training.SetAvailableTrainings(exercises));
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch(new UI.StopLoading());
    }, error => {
      // this.uiService.loadingStateChanged.next(false);
      this.store.dispatch(new UI.StopLoading());
      this.uiService.showSnackBar('Fail to connect to database, Please try again', null, 3000);
      this.exercisesChanges.next(null);
    }));
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
    // Use ValueChanges() to retrieve just the data of the object
    // fetchAllExercises() {
    //   // slice is used to get a new copy of array
    //   this.db.collection('finishedExercises')
    //   .valueChanges()
    //   .subscribe((exercises: Exercise[]) => {
    //     // replace finishEx array with db array
    //     // this.finishedExercises = exercises;
    //     // Pass the data of fetchEx to all subscribers
    //     this.finishedExercisesChanged.next(exercises);
    //   });
    // }

    // Using SnapshotChanges() in order to retrieve the id as well as the data of the object
    fetchAllExercises() {
    this.store.dispatch(new UI.StartLoading());
    // this.uiService.loadingStateChanged.next(true);
    this.fbSubscriptions.push(this.db
    .collection('finishedExercises')
    .snapshotChanges()
    .map(docArray => {
      return  docArray.map(doc => {
        return {
          id: doc.payload.doc.id,
          name: doc.payload.doc.data().name,
          duration: doc.payload.doc.data().duration,
          calories: doc.payload.doc.data().calories,
          date: doc.payload.doc.data().date,
          state: doc.payload.doc.data().state
        };
      });
    })
    .subscribe((exercises: Exercise[]) => {
      // this.store.dispatch(new UI.StopLoading());
      // this.uiService.loadingStateChanged.next(false);
      this.finishedExercises = exercises;
      this.finishedExercisesChanged.next([...this.finishedExercises]);
    }, error => {
      this.store.dispatch(new UI.StopLoading());
      // this.uiService.loadingStateChanged.next(false);
      this.uiService.showSnackBar('Fail to connect to database, Please try again', null, 3000);
    }
    ));
    }

    cancelSubscriptions() {
      this.fbSubscriptions.forEach(sub => sub.unsubscribe());
    }

    // Add finished ex to the firebase db
    private addDataToDatabase(exercise: Exercise) {
      this.db.collection('finishedExercises').add(exercise);
    }

    deleteExercisesFromDataBase(exercise: Exercise[], len: number) {
      // this.db.doc('finishedExercises/' + exercises[0].id).delete();
      for (let i = 0; i < len; i++) {
        this.db.doc('finishedExercises/' + exercise[i].id).delete();
      }

    }

}
