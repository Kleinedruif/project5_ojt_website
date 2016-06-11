# Project 5: Ome Joop's Tour (Groep J): Website

We coderen in het Engels. Commitnamen en beschrijvingen moeten ook zinvol zijn, houd de code netjes en overzichtelijk.

## Installatie en uitvoeren Website

### Installeren van NodeJS v4.4.5 LTS
https://nodejs.org/en/
Waar het wordt geïnstalleerd maakt niet uit. Locatie kan dus aangepast worden. De rest alles default laten en installeren.
![alt tag](http://i.imgur.com/zjLvv3t.png)

### Installeren van Python
https://www.python.org/downloads/
![alt tag](http://i.imgur.com/wQhg3Ez.png)
Maakt niet uit waar het wordt geïnstalleerd, zolang het Path wordt gezet op volgende scherm

Op het volgende scherm kan Python toegevoegd worden aan Path, doe dit.
![alt tag](http://i.imgur.com/LZ7dxY3.png)
Klik daarna op Next en ga door met installeren.

 
### Installeren OpenSSL
https://slproweb.com/products/Win32OpenSSL.html
Kies de laatste, niet light versie, en dan 32 of 64 bits.
![alt tag](http://i.imgur.com/SS99eSv.png)
Bij de installatie alles default laten en installeren op de C schijf. Als het niet op  de C schijf staat werkt het standaard niet en moet er iets aan de config ergens veranderd worden. De package die gebruikt maakt van OpenSSL kan het dan niet vinden.


### Binnenhalen project
Haal het project binnen waar je het wilt hebben.
![alt tag](http://i.imgur.com/PncoM4S.png)
Open een command prompt in deze map (kan door op het file path de klikken en “cmd” in te typen).
Run het command “npm install” (Dit haalt alle packeges binnen die nodig zijn voor het draaien van de server).
Als het goed is nu alles geïnstalleerd en zou het gestart kunnen worden doormiddel van “npm start”.
![alt tag](http://i.imgur.com/enHZhuu.png)


### Installeren Grunt
Run het commando “npm install -g grunt-cli”
Grunt wordt gebruikt voor het omzetten van SCSS en SASS naar normale CSS. Na het installeren moet naar elke keer als je de server start in een andere server “grunt watch” worden gerunt (Wordt gestart vanaf de map waar ook de server wordt gestart). Met dit commando wordt op elke file change de CSS opnieuwe gebuild.

### Extra
Om ontwikkelen makkelijker te maken kan “npm install nodemon –g” geïnstalleerd worden en dan start de server met “nodemon start”. Met nodemon word bij elke file save de server opnieuw opstart, zodat dit niet handmatig hoeft.
![alt tag](http://i.imgur.com/rhYN05M.png)
(Zoiets zou je moeten krijgen na het opstarten van de server via nodemon)
We maken gebruikt van de editor Visual Studio Code, maar elke andere IDE of tekst editor kan gebruikt worden; er hoeft immers niet gecompileerd te worden.
 

## Opzet Github:

Master branch = stabiele demo. 2-3 dagen voordat we het gesprek hebben met de klant / presentatie.

    Testen en goedkeuren door hele team, alle features testen en dan overzetten

Develop branch = test demo

    Code in deze branch moet de applicatie niet laten crashen

Feature branch 

    Naam = duidelijk gebaseerd op de Taiga Userstory
    Pas een Pull Request maken als de feature af is
    Pull Request worden door meerdere personen nagekeken. Als alles goedgekeurd is wordt dat gemeld als comment

## Code Reviewing: 

Wanneer een branch af is, moet deze ge-pullrequest worden naar de Develop branch en door twee man binnen het team gecheckt worden.
