import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';

@Injectable({ providedIn: 'root' })
export class LiveShowService {
    public resourceUrl = SERVER_API_URL + 'api/bsb-live';

    constructor(protected http: HttpClient) {}

    tutorChoseContestant(): Observable<HttpResponse<any>> {
        return this.http.patch<any>(`${this.resourceUrl}/i-want-u`, null, { observe: 'response' });
    }
    contestantChoosesTutor(contestantId: number, tutorLogin: string): Observable<HttpResponse<any>> {
        return this.http.patch<any>(`${this.resourceUrl}/contestant-choose-tutor/${contestantId}`, tutorLogin, { observe: 'response' });
    }
    changeCurrentContestant(id: number): Observable<HttpResponse<any>> {
        return this.http.put<any>(`${this.resourceUrl}/change/id/${id}`, null, { observe: 'response' });
    }
    startPauseVideo(): Observable<HttpResponse<'started' | 'paused'>> {
        return this.http.post<'started' | 'paused'>(`${this.resourceUrl}/start-pause`, null, { observe: 'response' });
    }

    backwardForward(timeInterval: number): Observable<HttpResponse<null>> {
        return this.http.post<null>(`${this.resourceUrl}/backward-forward`, timeInterval, { observe: 'response' });
    }
}
