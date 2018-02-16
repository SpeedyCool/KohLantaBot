const Discord = require('discord.js');
const lowdb = require('lowdb');

const client = new Discord.Client();

const FileSync = require('lowdb/adapters/FileSync.js');
const adapter = new FileSync('db.json');
const db = lowdb(adapter);

db.defaults({object: []}).write();

let prefix = '!';
let usersCount = client.users.size;

client.on('ready', () => {

    console.log('Bot lancé \n Le prefix est: ' + prefix +'\n Il y a actuellement: ' + usersCount + ' membre(s) sur le serveur');
    client.user.setPresence({game: {name: '!help ;)', type: 0}});

    gameOn = false;
    joinTeam = false;
    teamJaune = [];
    teamRouge = [];
    epreuve = [];
    epreuveStarted = false
    findObeject = [];
    objectFind = false;

    console.log(epreuve.includes(2));

})

let gameOn = false;
let joinTeam = false;

let teamJaune = [];
let teamRouge = [];

let epreuve = [];
let epreuveStarted = false;
let reponse;

let findObeject = [];
let objectFind = false;

client.on('message', message => {
    
    let msgArgs = message.content.split(' ');
    let member = message.member;

    if(message.content.startsWith('!launchgame')){
        if(gameOn === false){
            if(!teamJaune.length == 0 && !teamRouge.length == 0 && teamJaune.length == teamRouge.length){
                gameOn = true;
                joinTeam = false;
                let confirmEmbed = new Discord.RichEmbed()
                    .setAuthor(client.user.username)
                    .setColor('#007800')
                    .addField('Partie lancé !', 'Les joueur sont laché sur l\'ile');
                message.channel.sendEmbed(confirmEmbed);
            }else{
                let error = new Discord.RichEmbed()
                    .setAuthor(client.user.username)
                    .setColor('#ab0000')
                    .addField('Les conditions ne sont pas requises !', 'même nombre de joueur dans chaque equipe !');
                message.channel.sendEmbed(error);
            }
        }else{
            let errorEmbed = new Discord.RichEmbed()
                .setAuthor(client.user.username)
                .setColor('#780000')
                .addField('Partie déjà lancé !', 'Finissez la partie avant de recommancé :)');
            message.channel.sendEmbed(errorEmbed);
        }
    }

    if(message.content.startsWith('!newepreuve')){

        let epreuveChoice = randomNumber(2);
        if(epreuveChoice == 0){
            return;
        }
        epreuve.push(epreuveChoice);
        lancementEpreuve(epreuveChoice); 

    }

    if(message.content.startsWith('!startepreuve')){
        if(msgArgs[1] == 'code'){
            let confirmEpreuveVariable = confirmEpreuve(code);
            message.channel.send(confirmEpreuveVariable);
            reponse = 'if number 8';
            epreuveStarted = true;
        }
    }

    if(message.content.startsWith('!setjointeam')){
        if(gameOn == false){
            if(msgArgs[1] == 'true'){
                joinTeam = true;
                let joinEmbed = new Discord.RichEmbed()
                    .setAuthor(client.user.username)
                    .setColor('RANDOM')
                    .addField('Vous pouvez désormais rejoindre une team', '!join red(rouge)/yellow(jaune)');
                message.channel.sendEmbed(joinEmbed);
                return;
            }else if(msgArgs[1] == 'false'){
                joinTeam = false;
                let joinEmbed = new Discord.RichEmbed()
                    .setAuthor(client.user.username)
                    .setColor('RANDOM')
                    .addField('Vous ne pouvez plus rejoindre les teams', 'Le jeu risque de démarrer !');
                message.channel.sendEmbed(joinEmbed);
                return;
            }else{
                let error = new Discord.RichEmbed()
                    .setAuthor(client.user.username)
                    .setColor('#bb0000')
                    .addField('Veuillez choisir true ou false', '!setjointeam  true(vrai)/false(faux) ! ');
                message.channel.sendEmbed(error);
                return;
            }
        }else{
            let error = new Discord.RichEmbed()
                .setAuthor(client.user.username)
                .setColor("#ab0000")
                .addField('La partie est lancé', 'Vous ne pouvez pas activer cette commande !');
            message.channel.sendEmbed(error);
        }
    }

    if(message.content.startsWith('!r')){
        if(epreuveStarted == true){
            let mreponse = message.content.substr(3);
            if(mreponse == reponse){
                epreuveStarted = false;
                if(message.member.roles.find('name', 'teamJaune')){
                    pointGagne('jaune');
                    return;
                }else{
                    pointGagne('rouge');
                    return;
                }
            }else{
                message.reply('réponse fausse');
            }
        }
    }

    if(message.content.startsWith('!join')){
        if(joinTeam == true){
            if(msgArgs[1] == 'red' || msgArgs[1] == "rouge"){
                if(!member.roles.find('name', 'TeamRouge')){
                    if(teamRouge.length == 8){
                        let errorEmbed = new Discord.RichEmbed()
                            .setAuthor(client.user.username)
                            .setColor('#780000')
                            .addField('Cette team est déja plaine', 'Désolé');
                        message.channel.sendEmbed(errorEmbed);
                        return;
                    }
                    if(member.roles.find('name', 'TeamJaune')){
                        leaveTeam('TeamJaune');
                    }
                    member.addRole(message.guild.roles.find('name', 'TeamRouge'));
                    teamRouge.push(message.author.username);
                    let redEmbed = new Discord.RichEmbed()
                        .setColor('#eb0000')
                        .addField(message.author.username + ' vient de rejoindre l\'équipe rouge', 'Il y a ' + teamRouge.length + '/8 joueurs dans cette équipe !');
                    message.channel.sendEmbed(redEmbed);
                }else{
                    let errorEmbed = new Discord.RichEmbed()
                        .setAuthor(client.user.username)
                        .setColor('#780000')
                        .addField('Vous avez déjà rjoint cette team', 'pour la quitter faites !leave');
                    message.channel.sendEmbed(errorEmbed);
                }

            }else if(msgArgs[1] == 'yellow' || msgArgs[1] == "jaune"){
                if(!member.roles.find('name', 'TeamJaune')){
                    if(teamJaune.length == 8){
                        let errorEmbed = new Discord.RichEmbed()
                            .setAuthor(client.user.username)
                            .setColor('#780000')
                            .addField('Cette team est déja plaine', 'Désolé');
                        message.channel.sendEmbed(errorEmbed);
                        return;
                    }
                    if(member.roles.find('name', 'TeamRouge')){
                        leaveTeam('TeamRouge');
                    }
                    member.addRole(message.guild.roles.find('name', 'TeamJaune'));
                    teamJaune.push(message.author.username);
                    let yellowEmbed = new Discord.RichEmbed()
                        .setColor('#FFFF00')
                        .addField(message.author.username + ' vient de rejoindre l\'équipe jaune', 'Il y a ' + teamJaune.length + '/8 joueurs dans cette équipe !');
                    message.channel.sendEmbed(yellowEmbed);
                }else{
                    let errorEmbed = new Discord.RichEmbed()
                        .setAuthor(client.user.username)
                        .setColor('#780000')
                        .addField('Vous avez déjà rjoint cette team', 'pour la quitter faites !leave');
                    message.channel.sendEmbed(errorEmbed);
                }
            }else{

                let errorEmbed = new Discord.RichEmbed()
                    .setAuthor(client.user.username)
                    .setColor('#780000')
                    .addField('Cette team n\'existe pas !', '!join red/yallow / !join rouge/jaune');
                message.channel.sendEmbed(errorEmbed);

            }
        }else{
            let error = new Discord.RichEmbed()
                .setAuthor(client.user.username)
                .setColor("#ac0000")
                .addField('Vous ne pouvez actuellement pas rejoindre de teams', 'pour plus d\'infos demander au staff !');
            message.channel.sendEmbed(error);
        }
    }
       
    if(message.content.startsWith('!leave')){
        if(message.member.roles.find('name', 'TeamRouge') || message.member.roles.find('name', 'TeamJaune')){

            if(teamJaune.includes(message.member.user.username)){
                leaveTeam('TeamJaune');
            }
            else{
                leaveTeam('TeamRouge');
            }

            let confirmEmbed = new Discord.RichEmbed()
                .setAuthor(client.user.username)
                .setColor('#009900')
                .addField('Vous avez bien quitter votre team', 'vous n\'etes plus dans l\'aventure');
            message.channel.sendEmbed(confirmEmbed);

        }else{

            let error = new Discord.RichEmbed()
                .setAuthor(client.user.username)
                .setColor('#dd0000')
                .addField('Vous n\'êtes dans aucune équipe', '!join pour rejoidre une équipre');
            message.channel.sendEmbed(error);

        }
    }

    if(message.content.startsWith('!help')){
        let help = new Discord.RichEmbed()
            .setAuthor(client.user.username)
            .setColor('RANDOM')
            .setTitle('Liste des commandes du bot !')
            .addBlankField(true)
            .addField('!help', 'Avoir la liste des commandes du bot.')
            .addBlankField(true)
            .addField('Commande Administrateur', 'Seul les admin du serveur peuvent avoir accès à ces commandes !')
            .addField('!launchgame', 'Lancer une partie de KohLanta.')
            .addField('!setjointeam', 'Autoriser les joueurs à rejoindre les équipes.')
            .addField('!newepreuve', 'Lancement d\'une épreuve !')
            .addBlankField(true)
            .addField('Liste de commandes pour les joueurs !', 'commandes executable par tout le monde !')
            .addField('!join', 'Rejoidre une team.')
            .addField('!leave', 'Quitter une équipe.');
        message.author.sendEmbed(help);
        
    }

    if(message.content.startsWith('!find')){

        if(objectFind == false){
            if(findObeject.includes(message.author.username)){
                let Embed = new Discord.RichEmbed()
                    .setAuthor(client.username)
                    .setColor('#ab0000')
                    .addField('Vous avez déjà chercher l\'object', 'réessayez plus tard !');
                message.channel.send(Embed);
            }else{

                findObeject.push(message.author.username);
                if(Math.random() * 100 < 10){
                    objectFind = true;

                    if(!db.get('object').find({user: message.author.id})){
                        db.get('object')
                            .push({user: message.author.id, hasObject: true})
                            .write();
                    }else{
                        db.get('object').find({user: message.author.id}).assign({user: message.author.id, hasObject: true});
                    }

                    let Embed = new Discord.RichEmbed()
                        .setAuthor(client.username)
                        .setColor('#00ab00')
                        .addField('Vous venez de trouvé l\'object', 'Vous pourrez l\'utiliser au conseil !');
                    message.author.send(Embed); 
                }else{
                    if(!db.get('object').find({user: message.author.id})){
                        db.get('object')
                            .push({user: message.author.id, hasObject: false})
                            .write();
                    }else{
                        db.get('object').find({user: message.author.id}).assign({user: message.author.id, hasObject: false});
                    }

                    let Embed = new Discord.RichEmbed()
                        .setAuthor(client.username)
                        .setColor('#00ab00')
                        .addField('Vous n\'avez pas trouvé l\'object', 'Pas de chance !');
                    message.author.send(Embed); 

                }

            }
        }else{

            let Embed = new Discord.RichEmbed()
                .setAuthor(client.username)
                .setColor('#00ab00')
                .addField('Vous n\'avez pas trouvé l\'object', 'Pas de chance !');
            message.author.send(Embed);

        }
    }

    function leaveTeam(team){

        if(team == 'TeamJaune'){
            message.member.removeRole(message.member.roles.find('name', 'TeamJaune'));
            let pseudo = teamJaune.indexOf(message.member.user.username);
            teamJaune.splice(pseudo);
        }
        if(team == 'TeamRouge'){
            message.member.removeRole(message.member.roles.find('name', 'TeamRouge'));
            let pseudo = teamRouge.indexOf(message.member.user.username);
            teamRouge.splice(pseudo);
        }
    }

    function randomNumber(max){

        let r = Math.floor(Math.random() * Math.floor(max)) + 1;
        if(epreuve.includes(r)){
            if(epreuve.length == 2){
                let error = new Discord.RichEmbed()
                    .setAuthor(client.user.username)
                    .setColor('#dd0000')
                    .addField('Toutes les épreuves ont eu lieu', 'redémarrez une parie !');
                message.channel.sendEmbed(error);
                return 0;
            }
            randomNumber(2);
        }else{
            return r;
        }
  
    }

    function lancementEpreuve(number){

        if(number == 1){
            message.channel.sendMessage('epreuve 1 choisi');
        }
        if(number == 2){
            message.channel.sendEmbed(epreuveCode);
            message.author.sendEmbed(confirmEpreuveCode);
            let tribuJ = message.guild.channels.find('name', 'tribu-jaune');
            let tribuR = message.guild.channels.find('name', 'tribu-rouge');
            tribuJ.sendEmbed(livreDeCode);
            tribuR.sendEmbed(livreDeCode);
        }
        console.log(epreuve);

    }

    function pointGagne(team){
        let victoire = new Discord.RichEmbed()
            .setAuthor(client.user.username)
            .setColor('#00aa00')
            .addField('L\'équipe ' + team + ' a remporté l\'épreuve !', '+1 points pour l\'équipe !');
        message.channel.sendEmbed(victoire);
    }
})

client.login(process.env.TOKEN);

let livreDeCode = new Discord.RichEmbed()
    .setAuthor('KohLanta')
    .setColor('#00aaFF')
    .setTitle('Livre de code pour l\'épreuve')
    .addField('Ce livre contient different ligne de code qui vont vous servir pour l\'épreuve', 'Alors apprennez les !')
    .addBlankField(true)
    .addField('function parler(mot)', 'pour faire parler quelqu\'un ou quelque chose !')
    .addField('let variable = 10', 'pour définir une variable égale à 10')
    .addField('if(something == something)', 'pour savoir si quelquchose = quelquechose !')
    .addBlankField(true)
    .addField('Apprennez ces trois ligne de code', 'Lors de l\'épreuve il peut y avoir des variante !');

let epreuveCode = new Discord.RichEmbed()
    .setAuthor('KohLanta')
    .setColor('RANDOM')
    .setTitle('Epreuve du code')
    .addField('@everyone L\'épreuve du code à été choisi', 'Un livre de code vous à été donné dans vos channels')
    .addBlankField(true)
    .addField('Lisez le et quand le staff aura décidé de lancé la partie', 'alors vous devrez compléter le code demandé !')
    .addBlankField(true)
    .setFooter('Bonne chance à tous');


let code1 = new Discord.RichEmbed()
    .setAuthor('KohLanta')
    .setColor('#ab0000')
    .addField('L\'épreuve du code est lancé', 'Il faut trouvé la bonne réponse la première équipe qui truve gagne le point')
    .addBlankField(true)
    .addField('Voici le code', 'Je veux savoir si ma variable number est égale à 8')
    .addField(' __(______ == _)', '!r pour répondre, séparez les éléments de réponses par des espace: !r jl hhhhhh 7');

function confirmEpreuve(epr){

    let confirmEpreuveEmbed = new Discord.RichEmbed()
        .setAuthor('KohLanta')
        .setColor('RANDOM')
        .setTitle('Epreuve du code lancé !')
        .addField('Vous pouvez lancer l\'épreuve quand vous voulez', '!startepreuve ' + epr);
    return confirmEpreuveEmbed;
}
