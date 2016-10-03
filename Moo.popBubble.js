/*----------------------------------------------------------*/
/*															*/
/*				--------- POP BUBBLE ---------				*/
/*		A light, unobstructive dialogue for MooTools		*/
/*					Requires: MooTools 1.5.2				*/
/*															*/
/*----------------------------------------------------------*/

var popBubble = new Class({

	// OPTIONS:
	Implements: Options,
	options: {
		offset: { x: 10, y: 20 }, 		// offset coordinates for the bubbles
		styles: {},						// custom CSS rules for pop bubble
		text: false,					// text to appear in pop bubble
		button: false,				// button text to appear in pop bubble
		action: false,					// action URL for form or button
		form: false						// form ID to be implemented in popBubble
		
	},

	// DRAW THE BUBBLE:
	pop: function(el, text){
	
		// text to be shown in the bubble:
		var text = text || el.get('data-pop-text') || this.options.text || 'Empty';
		var button = this.options.button || el.get('data-pop-button') || false;
		var action = this.options.action || el.get('href') || false;
		var form = this.options.form || el.get('data-pop-form') || false;
		
		// position of the bubble:
		var pos = el.getPosition();
		
		// generate CSS styles for the pop bubble:
		var bubbleStyles = {
			'top': pos.y + this.options.offset.y,
			'left': pos.x + this.options.offset.x,
		}
		Object.append(bubbleStyles, this.options.styles);
		
		// create HTML element for the bubble:
		var bubbleWrapper = new Element('div', {
			'class': 'bubbleWrapper',
			'html':	'<p>'+ text +'</p>',
			'styles': bubbleStyles
		});
		
		// add bubble element to document:
		this.kill(true);
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
			
			// if form is defined in options, not data-... attribute, go through devouring it:
			if(this.options.form && $(form)){
				$(form).rememberForm();
			}
			
			
			// copy html from memory:
			var bubbleForm = new Element('form', {
				'html': window.popBubbleFormObjects[form].html,
				'events': window.popBubbleFormObjects[form].events
			});
			
			// add the form to the bubble:
			bubbleForm.inject(bubbleWrapper, 'bottom');
			
			// copy all attributes from memory:
			for (i = 0; i < window.popBubbleFormObjects[form].attributes.length; i++){
				var a = window.popBubbleFormObjects[form].attributes[i];
				bubbleForm.set(a.name, a.value);
			}
			
			
			
			// stop form from input fields from closing pop bubble:
			$$('#' + form + ' input').addEvent('click', function(e){
				e.stop();
			});
			
			// focus on form textfield:
			if($$('#' + form + ' input[type="text"]'))
				$$('#' + form + ' input[type="text"]')[0].focus();
			
		}
		
		
		
		// kill bubble if clicked outside:
		var self = this;
		window.addEvent('click', function(){
			self.kill();
		});
		
	},
	

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
	scan: function(){
		var self = this;
		
		// scan text for .popBubble classes and add events:
		$$('[data-pop-text]').each(function(el, i){
			el.addEvent('click', function(e){
				e.stop();
				self.pop(el);
			});
			
			// remember all form elements and clear them from HTML:
			if(el.get('data-pop-form')){
				$(el.get('data-pop-form')).rememberForm();
			}
		});
		
		
	},
	
	initialize: function(options){
		this.setOptions(options);
		var self = this;
	
		// implement rememberForm function for HTML objects
		// it will push all necessary form data to popBubble.rememberForm object:
		if (typeof Element.rememberForm != 'function') Element.implement({
			rememberForm: function(){
			
				// gather form element properties:
				formId = this.get('id');				
				rememberForm = {
					formId: {
						'attributes': this.attributes,
						'html': this.get('html'),
						'events': this.retrieve('events'),
					}
				}
				
				// store them and destroy the original:
				if(window.popBubbleFormObjects){
					Object.append(window.popBubbleFormObjects, rememberForm);
				}else{
					window.popBubbleFormObjects = rememberForm;
				}		
				this.destroy();
			}
		});
		
	},
	
});

// scan HTML for popBubble cues
window.addEvent('domready', function(){ new popBubble().scan(); });