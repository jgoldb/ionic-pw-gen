import { Injectable } from '@angular/core';
import {secureRandom, formatWord, generatePadding} from './helper-functions';
import {HttpClient} from '@angular/common/http';
import { Preferences } from '@capacitor/preferences';
import {AlertController} from '@ionic/angular';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {
  private static readonly STORAGE_KEY = 'passwords';
  public words: string[] = [];
  public savedPasswords: SavedPassword[] = [];

  constructor(private http: HttpClient, private alertController: AlertController) {
    this.loadWords();
    this.loadSaved();
  }

  public generate(numWords: number): string {
    let password = '';
    let availableWords = [...this.words]; // Copy the word list
    for (let i = 0; i < numWords; i++) {
      if (availableWords.length === 0) { // Reset the word list when all words have been used
        availableWords = [...this.words];
      }
      const randomIndex = secureRandom(availableWords.length);
      const word = availableWords[randomIndex];
      availableWords.splice(randomIndex, 1); // Remove the word from the list
      password += formatWord(word) + generatePadding(); // Add the word and padding to the password
    }
    return password;
  }

  public async save(description: string, password: string): Promise<void> {
    const passwords: SavedPassword[] = await this.getSaved();
    const newPassword: SavedPassword = { description, password };
    passwords.push(newPassword);
    await Preferences.set({
      key: PasswordService.STORAGE_KEY,
      value: JSON.stringify(passwords)
    });
    this.savedPasswords.push(newPassword);
  }

  public async remove(index: number): Promise<void> {
    const alert = await this.alertController.create({
      header: 'Confirm Delete',
      message: `Are you sure you want to delete this password (${this.savedPasswords[index].password})?`,
      buttons: [
        {
          text: 'Cancel',
          role: 'cancel'
        },
        {
          text: 'Delete',
          role: 'destructive',
          handler: async () => {
            this.savedPasswords.splice(index, 1);
            await Preferences.set({
              key: PasswordService.STORAGE_KEY,
              value: JSON.stringify(this.savedPasswords)
            });
          }
        }
      ]
    });
    await alert.present();
  }

  public async getSaved(): Promise<SavedPassword[]> {
    const { value } = await Preferences.get({ key: PasswordService.STORAGE_KEY });
    return value ? JSON.parse(value) : [];
  }

  private loadWords(): void {
    this.http.get('assets/words/words.txt', { responseType: 'text' }).subscribe({
      next: (wordList) => this.words = wordList.split('\n'),
    });
  }

  private loadSaved(): void {
    this.getSaved().then((passwords) => this.savedPasswords = passwords);
  }
}

export interface SavedPassword {
  password: string;
  description: string;
}
