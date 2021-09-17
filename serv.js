

class Client_info {

  identifier;
  pseudo;
  socket_connection;
  is_in_game;
  has_played;
  next_action;
}


function generate_unique_identifier() {
  //generates random id;
  let s4 = () => {
    return Math.floor((1 + Math.random()) * 0x10000)
      .toString(16)
      .substring(1);
  }
  //return id of format 'aaaaaaaa'-'aaaa'-'aaaa'-'aaaa'-'aaaaaaaaaaaa'
  return s4() + s4() + '-' + s4() + '-' + s4() + '-' + s4() + '-' + s4() + s4() + s4();
}



const WebSocket = require('ws');

// Set up server
const web_socket = new WebSocket.Server({ port: 2002 });
console.log('starting serv');
// Wire up some logic for the connection event (when a client connects) 


var turn_nb = 0;
var move_dude = 'none';
var move_elf = 'none';
var list_client_info=[];

web_socket.on('connection', (ws) => {
  console.log('Connected : ' + web_socket.clients.size);


  display_client_info(list_client_info);
  // Definition aléatoire d'un nom
  connected_client = new Client_info;
  connected_client.pseudo = "Gégé";
  ws.identifier = generate_unique_identifier();
  connected_client.identifier = ws.identifier;
  list_client_info.push(connected_client);
 
  ws.nom = web_socket.clients.size < 2 ? "A" : "T";
  ws.action = 'none';
  ws.has_played = false;

  // Fonction qui permet de refresh la valeur isAlive si la fonction est appeler
  function raquette() {
    this.isAlive = true;
  }

  // Defintion de base a l'instant T0
  ws.isAlive = true;
  // On ecoute si le client repond 'pong', si c'est le cas on appel la fonction en callback
  ws.on('pong', raquette);

  // Si la connection est fermée
  ws.on('close', () => { 
    console.log("Quelqu'un est parti =(") 
    
    list_client_info = remove_client_info(ws.identifier, list_client_info);
    display_client_info(list_client_info);
  
  })

  if (web_socket.clients.size == 1) {
    ws.send('Welcome ' + ws.nom + '. Waiting for a second player...');
    console.log('sending to dude');

    ws.on('message', (message) => {

      console.log(ws.nom + ' : ' + message);

      msg = JSON.parse(message);
      if (msg.contains('code')) {
        switch (msg['code']) {

          case 'chat':
            // send msg['message'] to all
            break;
          case 'action':
            ws.action = msg['action']; // bon tout s'appelle pareil mais np
            // faire des array avec les noms des clients, les actions, et autres infos
            ws.has_played = true;
            break;

        }
      }

      web_socket.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(JSON.stringify({ 'turn': turn_nb, 'dude_mov': move_dude, 'elf_mov': move_elf }));
        }
      })


    });

  } else if (web_socket.clients.size == 2) {
    //ws.nom = 'Elf';
    // Send a message

    ws.send('Elf');
    ws.send('Welcome ' + ws.nom);
    console.log('sending to elf');


  }
});


// Interval qui tourne en boucle et qui verifie que toute les clients sont encore la
const interval_value = setInterval(() => {
  web_socket.clients.forEach((ws) => {
    console.log(ws.nom);
    if (ws.isAlive === false) {
      console.log('La connexion a ete interrompu');
      list_client_info = remove_client_info(ws.identifier, list_client_info);
      display_client_info(list_client_info);
 
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




function remove_client_info(id_to_remove, list){
  
  console.log('Removing client : ' + id_to_remove);

  get_id = x => x.identifier;
  id_list = list_client_info.map(get_id);
  list_client_info.splice(id_list.indexOf(id_to_remove), 1);
  return list_client_info;
}


function display_client_info(list){
  console.log('Client size :', list.length);
  list.forEach((client,idx)=>
    console.log(idx+' : '+client.identifier));
};


