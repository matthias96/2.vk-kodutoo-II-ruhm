(function(){
   "use strict";

   var Loomahaldus = function(){

     // SEE ON SINGLETON PATTERN
     if(Loomahaldus.instance){
       return Loomahaldus.instance;
     }
     //this viitab Loomahaldus fn
     Loomahaldus.instance = this;

     this.routes = Loomahaldus.routes;
     // this.routes['home-view'].render()

     console.log('moosipurgi sees');

     // KÕIK muuutujad, mida muudetakse ja on rakendusega seotud defineeritakse siin
     this.click_count = 0;
     this.currentRoute = null;
     console.log(this);

     // hakkan hoidma kõiki purke
     this.animals = [];

     // Kui tahan Moosipurgile referenci siis kasutan THIS = MOOSIPURGI RAKENDUS ISE
     this.init();
   };

   window.Loomahaldus = Loomahaldus; // Paneme muuutja külge

   Loomahaldus.routes = {
     'home-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
         console.log('>>>>avaleht');
       }
     },
     'list-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
         console.log('>>>>loend');

         //simulatsioon laeb kaua
         window.setTimeout(function(){
           document.querySelector('.loading').innerHTML = 'Laetud!';
         }, 3000);

       }
     },
     'manage-view': {
       'render': function(){
         // käivitame siis kui lehte laeme
       }
     }
   };

   // Kõik funktsioonid lähevad Moosipurgi külge
   Loomahaldus.prototype = {

     init: function(){
       console.log('Rakendus läks tööle');

       //kuulan aadressirea vahetust
       window.addEventListener('hashchange', this.routeChange.bind(this));

       // kui aadressireal ei ole hashi siis lisan juurde
       if(!window.location.hash){
         window.location.hash = 'home-view';
         // routechange siin ei ole vaja sest käsitsi muutmine käivitab routechange event'i ikka
       }else{
         //esimesel käivitamisel vaatame urli üle ja uuendame menüüd
         this.routeChange();
       }

       //saan kätte purgid localStorage kui on
       if(localStorage.animals){
           //võtan stringi ja teen tagasi objektideks
           this.animals = JSON.parse(localStorage.animals);
           console.log('laadisin localStorageist massiiivi ' + this.animals.length);

           //tekitan loendi htmli
           this.animals.forEach(function(animal){

               var new_animal = new Animal(animal.id, animal.title, animal.injury);

               var li = new_animal.createHtmlElement();
               document.querySelector('.list-of-animals').appendChild(li);

           });

       }else{

		   //küsin AJAXIGA
			var xhttp = new XMLHttpRequest();
			xhttp.onreadystatechange = function() {
				if (xhttp.readyState == 4 && xhttp.status == 200) {

					console.log(xhttp.responseText);
					//tekst -> objekktideks
					Loomahaldus.instance.animals = JSON.parse(xhttp.responseText);
					console.log(Loomahaldus.instance.animals);

					//teen purgid htmli
					Loomahaldus.instance.animals.forEach(function(animal){

					   var new_animal = new Animal(animal.id, animal.title, animal.injury);

					   var li = new_animal.createHtmlElement();
					   document.querySelector('.list-of-animals').appendChild(li);

				   });

				   //salvestan localStoragisse
				   localStorage.setItem('animals', JSON.stringify(Loomahaldus.instance.animals));


				}
			};
			xhttp.open("GET", "save.php", true);
			xhttp.send();


	   }


       // esimene loogika oleks see, et kuulame hiireklikki nupul
       this.bindEvents();

     },

     bindEvents: function(){
       document.querySelector('.add-new-animal').addEventListener('click', this.addNewClick.bind(this));

       //kuulan trükkimist otsikastis
       document.querySelector('#search').addEventListener('keyup', this.search.bind(this));

     },
    editAnimal: function(event){



  
        var title= document.querySelectorAll('.EditTitle').value;
        var injury= document.querySelector('.EditInjury').value;
        this.animals=JSON.parse(localStorage.animals);
        clicked_li.parentNode.removeChild(clicked_li);
        for(var i=0; i<this.animals.length; i++){
          if(this.animals[i].id == selected_id){
            this.animals[i].title= title;
            this.animals[i].injury = injury;
            break;
          }
        }
        localStorage.setItem('animals',JSON.stringify(this.animals));
        location.reload();
      },

	 deleteAnimal: function(event){

		// millele vajutasin SPAN
		console.log(event.target);

		// tema parent ehk mille sees ta on LI
		console.log(event.target.parentNode);

		//mille sees see on UL
		console.log(event.target.parentNode.parentNode);

		//id
		console.log(event.target.dataset.id);

		var c = confirm("Oled kindel?");

		// vajutas no, pani ristist kinni
		if(!c){	return; }

		//KUSTUTAN
		console.log('kustutan');

		// KUSTUTAN HTMLI
		var ul = event.target.parentNode.parentNode;
		var li = event.target.parentNode;

		ul.removeChild(li);

		//KUSTUTAN OBJEKTI ja uuenda localStoragit

		var delete_id = event.target.dataset.id;

		for(var i = 0; i < this.animals.length; i++){

			if(this.animals[i].id == delete_id){
				//see on see
				//kustuta kohal i objekt ära
				this.animals.splice(i, 1);
				break;
			}
		}

		localStorage.setItem('animals', JSON.stringify(this.animals));



	 },
     search: function(event){
         //otsikasti väärtus
         var needle = document.querySelector('#search').value.toLowerCase();
         console.log(needle);

         var list = document.querySelectorAll('ul.list-of-animals li');
         console.log(list);

         for(var i = 0; i < list.length; i++){

             var li = list[i];

             // ühe listitemi sisu tekst
             var stack = li.querySelector('.content').innerHTML.toLowerCase();

             //kas otsisõna on sisus olemas
             if(stack.indexOf(needle) !== -1){
                 //olemas
                 li.style.display = 'list-item';

             }else{
                 //ei ole, index on -1, peidan
                 li.style.display = 'none';

             }

         }
     },

     addNewClick: function(event){
       //salvestame purgi
       //console.log(event);

       var title = document.querySelector('.title').value;
       var injury = document.querySelector('.injury').value;

       //console.log(title + ' ' + injury);
       //1) tekitan uue Animal'i
	   var id = guid();
       var new_animal = new Animal(id, title, injury);

       //lisan massiiivi purgi
       this.animals.push(new_animal);
       console.log(JSON.stringify(this.animals));
       // JSON'i stringina salvestan localStorage'isse
       localStorage.setItem('animals', JSON.stringify(this.animals));


		//AJAX
		var xhttp = new XMLHttpRequest();

		//mis juhtub kui päring lõppeb
		xhttp.onreadystatechange = function() {

			console.log(xhttp.readyState);

			if (xhttp.readyState == 4 && xhttp.status == 200) {

				console.log(xhttp.responseText);
			}
		};

		//teeb päringu
		xhttp.open("GET", "save.php?id="+id+"&title="+title+"&injury="+injury, true);
		xhttp.send();


       // 2) lisan selle htmli listi juurde
       var li = new_animal.createHtmlElement();
       document.querySelector('.list-of-animals').appendChild(li);


     },

     routeChange: function(event){

       //kirjutan muuutujasse lehe nime, võtan maha #
       this.currentRoute = location.hash.slice(1);
       console.log(this.currentRoute);

       //kas meil on selline leht olemas?
       if(this.routes[this.currentRoute]){

         //muudan menüü lingi aktiivseks
         this.updateMenu();

         this.routes[this.currentRoute].render();


       }else{
         /// 404 - ei olnud
       }


     },

     updateMenu: function() {
       //http://stackoverflow.com/questions/195951/change-an-elements-class-with-javascript
       //1) võtan maha aktiivse menüülingi kui on
       document.querySelector('.active-menu').className = document.querySelector('.active-menu').className.replace('active-menu', '');

       //2) lisan uuele juurde
       //console.log(location.hash);
       document.querySelector('.'+this.currentRoute).className += ' active-menu';

     }

   }; // MOOSIPURGI LÕPP

   var Animal = function(new_id, new_title, new_injury){
	 this.id = new_id;
     this.title = new_title;
     this.injury = new_injury;
     console.log('created new animal');
   };

   Animal.prototype = {
     createHtmlElement: function(){

       // võttes title ja injury ->
       /*
       li
        span.letter
          M <- title esimene täht
        span.content
          title | injury
       */

       var li = document.createElement('li');

       var span = document.createElement('span');
       span.className = 'letter';

       var letter = document.createTextNode(this.title.charAt(0));
       span.appendChild(letter);

       li.appendChild(span);

       var span_with_content = document.createElement('span');
       span_with_content.className = 'content';

       var content = document.createTextNode(this.title + ' | ' + this.injury);
       span_with_content.appendChild(content);

       li.appendChild(span_with_content);

	   //DELETE nupp
	   var span_delete = document.createElement('span');
	   span_delete.style.color = "red";
	   span_delete.style.cursor = "pointer";

	   //kustutamiseks panen id kaasa
	   span_delete.setAttribute("data-id", this.id);

	   span_delete.innerHTML = " Kustuta";

	   li.appendChild(span_delete);

	   //keegi vajutas nuppu
	   span_delete.addEventListener("click", Loomahaldus.instance.deleteAnimal.bind(Loomahaldus.instance));
     //edit nupp
     var span_edit= document.createElement('button');
     span_edit.style.color = "blue";
     span_edit.style.cursor = "pointer";
     span_edit.setAttribute('data-id', this.id);
     span_edit.innerHTML= "Muuda andmeid";
     li.appendChild(span_edit);
     span_edit.addEventListener('click', Loomahaldus.instance.editAnimal.bind(Loomahaldus.instance));


       return li;

     }
   };

   //HELPER
   function guid(){
		var d = new Date().getTime();
		if(window.performance && typeof window.performance.now === "function"){
			d += performance.now(); //use high-precision timer if available
		}
		var uuid = 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
			var r = (d + Math.random()*16)%16 | 0;
			d = Math.floor(d/16);
			return (c=='x' ? r : (r&0x3|0x8)).toString(16);
		});
		return uuid;
	}

   // kui leht laetud käivitan Moosipurgi rakenduse
   window.onload = function(){
     var app = new Loomahaldus();
   };

})();
