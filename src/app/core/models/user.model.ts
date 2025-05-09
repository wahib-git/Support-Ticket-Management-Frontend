export interface User {
  _id: string;
  name: string;
  email: string;
  role: 'admin' | 'agent' | 'interlocuteur';
  specialization?: 'Infrastructure informatique' | 'Entretien des locaux' | 'Sécurité et sûreté';
  userProfile?: 'enseignant' | 'etudient' |  'personnel';
}

export interface AuthResponse {
  token: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  role: 'admin' | 'agent' | 'interlocuteur';
  specialization?: 'Infrastructure informatique' | 'Entretien des locaux' | 'Sécurité et sûreté';
  userProfile?: 'enseignant' | 'etudient' |  'personnel';
}