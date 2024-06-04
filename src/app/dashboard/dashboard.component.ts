import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '../user.service';
import { FormGroup, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../dto/user';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterModule, ReactiveFormsModule, CommonModule],
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css']
})


export class DashboardComponent implements OnInit {
  
  userService = inject(UserService);
  attempt: number = 0;
  feedback: string = '';
  randomNumber: number = 0;
  overall_score: number = 100;

  ranking: User[] = [];

  username = localStorage.getItem("session_username");

  constructor(private router: Router) { }

  guessForm = new FormGroup({
    guess: new FormControl('', [
      Validators.required,
      Validators.min(1),
      Validators.max(100),
      Validators.pattern('^[1-9][0-9]*$|^0$') // Ensure the input is numeric and doesn't start with 0 for multi-digit numbers
    ])
  });

  ngOnInit() {
    // if (localStorage.getItem('loggedIn') !== "true") {
    //   this.router.navigate(['/']);
    // }

    this.userService.getLeaderboard().subscribe({
      next: (v) => {
        this.ranking = v;
        console.log(this.ranking)
      }
    })

    this.username = localStorage.getItem("session_username");

    // Generate a random number when the component initializes
    this.generateRandomNumber();
  }

  generateRandomNumber() {
    // Generate a random number between 1 and 100
    this.randomNumber = Math.floor(Math.random() * 100) + 1;
  }

  submitGuess() {
    if (this.guessForm.valid) {
      const userGuess = this.guessForm.value.guess;

      if (userGuess) {
        this.attempt += 1;
        this.processGuess(Number(userGuess));
        this.guessForm.get("guess")?.setValue("");
      }
    } else {
      this.feedback = 'Please enter a valid number between 1 and 100.';
    }
  }

  processGuess(guess: number) {
    if (guess == this.randomNumber) {
      const username = this.username!;
      const overall_score = this.overall_score;

      this.userService.sendStatsUser({ username, overall_score }).subscribe({
        next: (v) => console.log('Send Stats', v),
      })
      this.feedback = 'Congratulations! You guessed the correct number!';
    }

    else if (guess < this.randomNumber) {
      this.overall_score -= 1;
      this.feedback = 'Too low! Try again.';
    }

    else {
      this.overall_score -= 1;
      this.feedback = 'Too high! Try again.';
    }
  }

  preventNonNumericInput(event: KeyboardEvent) {
    const input = event.key;
    const currentValue = (event.target as HTMLInputElement).value;
    if (!/^[0-9]$/.test(input)) {
      event.preventDefault();
    }
    else if (currentValue.length === 1 && currentValue[0] === '0' && input !== '0') {
      // Prevent input if the current value is '0' and the new input is a number (preventing leading zero in multi-digit numbers)
      event.preventDefault();
    }
  }

  logoutUser() {
    this.userService.logout();
    this.router.navigate(['/']);
  }
}
