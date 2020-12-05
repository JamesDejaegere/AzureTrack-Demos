import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterModule } from '@angular/router';
import {
  AuthModule,
  OidcConfigService,
  LogLevel,
} from 'angular-auth-oidc-client';
import { AppComponent } from './app.component';
import { HomeComponent } from './home/home.component';
import { UnauthorizedComponent } from './unauthorized/unauthorized.component';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { AuthInterceptor } from './auth.interceptor';
import { LogoutComponent } from './logout/logout.component';

export function configureAuth(oidcConfigService: OidcConfigService) {
  return () =>
    oidcConfigService.withConfig({
      stsServer:
        'https://login.microsoftonline.com/4d21d8ba-7ebe-42b4-8074-6ff2514856fb',
      authWellknownEndpoint:
        'https://login.microsoftonline.com/4d21d8ba-7ebe-42b4-8074-6ff2514856fb/v2.0/.well-known/openid-configuration',
      redirectUrl: window.location.origin,
      postLogoutRedirectUri: window.location.origin,
      clientId: '1759825c-4dea-4d84-85d3-f3f96a133e34',
      scope: 'openid api://134258d0-a376-4a1c-8e3d-5f99679575e7/data.read',
      responseType: 'code',
      silentRenew: true,
      maxIdTokenIatOffsetAllowedInSeconds: 600,
      issValidationOff: true, // this needs to be true if using a common endpoint in Azure
      autoUserinfo: false,
      silentRenewUrl: window.location.origin + '/silent-renew.html',
      logLevel: LogLevel.Debug,
    });
}

@NgModule({
  declarations: [AppComponent, HomeComponent, UnauthorizedComponent],
  imports: [
    BrowserModule,
    RouterModule.forRoot([
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      { path: 'home', component: HomeComponent },
      { path: 'logout', component: LogoutComponent },
      { path: 'unauthorized', component: UnauthorizedComponent },
    ]),
    AuthModule.forRoot(),
    HttpClientModule,
  ],
  providers: [
    OidcConfigService,
    {
      provide: APP_INITIALIZER,
      useFactory: configureAuth,
      deps: [OidcConfigService],
      multi: true,
    },
    {
      provide: HTTP_INTERCEPTORS,
      useClass: AuthInterceptor,
      multi: true,
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {}
