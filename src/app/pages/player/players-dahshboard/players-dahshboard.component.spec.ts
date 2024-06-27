import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayersDahshboardComponent } from './players-dahshboard.component';

describe('PlayersDahshboardComponent', () => {
  let component: PlayersDahshboardComponent;
  let fixture: ComponentFixture<PlayersDahshboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PlayersDahshboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(PlayersDahshboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
