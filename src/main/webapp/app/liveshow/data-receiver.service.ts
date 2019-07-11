import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, Observer, Subscription } from 'rxjs';

import { CSRFService } from 'app/core/auth/csrf.service';
import { WindowRef } from 'app/core/tracker/window.service';
import { AuthServerProvider } from 'app/core/auth/auth-jwt.service';

import * as SockJS from 'sockjs-client';
import * as Stomp from 'webstomp-client';
import { WebsocketData } from 'app/liveshow/vm.model';

@Injectable({ providedIn: 'root' })
export class DataReceiverService {
    stompClient: Stomp.Client;
    subscriber = null;
    connection: Promise<any>;
    connectedPromise: any;
    listener: Observable<any>;
    listenerObserver: Observer<any>;
    alreadyConnectedOnce = false;
    private subscription: Subscription;

    constructor(
        private router: Router,
        private authServerProvider: AuthServerProvider,
        private $window: WindowRef,
        // tslint:disable-next-line: no-unused-variable
        private csrfService: CSRFService
    ) {
        this.connection = this.createConnection();
        this.listener = this.createListener();
    }

    connect() {
        if (this.connectedPromise === null) {
            this.connection = this.createConnection();
        }
        // building absolute path so that websocket doesn't fail when deploying with a context path
        const loc = this.$window.nativeWindow.location;
        let url;
        url = '//' + loc.host + loc.pathname + 'websocket/tracker';
        const authToken = this.authServerProvider.getToken();
        if (authToken) {
            url += '?access_token=' + authToken;
        }
        const socket = new SockJS(url);
        this.stompClient = Stomp.over(socket);
        this.stompClient.debug = () => {};
        const headers = {};
        this.stompClient.connect(
            headers,
            () => {
                this.connectedPromise('success');
                this.connectedPromise = null;
                if (!this.alreadyConnectedOnce) {
                    this.alreadyConnectedOnce = true;
                }
            }
        );
    }

    disconnect() {
        if (this.stompClient !== null) {
            this.stompClient.disconnect();
            this.stompClient = null;
        }
        if (this.subscription) {
            this.subscription.unsubscribe();
            this.subscription = null;
        }
        this.alreadyConnectedOnce = false;
    }

    receive() {
        return this.listener;
    }

    subscribe() {
        this.connection.then(() => {
            this.subscriber = this.stompClient.subscribe('/topic/liveshow', data => {
                this.listenerObserver.next(JSON.parse(data.body));
            });
        }, console.log);
    }

    unsubscribe() {
        if (this.subscriber !== null) {
            this.subscriber.unsubscribe();
        }
        this.listener = this.createListener();
    }

    private createListener(): Observable<any> {
        return new Observable<WebsocketData>(observer => {
            this.listenerObserver = observer;
        });
    }

    private createConnection(): Promise<any> {
        return new Promise((resolve, reject) => (this.connectedPromise = resolve));
    }
}
