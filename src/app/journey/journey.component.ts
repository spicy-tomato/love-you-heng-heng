import { ChangeDetectionStrategy, Component } from '@angular/core';

@Component({
  selector: 'app-journey',
  templateUrl: './journey.component.html',
  styleUrls: ['./journey.component.css'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JourneyComponent {}
