import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameInfoDashboardComponent } from './game-info-dashboard.component';

describe('GameInfoDashboardComponent', () => {
  let component: GameInfoDashboardComponent;
  let fixture: ComponentFixture<GameInfoDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GameInfoDashboardComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(GameInfoDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
