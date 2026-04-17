import { enableProdMode, importProvidersFrom } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import 'hammerjs';


import { environment } from './environments/environment';
import { BrowserModule, HammerModule, bootstrapApplication } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AppRoutingModule } from './app/app.routing';
import { AngularOpenlayersModule } from 'ngx-ol';
import { AppComponent } from './app/app.component';

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, {
    providers: [importProvidersFrom(BrowserModule, FormsModule, AppRoutingModule, AngularOpenlayersModule, ReactiveFormsModule, HammerModule)]
})
  .catch((err) => console.log(err));
