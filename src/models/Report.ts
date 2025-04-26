import { Analysis } from './Analysis';

export interface Report {
    id: string;
    analyses: Analysis[];
    summary: string;
    totalTimeSavings: number;
    timestamp: Date;
} 