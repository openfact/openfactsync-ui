import { Router, ActivatedRoute } from '@angular/router';
import { Component, OnInit, HostBinding, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs/Subscription';
import { EmptyStateConfig } from 'patternfly-ng/empty-state';

import { UBLDocument, UBLDocumentService } from './../../ngx/ngx-clarksnut';
import { DocumentQuery, DocumentQueryBuilder } from './../../models/document-quey';
import { SearchEventService } from '../../shared/search-event.service';
import { SearchEvent } from './../../models/search-event';

import * as FileSaver from 'file-saver';

@Component({
  selector: 'cn-inbox-document',
  templateUrl: './inbox-document.component.html',
  styleUrls: ['./inbox-document.component.scss']
})
export class InboxDocumentComponent implements OnInit, OnDestroy {

  @HostBinding('class') classList: string = 'services-items-filter';

  documents: UBLDocument[] = [];
  currentNumberOfItems: number;
  totalNumberOfItems: number;

  emptyStateConfig: EmptyStateConfig;

  // Search
  private searchEvent: SearchEvent;
  private queryBuilder: DocumentQueryBuilder;

  private subscriptions: Subscription[] = [];

  constructor(
    private router: Router,
    private activatedRoute: ActivatedRoute,
    private searchEventService: SearchEventService,
    private documentService: UBLDocumentService) {
    this.subscriptions.push(
      this.searchEventService.eventListener.subscribe((event) => {
        this.searchEvent = event;
        if (!event) {
          this.searchEvent = {} as SearchEvent;
        }
        this.search();
      })
    );
  }

  ngOnInit() {
    this.emptyStateConfig = {
      info: 'The active filters are hiding all documents items.',
      helpLink: {
        hypertext: 'Clear Filters',
        url: '#/emptystate'
      },
      title: 'No results match.'
    } as EmptyStateConfig;
  }

  ngOnDestroy() {
    this.subscriptions.forEach((subs) => subs.unsubscribe());
  }

  search() {
    if (!this.queryBuilder) {
      this.queryBuilder = DocumentQuery.builder();
    }

    this.queryBuilder.filterText(this.searchEvent.keyword);
    this.queryBuilder.spaces([]);
    this.queryBuilder.limit(10);

    this.documentService.search(this.queryBuilder.build().query()).subscribe((searchResult) => {
      this.documents = searchResult.data;
      this.currentNumberOfItems = searchResult.data.length;
      this.totalNumberOfItems = searchResult.totalResults;
    });
  }

  downloadXml(document: UBLDocument) {
    this.documentService.downloadDocumentById(document.id).subscribe(val => {
      FileSaver.saveAs(val.file, val.filename || `${document.attributes.assignedId}.xml`);
    });
  }

  downloadPdf(document: UBLDocument) {
    this.documentService.printDocumentById(document.id).subscribe(val => {
      FileSaver.saveAs(val.file, val.filename || `${document.attributes.assignedId}.pdf`);
    });
  }

  edit(document: UBLDocument) {
    this.router.navigate([document.id], { relativeTo: this.activatedRoute });
  }
}