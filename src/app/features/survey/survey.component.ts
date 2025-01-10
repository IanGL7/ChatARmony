import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Firestore } from '@angular/fire/firestore';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { addDoc, collection } from 'firebase/firestore';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-survey',
  standalone: true,
  imports: [ReactiveFormsModule, MatButtonModule, MatInputModule],
  templateUrl: './survey.component.html',
  styleUrls: ['./survey.component.css']
})
export class SurveyComponent {
  surveyForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private firestore: Firestore,
    public dialogRef: MatDialogRef<SurveyComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.surveyForm = this.fb.group({
      satisfaction: [null, [Validators.required, Validators.min(1), Validators.max(10)]]
    });
  }

  async submitSurvey() {
    if (this.surveyForm.valid) {
      const surveyData = {
        userId: this.data.userId,
        satisfaction: this.surveyForm.value.satisfaction,
        timestamp: new Date()
      };

      try {
        await addDoc(collection(this.firestore, 'surveys'), surveyData);
        alert('¡Gracias por tu feedback!');
        this.dialogRef.close();
      } catch (error) {
        console.error('Error al enviar la encuesta:', error);
      }
    }
  }

  closeDialog() {
    this.dialogRef.close();
  }
}
