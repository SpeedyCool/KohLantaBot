const Discord = require('discord.js');
const lowdb = require('lowdb');

const client = new Discord.Client();

const FileSync = require('lowdb/adapters/FileSync.js');
const adapter = new FileSync('db.json');
const db = lowdb(adapter);

let prefix = '!';
let usersCount = client.users.size;

client.on('ready', () => {

    console.log('Bot lancé \n Le prefix est: ' + prefix +'\n Il y a actuellement: ' + usersCount + ' membre(s) sur le serveur');
    gameOn = false;
    joinTeam = false;
    teamJaune = [];
    teamRouge = [];

})

let gameOn = false;
let joinTeam = false;
let teamJaune = [];
let teamRouge = [];

client.on('message', message => {

    let msgArgs = message.content.split(' ');
    let member = message.member;

    if(message.content.startsWith('!launchgame')){
        if(gameOn === false){
            gameOn = true;
            joinTeam = false;
            let confirmEmbed = new Discord.RichEmbed()
                .setAuthor(client.user.username)
                .setColor('#007800')
                .addField('Partie lancé !', 'Les joueur sont laché sur l\'ile');
            message.channel.sendEmbed(confirmEmbed);
        }else{
            let errorEmbed = new Discord.RichEmbed()
                .setAuthor(client.user.username)
                .setColor('#780000')
                .addField('Partie déjà lancé !', 'Finissez la partie avant de recommancé :)');
            message.channel.sendEmbed(errorEmbed);
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
})

client.login(process.env.TOKEN);
