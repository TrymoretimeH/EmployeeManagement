import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';

bootstrapApplication(AppComponent, appConfig)
  // .then(ref => {
  //   if (window['ngRef'] {
  //     window['ngRef'].destroy();
  //   })
  //   window['ngRef'] = ref;
  // })
  .catch((err) => console.error(err));
