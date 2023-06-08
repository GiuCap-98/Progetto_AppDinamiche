import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RentFilmComponent } from './rent-film.component';

describe('RentFilmComponent', () => {
  let component: RentFilmComponent;
  let fixture: ComponentFixture<RentFilmComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RentFilmComponent]
    });
    fixture = TestBed.createComponent(RentFilmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
