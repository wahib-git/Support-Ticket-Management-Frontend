import { AppComponent } from './app.component';

// Types précis pour Jasmine
declare const describe: (description: string, spec: () => void) => void;
declare const it: (description: string, spec: () => void) => void;
declare const expect: (actual: any) => {
  toBeTruthy: () => void;
  toBe: (expected: any) => void;
};

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
