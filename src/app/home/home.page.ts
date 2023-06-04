import {Component} from '@angular/core';
import {PasswordService} from '../services/password.service';
import { Clipboard } from '@capacitor/clipboard';

@Component({
  selector: 'app-home',
  templateUrl: 'home.page.html',
  styleUrls: ['home.page.scss'],
})
export class HomePage {
  private static readonly DEFAULT_NUM_WORDS = 4;

  public numWords: number = HomePage.DEFAULT_NUM_WORDS;
  public password: string = '';
  public description: string = '';

  constructor(public passwordService: PasswordService) { }

  public generatePassword(): void {
    this.password = this.passwordService.generate(this.numWords);
  }

  public savePassword(): void {
    this.passwordService.save(this.description, this.password);
    this.password = '';
    this.description = '';
    this.numWords = HomePage.DEFAULT_NUM_WORDS;
  }

  async copyPassword(password: string): Promise<void> {
    await Clipboard.write({
      string: password
    });
  }
}
