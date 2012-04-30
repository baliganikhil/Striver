var setInterval_id_loading_no = 0;
var setInterval_id_reducing_no = 0;
var game_pattern = [];

var number_buttons_pressed = 0;
var currently_glowing_button = 0;

var game_in_progress = false;

$(document).ready(function() {
	var high_scores = localStorage.getItem('striver_high_scores');
	high_scores = JSON.parse(high_scores);
	var score_map = {};

	if (high_scores === null || high_scores === "" || high_scores === undefined) {
		return;
	}

	$(high_scores).each(function(key, value) {
		if (score_map[value["score"]] === undefined) {
			score_map[value["score"]] = [value["name"]];
		} else {
			score_map[value["score"]].push(value["name"]);
		}
	});

	console.log(score_map)

	score_map_keys = Object.keys(score_map);
	$(score_map_keys).each(function(key, value) {
		score_map_keys[key] = parseInt(value, 10);
	});

	score_map_keys.sort(function(a,b){return b - a});

	$(score_map_keys).each(function(key, value) {
		$('#hall_of_fame_names').append('<tr><td>' + value + '</td><td>' + (score_map[value]).toLocaleString().replace(/,/g, '<br>') + '</td></tr>');
	});
});

$('#btn_begin_game').live('click', function(event) {
	$('.floating_box').show().text(3);
	setInterval_id_loading_no = setInterval(reduceLoadingNumer, 600);
});

$('.striver_button').live('click', function() {
	if (game_in_progress === false) {
		return;
	}

	var btn_value = $(this).data('value');
	btn_value = parseInt(btn_value, 10);
	if (game_pattern[number_buttons_pressed] != btn_value) {
		game_over();
		return;
	}

	number_buttons_pressed++;

	if (game_pattern.length == number_buttons_pressed) {
		$('.current_score').text(number_buttons_pressed);
		number_buttons_pressed = 0;
		get_next_pattern();
		show_current_pattern();
		return;
	}

});

function begin_game() {
	setInterval_id_loading_no = 0;
	setInterval_id_reducing_no = 0;
	game_pattern.length = 0;

	number_buttons_pressed = 0;
	currently_glowing_button = 0;

	$('.current_score').text('0');

	get_next_pattern();
	show_current_pattern();
}

function game_over() {
	$('#play_area').addClass('transparent');
	$('.floating_box').text("Game over").fadeIn();
	game_in_progress = false;

	$('#high_score_panel').slideDown();
}

function show_current_pattern() {
	currently_glowing_button = 0;
	game_in_progress = false;
	setInterval_id_reducing_no = setInterval (glow_next_btn, 1000);
}

function glow_next_btn() {
	console.log("Loading " + currently_glowing_button);
	glow_button(get_colour_for_number(game_pattern[currently_glowing_button++]));

	if (currently_glowing_button == game_pattern.length) {
		clearInterval(setInterval_id_reducing_no);
		setInterval_id_reducing_no = 0;
		game_in_progress = true;
	}

}

function reduceLoadingNumer() {
	var n = $('.floating_box').text();
	n = parseInt(n, 10);
	n--;

	if (n >= 0) {
		$('.floating_box').text(n);
	} else {
		clearInterval(setInterval_id_loading_no);
		$('.floating_box').hide().text(3);
		$('#play_area').removeClass('transparent');
		begin_game();
	}
}

function remove_play_area_transparency() {
	$('#play_area').removeClass('transparent');
}

function glow_button(btn_name) {
	var glow_class = btn_name + '_glow';
	$('#' + btn_name).addClass(glow_class).delay(500).queue(function() {
		$('#' + btn_name).removeClass(glow_class);
		$(this).dequeue();
	});

}

function get_next_pattern() {
	var x = getRandomInt(1, 4);
	game_pattern.push(x);

	var btn_name = "";

	btn_name = get_colour_for_number(x);

	//glow_button(btn_name);
}

function get_colour_for_number(number) {
	switch(number) {
		case 1: btn_name = 'red';
				break;

		case 2: btn_name = 'green';
				break;

		case 3: btn_name = 'blue';
				break;

		case 4: btn_name = 'yellow';
				break;

		default: btn_name = 'red';
				break;
	}

	return btn_name;
}

function getRandomInt (min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

$('#close_help').live('click', function() {
	$('#help_panel').slideUp();
});

$('#btn_help').live('click', function() {
	$('#help_panel').slideDown();
});

$('#close_high_score').live('click', function() {
	$('#high_score_panel').slideUp();
});

$('#save_player').live('click', function() {
	var high_scores = localStorage.getItem('striver_high_scores');
	high_scores = JSON.parse(high_scores);
	var player_name = $('#player_name').val().trim();
	var score = number_buttons_pressed.toLocaleString();
	var score_map = {};

	if (player_name === "")  {
		player_name = "Anon";
	}

	if (score_map[score] === "" || score_map[score] === null || score_map[score] === undefined) {
		high_scores.push({"score": score, "name": player_name});
	} else {
		//high_scores
	}

	localStorage.setItem('striver_high_scores', JSON.stringify(high_scores));
});