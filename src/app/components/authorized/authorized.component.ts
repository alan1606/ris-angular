import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';
import { TokenService } from 'src/app/services/token.service';

@Component({
  selector: 'app-authorized',
  templateUrl: './authorized.component.html',
  styleUrls: ['./authorized.component.css']
})
export class AuthorizedComponent implements OnInit {

  code = '';

  constructor(
    private activatedRoute: ActivatedRoute,
    private authService: AuthService,
    private tokenService: TokenService,
    private router: Router
    ) { }

    async ngOnInit(): Promise<void> {
      try {
        this.activatedRoute.queryParams.subscribe(async (data) => {
          this.code = data['code'];
          const code_verifier = this.tokenService.getVerifier();
          this.tokenService.deleteVerifier();
          await this.getToken(this.code, code_verifier);
        });
      } catch (error) {
        console.error(error);
      }
    }
  
    async getToken(code: string, code_verifier: string): Promise<void> {
      try {
        const data = await this.authService.getToken(code, code_verifier).toPromise();
        this.tokenService.setTokens(data.access_token, data.refresh_token);
        this.router.navigate(['']);
      } catch (err) {
        console.error(err);
      }
    }
}
