import { AppComponent } from './app.component';

// Types précis pour Jasmine
declare const describe: (description: string, spec: () => void) => void;
declare const it: (description: string, spec: () => void) => void;

// Utilisation d'un type générique <T>
declare const expect: <T>(actual: T) => {
  toBeTruthy: () => void;
  toBe: (expected: T) => void;
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
})