function sleep(milliseconds) {
  const date = Date.now();
  let currentDate = null;
  do {
    currentDate = Date.now();
  } while (currentDate - date < milliseconds);
}
  
const WebSocket = require('ws');

// Set up server
const web_socket = new WebSocket.Server({ port: 3000});
console.log('starting serv');
// Wire up some logic for the connection event (when a client connects) 


var nb_co=0;
var id_first;
var id_second;

var turn_nb = 0;
var has_played_dude=false;
var has_played_elf = false;
var move_dude = 'none';
var move_elf = 'none';

    
/*function get_ponged() {
  clearTimeout(tm);
}*/

web_socket.on('connection', (ws) => {
  console.log('Connected : '+ web_socket.clients.size);

  // Definition aléatoire d'un nom
  ws.nom = web_socket.clients.size < 2 ? "A" : "T";

  // Fonction qui permet de refresh la valeur isAlive si la fonction est appeler
  function raquette() {
    this.isAlive = true;
  }

  // Defintion de base a l'instant T0
  ws.isAlive = true;
  // On ecoute si le client repond 'pong', si c'est le cas on appel la fonction en callback
  ws.on('pong', raquette);

  // Si la connection est coupé
  ws.on('close', () => { console.log("Quelqu'un est partie =(")})

  if (web_socket.clients.size < 100) {
    ws.send('Welcome '+ ws.nom +'. Waiting for a second player...');
    console.log('sending to dude');

    ws.on('message',  (message) => {
      console.log(ws.nom + ' : '+ message);

          if (message.includes("mov:")){
            move_dude = message;
            has_played_dude = true;
          }


          if (has_played_dude && has_played_elf){
           
            has_played_dude = false;
            has_played_elf = false;

            wweb_socket.clients.forEach( (client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send({'turn': turn_nb, 'dude_mov': move_dude, 'elf_mov': move_elf});
              }
              });

          }


        });

    } else if (web_socket.clients.size == 2){
        //ws.nom = 'Elf';
        // Send a message
        
        ws.send('Elf');
        ws.send('Welcome '+ ws.nom);
        console.log('sending to elf');

        ws.on('message',  (message) => {
          console.log('Elf : '+message);

            
          if (message.includes("Jean")){
            web_socket.clients.forEach( (client) => {
            if (client.readyState === WebSocket.OPEN) {
              client.send('READYYIUYUYUY');
            }
            });
          }

          if (message.includes("mov:")){
            move_elf = message;
            has_played_elf = true;
          }
        
          if (has_played_dude && has_played_elf){
           
            has_played_dude = false;
            has_played_elf = false;

            web_socket.clients.forEach( (client) => {
              if (client.readyState === WebSocket.OPEN) {
                client.send({'turn': turn_nb, 'dude_mov': move_dude, 'elf_mov': move_elf});
              }
              });
          }
        });
      }
});


// Interval qui tourne en boucle et qui verifie que toute les clients sont encore la
const interval_value = setInterval( () => {
  web_socket.clients.forEach( (ws) => {
    console.log(ws.nom);
    if (ws.isAlive === false) {
      console.log('La connexion a ete interrompu');
      return ws.terminate();
    }
  
    ws.isAlive = false;
    // Le serveur effectue un ping vers le client par la connexion ws.
    ws.ping();
  });
}, 3000);

web_socket.on('close', () => {
  clearInterval(interval_value);
});


