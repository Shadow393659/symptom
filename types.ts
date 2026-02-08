
export interface SymptomQuery {
  symptom: string;
  duration: string;
  context: string;
}

export interface EducationResponse {
  generalExplanation: string;
  usuallyMild: string;
  redFlags: string;
  selfCare: string;
  disclaimer: string;
}

export enum LoadingStatus {
  IDLE = 'IDLE',
  LOADING = 'LOADING',
  SUCCESS = 'SUCCESS',
  ERROR = 'ERROR'
}
