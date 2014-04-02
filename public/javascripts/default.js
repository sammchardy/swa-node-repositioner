var pageEls = {}
var pageData = {};

Zepto(function($){

	pageEls.forms = $('form');

	pageEls.forms.on('submit', function(e) {
		var $this = $(this);
		$.post($this.attr('action'), $(this).serialize(), function(res) {
			console.log('res:' + JSON.stringify(res));
		})

		return false;
	});

});
