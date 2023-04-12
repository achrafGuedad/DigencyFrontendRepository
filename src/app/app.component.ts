import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { HttpClient, HttpHandler, HttpHeaders} from '@angular/common/http';
import { NgForm} from '@angular/forms';
import { Observable } from 'rxjs';

import { FormBuilder, FormGroup } from '@angular/forms';
import { Personne } from './models/Personne';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent  implements OnInit{
  
  isValid:Boolean=false;
   idPersonne!:number;
 
  constructor(private http:HttpClient,private formBuilder: FormBuilder){

  }
  snapForm!: FormGroup;

  ngOnInit(): void {
    this.snapForm = this.formBuilder.group({
        nom: [null],
        nomArabe: [null],
        prenom: [null],
        prenomArabe: [null],
        dateNaissance: [null],
        cin: [null],
        profession: [null],
        typeCarte: [null],
        image: [null],
        
    });
}

selectedFile!:File;

public onFileChanged(event:Event) {
  //Select File
  console.log(event);
  if( event.target) {  this.selectedFile =   (event.target as HTMLInputElement).files?.[0] as File; 
     console.log(typeof this.selectedFile)           }
}

onSubmitForm() {
  console.log(typeof this.snapForm.value.nom);

  const formData = new FormData();
  let personne:Personne=new Personne();
  personne.nom=this.snapForm.value.nom;
  personne.nomArabe=this.snapForm.value.nomArabe;
  personne.prenom=this.snapForm.value.prenom;
  personne.prenomArabe=this.snapForm.value.prenomArabe;

    personne.dateNaissance=this.snapForm.value.dateNaissance;
  personne.cin=this.snapForm.value.cin;
  personne.profession=this.snapForm.value.profession;
  personne.typeCarte=this.snapForm.value.typeCarte;
  personne.image=this.selectedFile;

  console.log( personne );



    formData.append('nom', JSON.stringify(personne.nom));
    formData.append('nomArabe', JSON.stringify(personne.nomArabe));
    formData.append('prenom', JSON.stringify(personne.prenom));
    formData.append('prenomArabe', JSON.stringify(personne.prenomArabe));
    formData.append('dateNaissance', JSON.stringify(personne.dateNaissance));
    formData.append('cin', JSON.stringify(personne.cin));
    formData.append('profession', JSON.stringify(personne.profession));
    formData.append('typeCarte', JSON.stringify(personne.typeCarte));
    formData.append('imageFile',this.selectedFile);
     const headers =new HttpHeaders();
    
    this.http.post('http://localhost:9092/upload', formData,{responseType: 'text'}).

    subscribe(

      (data:any)=> { console.log(data); this.isValid=true;
      this.idPersonne=data; alert ('données bien enregistrées');},
      (error)=>{console.log(error);}
    )
  
}


chargerPdf(){

  console.log(typeof Number(this.idPersonne));

  
  this.http.get('http://localhost:9092/pdf/generate/'+Number(this.idPersonne),{responseType: 'arraybuffer'}).

    subscribe(

      (data:ArrayBuffer)=> {  this.isValid=true; 
        const blob = new Blob([data], { type: 'application/pdf' });
 
        const fileUrl = URL.createObjectURL(blob);
        window.open(fileUrl);
                },
      (error)=>{console.log(error); console.log("what is wrong whit you");}
    );



}



  





}
