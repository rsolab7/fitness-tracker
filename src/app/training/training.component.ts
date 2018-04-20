import { Component, OnInit, OnDestroy} from '@angular/core';
import { TrainingService } from './training.service';
import { Subscription } from 'rxjs/Subscription';

@Component({
  selector: 'app-training',
  templateUrl: './training.component.html',
  styleUrls: ['./training.component.css']
})
export class TrainingComponent implements OnInit, OnDestroy {
  ongoingTraining = false;
  trainingSubscription: Subscription;
  constructor(private trainigService: TrainingService) { }

  ngOnInit() {
    this.trainingSubscription = this.trainigService.exerciseChanges.subscribe(
      exercise => {
        if (exercise != null) {
          this.ongoingTraining = true;
        } else {
          this.ongoingTraining = false;
        }
      });
  }

  ngOnDestroy() {
    if (this.trainingSubscription) {
      this.trainingSubscription.unsubscribe();
    }
  }


}
