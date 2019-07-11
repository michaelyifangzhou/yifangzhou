import { Injectable } from '@angular/core';
import { HttpClient, HttpResponse } from '@angular/common/http';
import { Observable } from 'rxjs';

import { SERVER_API_URL } from 'app/app.constants';
import { createRequestOption } from 'app/shared';
import { IContestent } from 'app/shared/model/contestent.model';

type EntityResponseType = HttpResponse<IContestent>;
type EntityArrayResponseType = HttpResponse<IContestent[]>;

@Injectable({ providedIn: 'root' })
export class ContestentService {
    public resourceUrl = SERVER_API_URL + 'api/contestents';

    constructor(protected http: HttpClient) {}

    create(contestent: IContestent): Observable<EntityResponseType> {
        return this.http.post<IContestent>(this.resourceUrl, contestent, { observe: 'response' });
    }

    update(contestent: IContestent): Observable<EntityResponseType> {
        return this.http.put<IContestent>(this.resourceUrl, contestent, { observe: 'response' });
    }

    find(id: number): Observable<EntityResponseType> {
        return this.http.get<IContestent>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }

    query(req?: any): Observable<EntityArrayResponseType> {
        const options = createRequestOption(req);
        return this.http.get<IContestent[]>(this.resourceUrl, { params: options, observe: 'response' });
    }

    delete(id: number): Observable<HttpResponse<any>> {
        return this.http.delete<any>(`${this.resourceUrl}/${id}`, { observe: 'response' });
    }
}
