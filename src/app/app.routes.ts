import { Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { HomeComponent } from './components/home/home.component';
import { QuienSoyComponent } from './components/quien-soy/quien-soy.component';
import { RegistroComponent } from './components/registro/registro.component';
import { AhorcadoComponent } from './pages/ahorcado/ahorcado.component';
import { MayorMenorComponent } from './pages/mayor-menor/mayor-menor.component';
import { PreguntadosComponent } from './pages/preguntados/preguntados.component';
import { JuegoPropioComponent } from './pages/juego-propio/juego-propio.component';

export const routes: Routes = [
        {"path": "home", component : HomeComponent},
        {"path": "login", component : LoginComponent},  
        {"path": "registro", component : RegistroComponent},
        {"path": "quien-soy", component : QuienSoyComponent},
        {"path": "preguntados", component: PreguntadosComponent},
        {"path": "ahorcado", component : AhorcadoComponent},
        {"path": "mayor-menor", component: MayorMenorComponent},
        {"path": "juego-propio", component: JuegoPropioComponent},
        
        
        {"path": '', redirectTo: 'home', pathMatch: 'full' },
        {"path": '**', redirectTo: '/home' }
        
];
