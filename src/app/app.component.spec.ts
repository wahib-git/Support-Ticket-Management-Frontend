import { AppComponent } from './app.component';

declare const describe: any;
declare const it: any;
declare const expect: any;

describe('AppComponent', () => {
  it('should create the app', () => {
    const app = new AppComponent();
    expect(app).toBeTruthy();
  });

  it('should have title "Support Ticket System"', () => {
    const app = new AppComponent();
    expect(app.title).toBe('Support Ticket System');
  });
});
