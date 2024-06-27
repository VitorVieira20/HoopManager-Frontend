import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersCreateComponent } from './players-create.component';

describe('PlayersCreateComponent', () => {
  let component: PlayersCreateComponent;
  let fixture: ComponentFixture<PlayersCreateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersCreateComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayersCreateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
