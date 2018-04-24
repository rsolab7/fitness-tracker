import { Component, OnInit, OnDestroy } from '@angular/core';
import { TrainingService } from '../training.service';
import { Exercise } from '../exercise.model';
import { NgForm } from '@angular/forms';
// tslint:disable-next-line:import-blacklist
import { Observable, Subscription } from 'rxjs';
import { map } from 'rxjs/operators';
import { Store } from '@ngrx/store';
import { UIService } from '../../shared/ui-service';
import * as fromRoot from '../../app.reducer';

@Component({
  selector: 'app-new-training',
  templateUrl: './new-training.component.html',
  styleUrls: ['./new-training.component.css']
})
export class NewTrainingComponent implements OnInit, OnDestroy {
  // In order to inject a service first, it needs to be provided in the app moule
  // Then add the service in the constructor
  exercises: Exercise[];
  isLoading$: Observable<boolean>;
  exerciseSubscription: Subscription;
  // private loadingSubs: Subscription;


  constructor(private trainingService: TrainingService, private uiService: UIService, private store: Store <{ui: fromRoot.State}>) { }

  ngOnInit() {
    this.exerciseSubscription = this.trainingService.exercisesChanges.subscribe(exercises => (
         this.exercises = exercises
      ));
    this.fetchExercises();
    this.isLoading$ = this.store.select(fromRoot.getIsLoading);
    // this.loadingSubs = this.uiService.loadingStateChanged.subscribe(isLoading => {
    //   this.isLoading = isLoading;
    // });
  }
  fetchExercises() {
    this.trainingService.fetchAvailableExercise();
  }

  onStartTraining(form: NgForm) {
    this.trainingService.startExercises(form.value.exercise);
}

ngOnDestroy() {
  if (this.exerciseSubscription) {
    this.exerciseSubscription.unsubscribe();
  }
}

}
