# 🔬 Simulatore di Focometro Torico
**Autore e Progettista: Prof. Francesco Castelli**

Versione torica derivata dall'impostazione definitiva del simulatore di focometro sferico.

## Logica didattica

Esempio di lente:

`+2.00 -1.50 ax 40°`

Il simulatore produce due condizioni di fuoco:

- `L1 = +2.00 D` con il gruppo di mire nitido orientato a `130°`
- `L2 = +0.50 D` con il gruppo di mire nitido orientato a `40°`

La stessa lente deve essere poi espressa nei due modi equivalenti:

### Ricetta
`+2.00 -1.50 ax 40°`

### Trasposta
`+0.50 +1.50 ax 130°`

## Funzioni

- Tamburo del potere da -25 D a +25 D con passo 0.125 D.
- Ghiera asse 0°–180° a scatti di 5°.
- Due gruppi di mire ortogonali con sfocatura indipendente.
- Ricerca combinata di potere e asse.
- Inserimento separato di ricetta e trasposta con selezione diretta della casella tramite clic/tocco.
- Verifica completa di sfera, cilindro e asse.
- Controllo con mouse, tastiera fisica e pulsanti a schermo.

## Controlli

- Rotellina mouse: potere.
- Rotellina sulla ghiera: asse a scatti di 5°.
- Shift + rotellina: asse.
- Frecce ↑ ↓: potere.
- Frecce ← →: asse a scatti di 5°.
- Tab: cambia campo di risposta.
- Invio: verifica / lente successiva.

## Note

Il progetto è destinato a scopi didattici e non commerciali.

**© 2026 - Prof. Francesco Castelli - Tutti i diritti riservati.**


## v1.2
- Corretto l'allineamento tra tacca del tamburo e linea rossa di lettura.
- Rimossa la dicitura `5°` dai pulsanti di rotazione dell'asse; il passo resta di 5°.


## v1.3
- Scala dell'asse trasformata in semicerchio superiore di 180°.
- Eliminate tutte le tacche della metà inferiore.
- 0° posizionato a destra, 90° in alto, 180° a sinistra.
- Indice rosso della ghiera riallineato alla nuova scala.
- Sulla ghiera viene mostrato 0° quando l'indice è a destra; 0° e 180° restano equivalenti nella verifica ottica.


## v1.4
- Corretta la direzione della ghiera:
  - 0° è a destra.
  - Ruotando in senso antiorario l'asse aumenta: 0 → 5 → ... → 180.
  - 180° è un vero estremo grafico a sinistra e non viene trasformato in 0°.
- Pulsante ◀ = rotazione antioraria / asse crescente.
- Pulsante ▶ = rotazione oraria / asse decrescente.
- Freccia sinistra = asse crescente; freccia destra = asse decrescente.
- La normalizzazione 0° = 180° resta usata solo nei calcoli ottici e nella verifica della prescrizione.


## v1.5
- Corretto definitivamente il verso di rotazione delle mire.
- Ora aumentando l'asse da 0° a 180° sia l'indice sia il reticolo ruotano visivamente in senso antiorario.
- Sequenza corretta: 0° a destra → 90° in alto → 180° a sinistra.


## v1.6
- Rimossa la scritta "ASSE" sopra l'oculare.
- Aggiunti riferimenti numerici 0°, 30°, 60°, 90°, 120°, 150°, 180° attorno al semicerchio superiore dell'oculare.
- Rimossa la riga "Tocca o clicca direttamente la casella da compilare / Campo attivo".
- La casella selezionata resta indicata solo dall'evidenziazione del bordo.


## v1.7
- Migliorata la distribuzione visiva dei riferimenti angolari attorno all'oculare.
- 0° e 180° leggermente più esterni.
- 30°/150°, 60°/120° e 90° riposizionati per rendere la sequenza più ordinata.
- Dimensione dei numeri leggermente ridotta per aumentare la leggibilità.


## v1.8
- Corretta definitivamente la posizione delle etichette dell'asse.
- 0° fissato esplicitamente a destra.
- 180° fissato esplicitamente a sinistra.
- Etichette 30°, 60°, 90°, 120°, 150° posizionate manualmente per evitare clipping o inversioni.


## v1.9
- Riferimenti angolari spostati più all'esterno per migliorare la leggibilità.
- 0° e 180° restano completamente visibili ai lati.
- Aumentato leggermente lo spazio attorno all'oculare senza modificare la dimensione dello strumento.


## v2.0
- Rifinita la posizione dei riferimenti 30°, 90° e 150°.
- 90° più centrato e alto.
- 30° e 150° più esterni e leggermente più bassi.
- Migliorata la simmetria visiva del semicerchio.


## v2.1
- Rifatta la geometria della ghiera asse.
- Aumentato il viewBox SVG a 440×440 per creare spazio reale all'esterno delle tacche.
- Tacche mantenute in una corona interna.
- Numeri 0°, 30°, 60°, 90°, 120°, 150°, 180° posizionati su una corona esterna separata.
- Eliminata la sovrapposizione dei numeri alle tacche.

## v2.2
- Corretto il clipping delle etichette 0°, 90° e 180°.
- 90° spostato leggermente più in basso.
- 0° spostato leggermente verso l'interno.
- 180° spostato leggermente verso l'interno.

## v2.3
- Ripristinate le posizioni originali delle etichette della v2.1.
- Allargato il viewBox SVG invece di spostare 0°, 90° e 180°.
- Aggiunto margine esterno reale attorno alla ghiera per evitare il clipping.

## v2.4
- Ripristinato il viewBox 440×440 per evitare il rimpicciolimento della scala.
- Aumentata fisicamente la ghiera a 440×440 px.
- Ripristinata la piena visibilità delle tacche laterali e dell'indice rosso.
- Numeri mantenuti nella posizione geometrica della v2.1/v2.3.

## v2.5
- Aggiunte L1 e L2 con POTERE e ASSE NITIDO.
- Verifica separata di letture, ricetta e trasposta.
- Oculare, ghiera, tacche e indice rosso della v2.4 invariati.

## v2.8
- Ripristinata la v2.5 come base.
- Tastierino mantenuto nella parte alta del pannello destro.
- Sotto il tastierino è stata creata un'unica area incorniciata.
- LETTURE è a sinistra.
- RICETTA e TRASPOSTA sono a destra, una sotto l'altra.
- Nessuna modifica a oculare, ghiera, tacche, indice rosso o logica di verifica.

## v3.1
- Base ripristinata dalla v2.8.
- LETTURE, RICETTA e TRASPOSTA sono tutte sopra il tastierino.
- Eliminato lo spazio fra cornice delle risposte e tastierino.
- Colonna destra allargata realmente a 580 px.
- Cornice delle risposte estesa a tutta la larghezza disponibile.
- Tastierino allargato e allineato alla stessa larghezza della cornice.
- Ridotto lo spazio fra colonna sinistra e colonna destra.
- Nessuna modifica a oculare, ghiera, tacche, indice rosso o logica.

## v3.2
- Ridotta quasi completamente la fascia vuota sopra il box LETTURE/RICETTA/TRASPOSTA.
- Avvicinato il box risposte alla riga Lente / Punti / Riprova.
- Ridotto il padding superiore del pannello destro.
- Feedback vuoto e pulsante nascosto non occupano più spazio.
- Nessuna modifica al layout interno, al tastierino o allo strumento.

## v3.3
- Aggiunto uno spazio di 10 px tra il box LETTURE/RICETTA/TRASPOSTA e il tastierino.
- Tutto il resto della v3.2 resta invariato.

## v3.4
- Spostato l'intero blocco destro di 24 px verso destra.
- Box risposte, tastierino, larghezze e spazi interni restano invariati.

## v3.5
- Corretta la logica di verifica di RICETTA e TRASPOSTA.
- RICETTA non è più obbligatoriamente in cilindro negativo.
- Sono accettate entrambe le forme equivalenti della lente come RICETTA.
- TRASPOSTA deve contenere l'altra forma equivalente.
- Esempio valido in entrambe le direzioni:
  +2.00 -1.50 ax 40° ↔ +0.50 +1.50 ax 130°.
- Grafica e layout della v3.4 invariati.

## v3.6
- Corretta la verifica delle LETTURE.
- L1 e L2 possono essere inserite in qualunque ordine.
- È valido sia L1=prima lettura / L2=seconda lettura, sia l'inverso.
- Potere e asse nitido devono comunque restare correttamente associati tra loro.
- Grafica e resto della logica della v3.5 invariati.

## v3.7
- Ogni cella accetta al massimo 3 cifre complessive.
- Il segno meno e il separatore decimale non contano nel limite delle 3 cifre.
- È ammesso un solo separatore decimale.
- Il tastierino a schermo continua a usare il punto (.).
- Da tastiera fisica sono accettati sia punto (.) sia virgola (,), normalizzati correttamente.
- I campi asse restano interi e non accettano separatori decimali o segno.
- Grafica e logica della v3.6 invariati.

## v3.8
- Ridotta la sensibilità della rotellina del mouse/clickwheel.
- Aggiunto accumulo del movimento prima di applicare uno scatto.
- Potere resta a passi di 0.125 D.
- Asse resta a passi di 5°.
- Soglia impostata a 80 per rendere il controllo meno nervoso.
- Pulsanti e tastiera fisica restano invariati.
