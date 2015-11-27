$.fn.selectToAutocomplete = function( options ){

	var overflow = $('<div>').addClass('autocomplete-overflow').appendTo($('body'));
	overflow.click(function(){
		$('.autocomplete-list').hide();
		$(this).hide();
	});
	
	var keycodes = 
	{
		down : "40",
		up : "38",
		enter:'13'
	}
	
	var settings = $.extend({
        }, options );
		
	$(this).each(function(){
		
		var select = $(this);
		
		select.hide();
		var container = $('<div>').addClass('autocomplete-container');
		var input = $('<input>').attr('type','text').appendTo(container).val(select.children('[selected=selected]').text());
		var list = $('<ul>').addClass('autocomplete-list').appendTo(container);
		
		select.find('option').each(function(){
			$('<li>').addClass('autocomplete-item').addClass($(this).text()==""?"empty":"").data('value',$(this).val()).text($(this).text()).appendTo(list).click(function(){
				var self = $(this);
				select.children('[value='+$(this).data('value')+']').each(function(){this.selected = true;});
				input.val($(this).text());
				list.hide();
				self.addClass('selected');
				self.siblings().each(function(){
					$(this).toggleClass('match',$(this).text().toLowerCase().indexOf(self.text().toLowerCase())!==-1);
				});
				input.focus();
				overflow.hide();
				select.trigger('change',[{'value':$(this).data('value')}]);
			}).addClass($(this).attr('selected')?'selected':'').addClass($(this).text().toLowerCase().indexOf(input.val().toLowerCase())!==-1?'match':'');
		});
		
		input.keyup(function(e){
			
			if(e.keyCode==keycodes.enter || e.keyCode==keycodes.up || e.keyCode==keycodes.down)
				return;
			list.toggle(!input.val()=='');
			overflow.toggle(!input.val()=='');
			
			list.children().each(function(){
				$(this).toggleClass('match',$(this).text().toLowerCase().indexOf(input.val().toLowerCase())!==-1);
			})
		});
		
		container.keydown(function(e)
		{
			if(e.keyCode==keycodes.down)
			{
				var selected = list.children('.selected');
				if(!selected.length)
					list.children('.match:not(.empty)').first().addClass('selected');
				else
				{
					var next = selected.nextAll('.match').first();
					if(next.length)
					{
						selected.removeClass('selected');
						next.addClass('selected');
					}
				}
			}
			else if(e.keyCode==keycodes.up)
			{
				var selected = list.children('.selected');
				if(selected.length)
				{
					var prev = selected.prevAll('.match').first();
					if(prev.length)
					{
						selected.removeClass('selected');
						prev.addClass('selected');
					}
				}
			}
			else if(e.keyCode==keycodes.enter)
			{
				e.preventDefault();
				var selected = list.children('.selected');
				if(!selected.length)
				{
					list.hide();
					return;
				}
				selected.click();
			}
		});
		
		input.click(function(){
			list.show();
			overflow.show();
		});
		
		select.bind('clear',function(){
			list.find('li').each(function(){
				$(this).addClass('match').removeClass('selected');
			});
			input.val('');			
		});
		
		if(select.attr('multiple'))
		{
			var multipleContainer = $('<div>').addClass('multipleContainer').insertAfter(select).append(container).click(function(){
				input.focus();
			});
			select.bind('change',function(e,data){
				
				var span = $('<div>').addClass('tag').text(input.val()).data('value',data.value).insertBefore(container);
				$('<span>').addClass('clear').text('x').appendTo(span).click(function(){
					select.children('[value='+span.data('value')+']').each(function(){this.selected=false});
					span.remove();
				});
				select.trigger('clear');
			});	

			var selectedValues = select.val();
			for(var i=0;i<selectedValues.length;i++)
			{
				list.children().each(function(){
					if($(this).data('value')==selectedValues[i])
						$(this).click();
				})
			}
		}
		else{
			container.insertAfter(select);
		}
		
	});
	return $(this);
}
