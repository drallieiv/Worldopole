$(function() {
	$('.trainerLoader').hide();
	var page = 0;
	
	loadTrainers(page);
	page++;
	var win = $(window);
	win.scroll(function() {
		// End of the document reached?
		if ($(document).height() - win.height() == win.scrollTop()) {
			loadTrainers(page,$('input#name').val());
			page++;
		}
	});
	$( "#searchTrainer" ).submit(function( event ) {
		page = 0;
		$('input#name').val()!=''?$('#trainersGraph').hide():$('#trainersGraph').show();
		$('#trainersContainer tr:not(.trainersTemplate)').remove();
		loadTrainers(page,$('input#name').val());
		page++;
		event.preventDefault();
	});
	function loadTrainers(page,name=''){
		$('.trainerLoader').show();
		
		var trainerIndex = 0+(page*10);
		$.ajax({
			'async': true,
			'type': "GET",
			'global': false,
			'dataType': 'json',
			'url': "core/process/aru.php",
			'data': { 
				'request': "", 
				'target': 'arrange_url',
				'method': 'method_target',
				'type' : 'trainer',
				'page' : page,
				'name' : name
			}
		}).done(function (data) {	
			$.each(data, function(trainerName, trainer){
				trainerIndex++;					
				
				var trainersInfos = $('<tr>',{id: 'trainerInfos_'+trainer.name}).css('border-bottom','2px solid '+(trainer.team=="3"?"#ffbe08":trainer.team=="2"?"#ff7676":"#00aaff"));
				trainersInfos.append($('<td>',{id : 'trainerIndex_'+trainer.name, text : trainerIndex}));
				trainersInfos.append($('<td>',{id : 'trainerRank_'+trainer.name, text : trainer.rank}));
				trainersInfos.append($('<td>',{id : 'trainerName_'+trainer.name, text : trainerName}).click(
					function(e){
						e.preventDefault();$('input#name').val(trainerName);
						$( "#searchTrainer" ).submit();
						$('#trainerName_'+trainer.name).unbind('click');
					}
				));
				trainersInfos.append($('<td>',{id : 'trainerLevel_'+trainer.name, text : trainer.level}));
				trainersInfos.append($('<td>',{id : 'trainerGyms_'+trainer.name, text : trainer.gyms}));
				trainersInfos.append($('<td>',{id : 'trainerLastSeen_'+trainer.name, text : trainer.last_seen}));
				$('#trainersContainer').append(trainersInfos);
				var trainersPokemonsRow = $('<tr>',{id: 'trainerPokemons_'+trainer.name});
				var trainersPokemons = $('<td>',{colspan : 6});
				var trainersPokemonsContainer = $('<div>',{class : "container"});
				for(pokeIndex = 0; pokeIndex<trainer.pokemons.length;pokeIndex++){
					var pokemon = trainer.pokemons[pokeIndex];
					var trainerPokemon = $('<div>',{id : 'trainerPokemon_'+pokemon.pokemon_uid, class: "col-md-1 col-xs-4 pokemon-single", style: "text-align: center" });
					trainerPokemon.append($('<a>',{href : 'pokemon/'+pokemon.pokemon_id}).append($('<img />',{src : 'core/pokemons/'+pokemon.pokemon_id+'.png', 'class' : 'img-responsive '+(pokemon.gym_id==null?"unseen":"")})));
					trainerPokemon.append($('<p>',{class : 'pkmn-name'}).append(pokemon.cp));
					var progressBar = $('<div>',{class : 'progress'}).css('height','6px');
					progressBar.append($('<div>',{title: 'IV Stamina :'+pokemon.iv_stamina, class: 'progress-bar progress-bar-success' ,role : 'progressbar', 'aria-valuenow' :pokemon.iv_stamina, 'aria-valuemin' : 0, 'aria-valuemax' : 45}).css('width',((100/45)*pokemon.iv_stamina ) + '%' ))
					progressBar.append($('<div>',{title: 'IV Attack :'+pokemon.iv_attack, class: 'progress-bar progress-bar-danger' ,role : 'progressbar', 'aria-valuenow' : pokemon.iv_attack, 'ria-valuemin' : 0, 'aria-valuemax' : 45}).css('width',((100/45)*pokemon.iv_attack ) + '%' ))
					progressBar.append($('<div>',{title: 'IV Defense :'+pokemon.iv_defense, class: 'progress-bar progress-bar-info' ,role : 'progressbar', 'aria-valuenow': pokemon.iv_defense, 'aria-valuemin' : 0, 'aria-valuemax' : 45}).css('width',((100/45)*pokemon.iv_defense ) + '%' ))
					trainerPokemon.append(progressBar);
					trainersPokemonsContainer.append(trainerPokemon);
					
				}
				
				trainersPokemons.append(trainersPokemonsContainer);
				trainersPokemonsRow.append(trainersPokemons);
				$('#trainersContainer').append(trainersPokemonsRow);
				
			});
			
			$('.trainerLoader').hide();
		
		});
	};
});
