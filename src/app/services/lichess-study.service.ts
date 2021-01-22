import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';

@Injectable({
    providedIn: 'root'
})
// LichessAPIService
export class LichessStudyService {
    constructor(private http: HttpClient) {
        console.log('lichess study service');

        this.getStudy().subscribe((data: any) => {
            console.log('study', data);
        });
    }

    private getStudy() {
        return this.http.get('https://lichess.org/SOMEURL');
    }
}
