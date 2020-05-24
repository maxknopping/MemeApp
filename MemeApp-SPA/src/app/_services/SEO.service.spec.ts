/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SEOService } from './SEO.service';

describe('Service: SEO', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SEOService]
    });
  });

  it('should ...', inject([SEOService], (service: SEOService) => {
    expect(service).toBeTruthy();
  }));
});
