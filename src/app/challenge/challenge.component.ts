import { Component, inject, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule } from '@angular/forms';
import { UserService } from '../user.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-challenge',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './challenge.component.html',
  styleUrl: './challenge.component.css'
})

export class ChallengeComponent implements OnInit {
  title = "Sign In";
  linkText = "Sign Up";
  buttonLabel = "Login";
  userService = inject(UserService);

  authMessage = "";

  constructor(private router: Router) { }

  ngOnInit() {
    const isLogged = localStorage.getItem('loggedIn');
    if (isLogged) {
      this.router.navigate(['/welcome']);
    }

    // this.userService.loggedIn$.subscribe(loggedIn => {
    //   if (loggedIn) {
    //     this.router.navigate(['/welcome']);
    //   }
    // });
  }

  authForm = new FormGroup({
    username: new FormControl(""),
    password: new FormControl("")
  });

  switchTab() {
    if (this.title === "Sign In") {
      this.title = "Sign Up";
      this.linkText = "Sign In";
      this.buttonLabel = "Register";
    } else {
      this.title = "Sign In";
      this.linkText = "Sign Up";
      this.buttonLabel = "Login";
    }
  }

  submitForm() {
    const username = this.authForm.value.username ?? "";
    const password = this.authForm.value.password ?? "";

    if (this.buttonLabel === "Login") {
      this.userService.loginUser({ username, password }).subscribe({
        next: (v) => {
          this.authMessage = "";
          this.router.navigate(['/welcome']);
        },
        error: (e) => this.authMessage = e.error.message,
      })

      // this.userService.getLeaderboard().subscribe({
      //   next: (v) => {
      //     this.authMessage = "";
      //   },
      //   error: (e) => this.authMessage = e.error.message,
      // })
    }

    else {
      this.userService.registerUser({ username, password }).subscribe({
        next: (v) => this.authMessage = v.message,
        error: (e) => this.authMessage = e.error.message,
      })
    }
  }
}
