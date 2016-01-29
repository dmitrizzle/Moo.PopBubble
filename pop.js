/*----------------------------------------------------------*/
/*															*/
/*				--------- POP BUBBLE ---------				*/
/*		A light, unobstructive dialogue for MooTools		*/
/*					Requires: MooTools 1.5.2				*/
/*															*/
/*----------------------------------------------------------*/


var popBubble = {
	
	// OPTIONS:
	options: {
		offset: { x: 10, y: 20 } // offset coordinates for the bubbles
	},

	// DRAW THE BUBBLE:
	pop: function(el){
	
		// text to be shown in the bubble:
		var text = el.get('data-pop-text') || 'Empty';
		var button = el.get('data-pop-button') || false;
		var action = el.get('href') || false;
		var form = el.get('data-pop-form') || false;
		
		// position of the bubble:
		var pos = el.getPosition();
		
		
		// create HTML element for the bubble:
		var bubbleWrapper = new Element('div', {
			'class': 'bubbleWrapper',
			'html':	'<p>'+ text +'</p>',
			'styles': {
				'top': pos.y + popBubble.options.offset.y,
				'left': pos.x + popBubble.options.offset.x,
			}
		});
		
		// add bubble element to document:
		popBubble.kill(true);
		bubbleWrapper.inject(document.body, 'bottom');
		(function(){ bubbleWrapper.addClass('appear'); }).delay(1);
		
		
		// If the bubble has 'data-pop-button' attribute,
		// it will have a button that would perform action set in the 'href' attribute:
		if(button){
			var bubbleButton = new Element('a', {
				'href': action,
				'html':	button
			});
			
			// add the button to the bubble:
			bubbleButton.inject(bubbleWrapper, 'bottom');	
		}
		
		
		// If the bubble has 'data-pop-form' attribute,
		// it will import a form with the same-named ID in the HTML.
		// CURRENTLY ONLY SUPPORTING FORMS WITH SINGLE TEXT-INPUT ELEMENT.
		if(form){
		
			// copy html from memory:
			var bubbleForm = new Element('form', {
				'html': popBubble.rememberForm[form].html,
			});
			
			// add the form to the bubble:
			bubbleForm.inject(bubbleWrapper, 'bottom');
			
			
			
			
			// copy all attributes from memory:
			for (i = 0; i < popBubble.rememberForm[form].attributes.length; i++){
				var a = popBubble.rememberForm[form].attributes[i];
				bubbleForm.set(a.name, a.value);
			}
			
			 
			$$('#' + form + ' input').addEvent('click', function(e){
				e.stop();
			});
			
			
			
			
			
		}
		
		
		
		// kill bubble if clicked outside:
		window.addEvent('click', function(e){
			popBubble.kill();
		});
		
	},
	
	// KEEP ALL THE FORM ELEMENTS HERE:
	rememberForm: {},
	
	// KILL THE BUBBLE(S):
	kill: function(others){
		if($$('.bubbleWrapper')[0] && $$('.bubbleWrapper')[0].hasClass('appear')){
			$$('.bubbleWrapper').each(function(el,i){
				if(!others || i != $$('.bubbleWrapper').length){
					el.removeClass('appear');	
					(function(){  el.destroy(); }).delay(250);
				}
			});
		}
	},
	
	
	// ADD BUBBLE FUNCTION TO ALL MARKED ELEMENTS:
	init: function(){
		
		// implement rememberForm function for HTML objects
		// it will push all necessary form data to popBubble.rememberForm object:
		Element.implement({
			rememberForm: function(){
				formId = this.get('id');
				rememberForm = {
					[formId]: {
						'attributes': this.attributes,
						'html': this.get('html')
					}
				}
				Object.append(popBubble.rememberForm, rememberForm);				
			}
		});
		
		
		// scan text for .popBubble classes and add events:
		$$('.popBubble').each(function(el, i){
			el.addEvent('click', function(e){
				e.stop();
				popBubble.pop(this);
			});
			
			// remember all form elements and clear them from HTML:
			if(el.get('data-pop-form')){
				$(el.get('data-pop-form')).rememberForm();
				$(el.get('data-pop-form')).destroy();
			}
		});
		
		
	}
};


// INITIALIZE THE POP BUBBLE:
popBubble.init();