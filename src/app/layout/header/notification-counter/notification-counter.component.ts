import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { Router, NavigationEnd, ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs/Subscription';
import { Observable } from 'rxjs/Observable';

import { Notification, Notifications, NotificationType, NotificationAction } from '../../../ngx/ngx-base';
import { RequestAccessService, RequestAccessToSpace } from './../../../ngx/ngx-clarksnut';
import { UserService, User } from './../../../ngx/ngx-login-client';

import { UserNotificationsService } from './../services/notifications.service';

@Component({
  selector: 'cn-notification-counter',
  templateUrl: './notification-counter.component.html',
  styleUrls: ['./notification-counter.component.scss']
})
export class NotificationCounterComponent implements OnInit, OnDestroy {

  loggedInUser: User;

  showNotifications = false;
  expanded = false;

  loadingPendingRequests: boolean;
  pendingRequests: RequestAccessToSpace[] = [];

  private subscriptions: Subscription[] = [];

  constructor(
    private userService: UserService,
    private requestAccessService: RequestAccessService,
    private userNotifications: UserNotificationsService,
    private notifications: Notifications) {
  }

  ngOnInit() {
    this.userService.loggedInUser
      .map((user) => {
        this.loggedInUser = user;
      })
      .do(() => {
        this.refreshPendingRequests();
        this.subscriptions.push(
          Observable.interval(1000 * 60 * 5).subscribe(() => {
            this.refreshPendingRequests();
          })
        );
      })
      .publish().connect();
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  toggleNotifications() {
    this.showNotifications = !this.showNotifications;
    if (this.showNotifications) {
      this.refreshPendingRequests();
    }
  }

  toggleExpand() {
    this.expanded = !this.expanded;
  }

  refreshPendingRequests() {
    this.loadingPendingRequests = true;

    this.userNotifications.getUserNotifications('me', 'pending').subscribe((val) => {
      this.pendingRequests = val.attributes.requestAccesses;
      this.loadingPendingRequests = false;
    });
  }

  acceptRequest(request: RequestAccessToSpace, index: number) {
    request.attributes.status = 'accepted';
    this.requestAccessService.updateRequest(request).subscribe(
      (val) => {
        this.pendingRequests.splice(index, 1);
      },
      (error) => {
        this.handleError('Could not process the invitation', NotificationType.DANGER);
      }
    );
  }

  rejectRequest(request: RequestAccessToSpace, index: number) {
    request.attributes.status = 'rejected';
    this.requestAccessService.updateRequest(request).subscribe(
      (val) => {
        this.pendingRequests.splice(index, 1);
      },
      (error) => {
        this.handleError('Could not process the invitation', NotificationType.DANGER);
      }
    );
  }

  acceptAllRequests() {
    Observable.forkJoin(
      this.pendingRequests
        .map((request) => {
          request.attributes.status = 'accepted';
          return request;
        })
        .map((request) => this.requestAccessService.updateRequest(request))
    ).subscribe(
      () => {
        this.refreshPendingRequests();
      },
      (error) => {
        this.handleError('Could not process the invitation', NotificationType.DANGER);
      }
    );
  }

  rejectAllRequests() {
    Observable.forkJoin(
      this.pendingRequests
        .map((request) => {
          request.attributes.status = 'rejected';
          return request;
        })
        .map((request) => this.requestAccessService.updateRequest(request))
    ).subscribe(
      () => {
        this.refreshPendingRequests();
      },
      (error) => {
        this.handleError('Could not process the invitation', NotificationType.DANGER);
      }
    );
  }

  private handleError(error: string, type: NotificationType) {
    this.notifications.message({
      message: error,
      type: type
    } as Notification);
  }
}
