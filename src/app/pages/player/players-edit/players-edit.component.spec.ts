import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersEditComponent } from './players-edit.component';

describe('PlayersEditComponent', () => {
  let component: PlayersEditComponent;
  let fixture: ComponentFixture<PlayersEditComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersEditComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayersEditComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
