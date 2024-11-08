import { bootstrapApplication } from '@angular/platform-browser';
import { AppComponent } from './app/app.component';
import { HttpClientModule } from '@angular/common/http';
import { importProvidersFrom } from '@angular/core';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { provideCharts, withDefaultRegisterables } from 'ng2-charts';

bootstrapApplication(AppComponent, {
  providers: [importProvidersFrom(HttpClientModule), provideAnimationsAsync(), provideAnimationsAsync(), provideCharts(withDefaultRegisterables()), provideAnimationsAsync()],
})
.catch((err) => console.error(err));
