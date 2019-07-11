import { Component, OnInit } from '@angular/core';
import { ContestentService } from 'app/entities/contestent';
import { IContestent } from 'app/shared/model/contestent.model';
import { AccountService, IUser } from 'app/core';

@Component({
    selector: 'bsb-contestant-list',
    templateUrl: './contestant-list.component.html',
    styleUrls: ['./contestant-list.component.scss']
})
export class ContestantListComponent implements OnInit {
    contestantsByTutor: { [tutorName: string]: IContestent[] } = {};
    contestantWithoutTutor: IContestent[] = [];
    tutors: IUser[];

    constructor(private contestentService: ContestentService, private accountService: AccountService) {}

    ngOnInit() {
        this.loadAll();
    }

    loadAll() {
        this.contestentService.query().subscribe(res => {
            const contestants = res.body;
            contestants.forEach(contestant => {
                if (contestant.tutor) {
                    const index = contestant.tutor.lastName;
                    if (!this.contestantsByTutor[index]) {
                        this.contestantsByTutor[index] = Array(7);
                    }
                    this.contestantsByTutor[index].unshift(contestant);
                    this.contestantsByTutor[index].pop();
                } else {
                    this.contestantWithoutTutor.push(contestant);
                }
            });
        });
        this.accountService.getTutors().subscribe(res => {
            this.tutors = res.body;
            this.tutors.forEach(({ lastName: index }) => {
                if (!this.contestantsByTutor[index]) {
                    this.contestantsByTutor[index] = Array(7);
                }
            });
        });
    }
}
